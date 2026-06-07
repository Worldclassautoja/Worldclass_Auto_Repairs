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
  const wo = rows[0];

  /* Auto-sync parent booking status when a WO status changes */
  if ('status' in b && wo?.booking_id) {
    const bookingId = wo.booking_id;
    if (b.status === 'completed') {
      /* If every WO for this booking is now completed, mark booking completed */
      const stats = await sql`
        SELECT COUNT(*) AS total,
               COUNT(*) FILTER (WHERE status = 'completed') AS done
        FROM work_orders WHERE booking_id = ${bookingId}
      `;
      if (Number(stats[0].total) > 0 && Number(stats[0].total) === Number(stats[0].done)) {
        await sql`UPDATE bookings SET status = 'completed' WHERE id = ${bookingId}`;
      }
    } else {
      /* WO moved back from completed — reopen the booking if it was marked complete */
      await sql`UPDATE bookings SET status = 'assigned' WHERE id = ${bookingId} AND status = 'completed'`;
    }
  }

  return NextResponse.json(wo);
}

/* DELETE — remove WO */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!adminGuard(req)) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  const sql = getDb();
  await sql`DELETE FROM work_orders WHERE id = ${Number(params.id)}`;
  return NextResponse.json({ ok: true });
}
