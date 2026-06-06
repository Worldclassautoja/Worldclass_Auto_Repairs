import { Resend } from 'resend';

const ADMIN_EMAIL  = 'worldclassautorepairs1@gmail.com';
const FROM_ADDRESS = process.env.EMAIL_FROM ?? 'WorldClass Auto <onboarding@resend.dev>';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface BookingDetails {
  reference:      string;
  name:           string;
  email:          string;
  phone:          string;
  vehicle_make:   string;
  vehicle_model:  string;
  service_type:   string;
  preferred_date: string;
  description?:   string | null;
}

/* ─── shared layout wrapper ──────────────────────────────── */
function wrap(body: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0A0A0A;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#111111;border-radius:12px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);">

        <!-- Header -->
        <tr>
          <td style="background:#111111;border-bottom:3px solid #F5A623;padding:28px 40px;text-align:center;">
            <p style="margin:0;font-size:28px;font-weight:900;color:#F5A623;letter-spacing:4px;">WCA</p>
            <p style="margin:4px 0 0;font-size:9px;font-weight:700;color:rgba(255,255,255,0.4);letter-spacing:3px;text-transform:uppercase;">World Class Auto</p>
          </td>
        </tr>

        <!-- Body -->
        ${body}

        <!-- Footer -->
        <tr>
          <td style="background:#080808;padding:24px 40px;border-top:1px solid rgba(255,255,255,0.06);">
            <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);text-align:center;line-height:1.8;">
              51B Waltham Park Rd, Shop 8 Padlock Plaza, Jamaica<br>
              (876) 672-0125 &nbsp;·&nbsp; (876) 254-6914 &nbsp;·&nbsp; (876) 462-9709 (WhatsApp)<br>
              worldclassautorepairs1@gmail.com
            </p>
            <p style="margin:16px 0 0;font-size:10px;color:rgba(255,255,255,0.15);text-align:center;">
              &copy; ${new Date().getFullYear()} WorldClass Auto. All rights reserved.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ─── row helper ─────────────────────────────────────────── */
function row(label: string, value: string) {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;color:rgba(255,255,255,0.45);font-weight:600;letter-spacing:1px;text-transform:uppercase;width:40%;vertical-align:top;">${label}</td>
    <td style="padding:10px 0 10px 16px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#F9FAFB;font-weight:500;vertical-align:top;">${value}</td>
  </tr>`;
}

/* ─── customer confirmation email ────────────────────────── */
function customerHtml(b: BookingDetails) {
  const dateLabel = new Date(b.preferred_date).toLocaleDateString('en-JM', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const body = `
    <tr>
      <td style="padding:36px 40px 0;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#F5A623;letter-spacing:2px;text-transform:uppercase;">Booking Request Received</p>
        <h1 style="margin:0 0 8px;font-size:28px;font-weight:900;color:#FFFFFF;line-height:1.1;">You're all set,<br>${b.name.split(' ')[0]}!</h1>
        <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.6);line-height:1.7;">
          We've received your booking request. Our team will review it and confirm your appointment within 24 hours via phone or email.
        </p>
      </td>
    </tr>

    <!-- Reference badge -->
    <tr>
      <td style="padding:28px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(245,166,35,0.1);border:1px solid rgba(245,166,35,0.25);border-radius:8px;padding:0;">
          <tr>
            <td style="padding:18px 24px;text-align:center;">
              <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:rgba(245,166,35,0.7);letter-spacing:2px;text-transform:uppercase;">Your Reference Number</p>
              <p style="margin:0;font-size:26px;font-weight:900;color:#F5A623;letter-spacing:4px;">${b.reference}</p>
              <p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.35);">Keep this for your records</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Details -->
    <tr>
      <td style="padding:0 40px 36px;">
        <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:rgba(255,255,255,0.5);letter-spacing:2px;text-transform:uppercase;">Booking Details</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${row('Vehicle', `${b.vehicle_make} ${b.vehicle_model}`)}
          ${row('Service', b.service_type)}
          ${row('Date Requested', dateLabel)}
          ${row('Phone', b.phone)}
          ${b.description ? row('Notes', b.description) : ''}
        </table>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding:0 40px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:8px;">
          <tr>
            <td style="padding:20px 24px;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#FFFFFF;">Need to reach us sooner?</p>
              <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.5);line-height:1.6;">
                Call <strong style="color:#F5A623;">(876) 672-0125</strong> or WhatsApp <strong style="color:#F5A623;">(876) 462-9709</strong><br>
                Mon–Fri: 8am–6pm &nbsp;·&nbsp; Sat: 8am–5pm
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
  return wrap(body);
}

/* ─── admin notification email ───────────────────────────── */
function adminHtml(b: BookingDetails) {
  const dateLabel = new Date(b.preferred_date).toLocaleDateString('en-JM', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  const body = `
    <tr>
      <td style="padding:36px 40px 0;">
        <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#F5A623;letter-spacing:2px;text-transform:uppercase;">New Booking Request</p>
        <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:#FFFFFF;line-height:1.1;">${b.reference}</h1>
        <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.6);">
          Submitted ${new Date().toLocaleString('en-JM', { dateStyle: 'medium', timeStyle: 'short' })}
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding:28px 40px 36px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${row('Customer', b.name)}
          ${row('Email', b.email)}
          ${row('Phone', b.phone)}
          ${row('Vehicle', `${b.vehicle_make} ${b.vehicle_model}`)}
          ${row('Service', b.service_type)}
          ${row('Requested Date', dateLabel)}
          ${b.description ? row('Notes', b.description) : ''}
        </table>
      </td>
    </tr>

    <!-- Dashboard link -->
    <tr>
      <td style="padding:0 40px 36px;text-align:center;">
        <a href="${process.env.NEXT_PUBLIC_URL ?? 'http://localhost:3000'}/admin/dashboard"
           style="display:inline-block;background:#F5A623;color:#0A0A0A;padding:14px 32px;border-radius:6px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;text-decoration:none;">
          View in Dashboard
        </a>
      </td>
    </tr>`;
  return wrap(body);
}

/* ─── exported send function ─────────────────────────────── */
export async function sendBookingEmails(b: BookingDetails) {
  const dateLabel = new Date(b.preferred_date).toLocaleDateString('en-JM', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const resend = getResend();
  const [customerResult, adminResult] = await Promise.allSettled([
    resend.emails.send({
      from: FROM_ADDRESS,
      to:   b.email,
      subject: `Booking Received — ${b.reference} | WorldClass Auto`,
      html: customerHtml(b),
    }),
    resend.emails.send({
      from: FROM_ADDRESS,
      to:   ADMIN_EMAIL,
      subject: `New Booking: ${b.reference} — ${b.name} | ${b.service_type} on ${dateLabel}`,
      html: adminHtml(b),
    }),
  ]);

  if (customerResult.status === 'rejected') console.error('Customer email failed:', customerResult.reason);
  if (adminResult.status   === 'rejected') console.error('Admin email failed:',    adminResult.reason);
}
