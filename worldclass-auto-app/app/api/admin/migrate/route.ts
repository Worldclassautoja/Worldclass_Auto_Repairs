export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('wca_admin_session')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }
  const sql = getDb();
  await sql`
    ALTER TABLE work_orders
      ADD COLUMN IF NOT EXISTS base_cost  NUMERIC(12,2),
      ADD COLUMN IF NOT EXISTS labor_rate NUMERIC(12,2) DEFAULT 3500,
      ADD COLUMN IF NOT EXISTS total_cost NUMERIC(12,2)
  `;
  return NextResponse.json({ ok: true, message: 'Migration applied.' });
}
