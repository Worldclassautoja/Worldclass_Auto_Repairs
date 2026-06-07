import { neon } from '@neondatabase/serverless';

// Module-level singleton — reused across warm serverless invocations.
// fetchConnectionCache keeps the underlying HTTP connection alive between
// queries so Neon's cold-start doesn't drop the socket mid-request.
const url = process.env.DATABASE_URL;
const _sql = url ? neon(url, { fetchConnectionCache: true }) : null;

export function getDb() {
  if (!_sql) throw new Error('DATABASE_URL is not set');
  return _sql;
}

// Wraps a DB call with one automatic retry on transient socket errors.
// Use: await withRetry(() => sql`SELECT ...`)
export async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('socket') || msg.includes('connect') || msg.includes('ECONNRESET')) {
      await new Promise(r => setTimeout(r, 500));
      return fn();
    }
    throw err;
  }
}
