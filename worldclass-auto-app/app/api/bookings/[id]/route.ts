import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function auth(req: NextRequest) {
  const token = req.cookies.get('wca_admin_session')?.value;
  return token ? verifyToken(token) : null;
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!auth(req)) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: 'Invalid id.' }, { status: 400 });
  const sql = getDb();
  await sql`DELETE FROM bookings WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
