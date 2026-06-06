import crypto from 'crypto';

const SECRET = process.env.ADMIN_JWT_SECRET ?? 'wca-admin-secret-2026';
const EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 hours

export function hashPassword(pwd: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(pwd, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(pwd: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const attempt = crypto.pbkdf2Sync(pwd, salt, 10000, 64, 'sha512').toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(attempt, 'hex'));
  } catch {
    return false;
  }
}

export function createToken(payload: Record<string, unknown>): string {
  const data = JSON.stringify({ ...payload, iat: Date.now() });
  const b64 = Buffer.from(data).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(b64).digest('base64url');
  return `${b64}.${sig}`;
}

export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    const [b64, sig] = token.split('.');
    if (!b64 || !sig) return null;
    const expected = crypto.createHmac('sha256', SECRET).update(b64).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const payload = JSON.parse(Buffer.from(b64, 'base64url').toString()) as Record<string, unknown>;
    if (typeof payload.iat !== 'number' || Date.now() - payload.iat > EXPIRY_MS) return null;
    return payload;
  } catch {
    return null;
  }
}
