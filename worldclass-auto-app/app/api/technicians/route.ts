export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { hashPassword, verifyToken } from '@/lib/auth';

function adminGuard(req: NextRequest) {
  const token = req.cookies.get('wca_admin_session')?.value;
  return token ? verifyToken(token) : null;
}

/* GET — active technicians with open WO count */
export async function GET(req: NextRequest) {
  if (!adminGuard(req)) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  const sql = getDb();
  const rows = await sql`
    SELECT t.id, t.name, t.username, t.specialty, t.is_active, t.created_at,
           COUNT(w.id) FILTER (WHERE w.status IN ('pending','active')) AS active_wos,
           COUNT(w.id) AS total_wos
    FROM technicians t
    LEFT JOIN work_orders w ON w.assigned_to = t.id
    WHERE t.is_active = true AND t.username != 'admin'
    GROUP BY t.id
    ORDER BY t.name
  `;
  return NextResponse.json(rows);
}

/* POST — create technician */
export async function POST(req: NextRequest) {
  if (!adminGuard(req)) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  try {
    const b = await req.json();
    const { name, username, password, specialty } = b;
    if (!name || !username || !password) {
      return NextResponse.json({ error: 'name, username, and password are required.' }, { status: 400 });
    }
    const passwordHash = await hashPassword(password);
    const sql = getDb();
    const rows = await sql`
      INSERT INTO technicians (name, username, password_hash, specialty)
      VALUES (${name}, ${username}, ${passwordHash}, ${specialty ?? null})
      RETURNING id, name, username, specialty, created_at
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '';
    if (msg.includes('unique') || msg.includes('duplicate')) {
      return NextResponse.json({ error: 'Username already taken.' }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
