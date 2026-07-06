import { NextRequest, NextResponse } from 'next/server';
import { readStore, writeStore, type CollectionKey } from './store';
import { authorized } from './adminAuth';

type IdItem = { id: string } & Record<string, unknown>;

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

/** Handlers for /api/<collection> (list + create). */
export function collectionHandlers(key: CollectionKey, idPrefix: string) {
  async function GET() {
    return NextResponse.json(readStore()[key]);
  }

  async function POST(req: NextRequest) {
    if (!authorized(req)) return unauthorized();
    const body = (await req.json()) as Record<string, unknown>;
    const store = readStore();
    const id = (body.id as string) || `${idPrefix}${Date.now()}`;
    const item = { ...body, id } as IdItem;
    (store[key] as IdItem[]).unshift(item);
    writeStore(store);
    return NextResponse.json(item, { status: 201 });
  }

  return { GET, POST };
}

/** Handlers for /api/<collection>/[id] (update + delete). */
export function itemHandlers(key: CollectionKey) {
  async function PUT(
    req: NextRequest,
    ctx: { params: { id: string } },
  ) {
    if (!authorized(req)) return unauthorized();
    const body = (await req.json()) as Record<string, unknown>;
    const store = readStore();
    const list = store[key] as IdItem[];
    const idx = list.findIndex((x) => x.id === ctx.params.id);
    if (idx === -1)
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    list[idx] = { ...list[idx], ...body, id: list[idx].id };
    writeStore(store);
    return NextResponse.json(list[idx]);
  }

  async function DELETE(
    req: NextRequest,
    ctx: { params: { id: string } },
  ) {
    if (!authorized(req)) return unauthorized();
    const store = readStore();
    const filtered = (store[key] as IdItem[]).filter(
      (x) => x.id !== ctx.params.id,
    );
    (store as Record<string, unknown>)[key] = filtered;
    writeStore(store);
    return NextResponse.json({ ok: true });
  }

  return { PUT, DELETE };
}
