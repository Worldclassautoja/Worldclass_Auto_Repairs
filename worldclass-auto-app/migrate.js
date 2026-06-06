// migrate.js — run once: node migrate.js
const { neon } = require('@neondatabase/serverless');
const crypto = require('crypto');

require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

function hashPassword(pwd) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(pwd, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

async function migrate() {
  console.log('Running migration...');

  await sql`CREATE TABLE IF NOT EXISTS bookings (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    phone         TEXT NOT NULL,
    email         TEXT NOT NULL,
    vehicle_make  TEXT NOT NULL,
    vehicle_model TEXT NOT NULL,
    service_type  TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    description   TEXT,
    created_at    TIMESTAMPTZ DEFAULT now()
  )`;
  console.log('✓ bookings table ready');

  await sql`CREATE TABLE IF NOT EXISTS technicians (
    id            SERIAL PRIMARY KEY,
    username      TEXT UNIQUE NOT NULL,
    name          TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    specialty     TEXT,
    is_active     BOOLEAN DEFAULT true,
    created_at    TIMESTAMPTZ DEFAULT now()
  )`;
  console.log('✓ technicians table ready');

  await sql`CREATE TABLE IF NOT EXISTS work_orders (
    id              SERIAL PRIMARY KEY,
    title           TEXT NOT NULL,
    vehicle         TEXT,
    customer_name   TEXT,
    service_type    TEXT,
    status          TEXT DEFAULT 'pending',
    priority        TEXT DEFAULT 'medium',
    assigned_to     INTEGER REFERENCES technicians(id),
    estimated_hours NUMERIC(5,2),
    actual_hours    NUMERIC(5,2),
    due_date        DATE,
    notes           TEXT,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT now()
  )`;
  console.log('✓ work_orders table ready');

  const techs = [
    { u: 'admin',  n: 'Administrator',  p: 'admin',   s: 'Admin'              },
    { u: 'tech1',  n: 'Marcus Campbell', p: 'tech123', s: 'General Mechanic'   },
    { u: 'tech2',  n: 'Andre Williams',  p: 'tech123', s: 'Electrical Systems' },
    { u: 'tech3',  n: 'Simone Gordon',   p: 'tech123', s: 'Diagnostics'        },
  ];

  for (const t of techs) {
    const h = hashPassword(t.p);
    await sql`
      INSERT INTO technicians (username, name, password_hash, specialty)
      VALUES (${t.u}, ${t.n}, ${h}, ${t.s})
      ON CONFLICT (username) DO NOTHING
    `;
    console.log(`✓ seeded ${t.u}`);
  }

  console.log('\nMigration complete.');
}

migrate().catch(err => { console.error(err); process.exit(1); });
