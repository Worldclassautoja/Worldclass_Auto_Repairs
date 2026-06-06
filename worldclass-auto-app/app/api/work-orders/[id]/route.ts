export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function adminGuard(req: NextRequest) {
  const token = req.cookies.get('wca_admin_session')?.value;
  return token ? verifyToken(token) : null;
}

/* PATCH — update WO fields */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!adminGuard(req)) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  const id = Number(params.id);
  const b = await req.json();
  const sql = getDb();

  const fields: string[] = [];
  const values: unknown[] = [];

  const allowed = ['status','priority','assigned_to','estimated_hours','due_date','notes','title','vehicle','customer_name','service_type','base_cost','labor_rate','total_cost','actual_hours'];
  for (const key of allowed) {
    if (key in b) { fields.push(key); values.push(b[key]); }
  }

  if (!fields.length) return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });

  /* Build dynamic SET using template tag per field */
  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
  values.push(id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rows = await (sql as any)(`UPDATE work_orders SET ${setClause} WHERE id = $${values.length} RETURNING *`, values);
  return NextResponse.json(rows[0]);
}

/* DELETE — remove WO */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!adminGuard(req)) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  const sql = getDb();
  await sql`DELETE FROM work_orders WHERE id = ${Number(params.id)}`;
  return NextResponse.json({ ok: true });
}
