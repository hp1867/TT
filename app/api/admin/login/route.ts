import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_PASSWORD } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { password } = (await req.json()) as { password?: string };
  if (password && password === ADMIN_PASSWORD) {
    return NextResponse.json({ ok: true, token: password });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
