import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyPassword, createToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required.' }, { status: 400 });
    }

    const sql = getDb();
    const rows = await sql`SELECT id, username, password_hash FROM technicians WHERE username = ${username} AND is_active = true LIMIT 1`;
    if (!rows.length) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const user = rows[0] as { id: number; username: string; password_hash: string };
    if (!verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    /* Only allow 'admin' username for the admin portal */
    if (user.username !== 'admin') {
      return NextResponse.json({ error: 'Not authorised for admin portal.' }, { status: 403 });
    }

    const token = createToken({ sub: user.id, username: user.username, role: 'admin' });

    const res = NextResponse.json({ ok: true });
    res.cookies.set('wca_admin_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60,
      path: '/',
    });
    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
