import { NextRequest, NextResponse } from 'next/server';
import { readStore, writeStore } from '@/lib/store';
import { authorized } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(readStore().site);
}

export async function PUT(req: NextRequest) {
  if (!authorized(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = (await req.json()) as Record<string, unknown>;
  const store = readStore();
  store.site = { ...store.site, ...body };
  writeStore(store);
  return NextResponse.json(store.site);
}
