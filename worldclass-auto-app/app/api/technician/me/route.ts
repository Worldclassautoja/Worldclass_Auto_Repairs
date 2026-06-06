import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('wca_tech_session')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || payload.role !== 'technician') {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const sql = getDb();
  const rows = await sql`
    SELECT t.id, t.name, t.username, t.specialty,
           COUNT(w.id) FILTER (WHERE w.status = 'active') AS active_work_orders
    FROM technicians t
    LEFT JOIN work_orders w ON w.assigned_to = t.id
    WHERE t.id = ${payload.id} AND t.is_active = true
    GROUP BY t.id
  `;
  if (!rows[0]) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  return NextResponse.json(rows[0]);
}
