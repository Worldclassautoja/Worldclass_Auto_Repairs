import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { sendBookingEmails } from '@/lib/email';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

/* GET — admin only */
export async function GET(req: NextRequest) {
  const token = req.cookies.get('wca_admin_session')?.value;
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  }
  const sql = getDb();
  const rows = await sql`SELECT * FROM bookings ORDER BY created_at DESC`;
  return NextResponse.json(rows, { headers: CORS });
}

/* POST — public */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, vehicle_make, vehicle_model, service_type, preferred_date, description } = body;

    if (!name || !phone || !email || !vehicle_make || !vehicle_model || !service_type || !preferred_date) {
      return NextResponse.json({ error: 'Required fields missing.' }, { status: 400 });
    }

    const cleanPhone = String(phone).replace(/\D/g, '');

    const sql = getDb();
    const rows = await sql`
      INSERT INTO bookings (name, phone, email, vehicle_make, vehicle_model, service_type, preferred_date, description)
      VALUES (${name}, ${cleanPhone}, ${email}, ${vehicle_make}, ${vehicle_model}, ${service_type}, ${preferred_date}, ${description ?? null})
      RETURNING *
    `;

    const booking = rows[0];
    const reference = `WCA-${String(booking.id).padStart(5, '0')}`;

    /* Send confirmation emails — non-blocking; don't fail the response if email fails */
    if (process.env.RESEND_API_KEY) {
      sendBookingEmails({
        reference,
        name,
        email,
        phone: cleanPhone,
        vehicle_make,
        vehicle_model,
        service_type,
        preferred_date,
        description,
      }).catch((err) => console.error('Email send error:', err));
    }

    return NextResponse.json({ ...booking, reference }, { status: 201, headers: CORS });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500, headers: CORS });
  }
}
