export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function adminGuard(req: NextRequest) {
  const token = req.cookies.get('wca_admin_session')?.value;
  return token ? verifyToken(token) : null;
}

/* GET — all WOs with assigned tech name */
export async function GET(req: NextRequest) {
  if (!adminGuard(req)) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  const sql = getDb();
  const rows = await sql`
    SELECT w.*, t.name AS tech_name
    FROM work_orders w
    LEFT JOIN technicians t ON t.id = w.assigned_to
    ORDER BY w.created_at DESC
  `;
  return NextResponse.json(rows);
}

/* POST — create WO */
export async function POST(req: NextRequest) {
  if (!adminGuard(req)) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  try {
    const b = await req.json();
    const sql = getDb();
    const rows = await sql`
      INSERT INTO work_orders (title, vehicle, customer_name, service_type, priority, assigned_to, estimated_hours, due_date, notes)
      VALUES (
        ${b.title},
        ${b.vehicle ?? null},
        ${b.customer_name ?? null},
        ${b.service_type ?? null},
        ${b.priority ?? 'medium'},
        ${b.assigned_to || null},
        ${b.estimated_hours || null},
        ${b.due_date || null},
        ${b.notes ?? null}
      )
      RETURNING *
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
