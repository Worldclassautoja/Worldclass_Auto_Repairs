export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

function techGuard(req: NextRequest) {
  const token = req.cookies.get('wca_tech_session')?.value;
  return token ? verifyToken(token) : null;
}

/* GET — WOs assigned to authenticated tech, ordered active → pending → completed */
export async function GET(req: NextRequest) {
  const payload = techGuard(req);
  if (!payload || payload.role !== 'technician') {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }
  const sql = getDb();
  const rows = await sql`
    SELECT *,
      CASE status
        WHEN 'active'    THEN 1
        WHEN 'pending'   THEN 2
        WHEN 'completed' THEN 3
        ELSE 4
      END AS sort_order
    FROM work_orders
    WHERE assigned_to = ${payload.id}
    ORDER BY sort_order, due_date ASC NULLS LAST, created_at DESC
  `;
  return NextResponse.json(rows);
}

/* PATCH — start or complete a WO */
export async function PATCH(req: NextRequest) {
  const payload = techGuard(req);
  if (!payload || payload.role !== 'technician') {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }

  const b = await req.json();
  const { id, action, actual_hours } = b;
  if (!id || !action) return NextResponse.json({ error: 'id and action required.' }, { status: 400 });

  const sql = getDb();

  /* Ensure this WO belongs to the authenticated tech */
  const check = await sql`SELECT id, assigned_to FROM work_orders WHERE id = ${id}`;
  if (!check[0]) return NextResponse.json({ error: 'Work order not found.' }, { status: 404 });
  if (check[0].assigned_to !== payload.id) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  if (action === 'start') {
    const rows = await sql`
      UPDATE work_orders SET status = 'active', started_at = NOW()
      WHERE id = ${id} AND status = 'pending'
      RETURNING *
    `;
    if (!rows[0]) return NextResponse.json({ error: 'Work order is not in pending state.' }, { status: 409 });
    return NextResponse.json(rows[0]);
  }

  if (action === 'complete') {
    const hours = actual_hours != null ? Number(actual_hours) : null;
    /* Fetch cost fields to compute total_cost */
    const wo = await sql`SELECT estimated_hours, base_cost, labor_rate FROM work_orders WHERE id = ${id}`;
    let totalCost: number | null = null;
    if (wo[0] && hours != null) {
      const est   = Number(wo[0].estimated_hours ?? 0);
      const base  = Number(wo[0].base_cost ?? 0);
      const rate  = Number(wo[0].labor_rate ?? 3500);
      const extra = Math.max(0, hours - est);
      totalCost   = base + extra * rate;
    }
    const rows = await sql`
      UPDATE work_orders
      SET status = 'completed', completed_at = NOW(), actual_hours = ${hours}, total_cost = ${totalCost}
      WHERE id = ${id} AND status = 'active'
      RETURNING *
    `;
    if (!rows[0]) return NextResponse.json({ error: 'Work order is not in active state.' }, { status: 409 });
    return NextResponse.json(rows[0]);
  }

  return NextResponse.json({ error: 'Unknown action. Use "start" or "complete".' }, { status: 400 });
}
