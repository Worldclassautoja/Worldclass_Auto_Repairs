import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('wca_tech_session', '', { maxAge: 0, path: '/' });
  return res;
}
