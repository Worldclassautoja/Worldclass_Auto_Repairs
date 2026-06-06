export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword, verifyToken } from '@/lib/auth';

function adminGuard(req: NextRequest) {
  const token = req.cookies.get('wca_admin_session')?.value;
  return token ? verifyToken(token) : null;
}

/* PATCH — edit name, specialty, or password */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!adminGuard(req)) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  const id = Number(params.id);
  const b = await req.json();
  const sql = getDb();

  const fields: string[] = [];
  const values: unknown[] = [];

  if (b.name)      { fields.push('name');      values.push(b.name); }
  if (b.specialty !== undefined) { fields.push('specialty'); values.push(b.specialty); }
  if (b.password)  {
    const hash = await hashPassword(b.password);
    fields.push('password_hash');
    values.push(hash);
  }

  if (!fields.length) return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });

  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
  values.push(id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = await (sql as any)(`UPDATE technicians SET ${setClause} WHERE id = $${values.length} RETURNING id, name, username, specialty`, values);
  return NextResponse.json(rows[0]);
}

/* DELETE — soft delete */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!adminGuard(req)) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  const sql = getDb();
  await sql`UPDATE technicians SET is_active = false WHERE id = ${Number(params.id)}`;
  return NextResponse.json({ ok: true });
}
