import { createClient } from '@libsql/client'

/**
 * Shared data layer for the serverless functions in this folder (the `_`
 * prefix tells Vercel this file is NOT a route).
 *
 * Locally (no env vars set) this writes to a plain SQLite file on disk —
 * nothing to configure, works offline. In production, set DATABASE_URL to a
 * Turso (libSQL) connection string (libsql://your-db.turso.io) and
 * DATABASE_AUTH_TOKEN to its token — the exact same code then talks to that
 * cloud database instead, so data survives between deploys and cold starts
 * instead of living on a serverless function's throwaway disk.
 */
const client = createClient({
  url: process.env.DATABASE_URL ?? 'file:./server/data/instagrom.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

let schemaReady
function ensureSchema() {
  if (!schemaReady) {
    schemaReady = client.execute(`
      CREATE TABLE IF NOT EXISTS access_events (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        user_agent TEXT,
        device TEXT,
        os TEXT,
        browser TEXT,
        ip TEXT,
        city TEXT,
        region TEXT,
        country TEXT
      )
    `)
  }
  return schemaReady
}

export async function insertEvent(e) {
  await ensureSchema()
  await client.execute({
    sql: `INSERT INTO access_events (id, name, timestamp, user_agent, device, os, browser, ip, city, region, country)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      e.id,
      e.name,
      e.timestamp,
      e.userAgent ?? null,
      e.device ?? null,
      e.os ?? null,
      e.browser ?? null,
      e.ip ?? null,
      e.city ?? null,
      e.region ?? null,
      e.country ?? null,
    ],
  })
}

export async function listEvents() {
  await ensureSchema()
  const result = await client.execute('SELECT * FROM access_events ORDER BY timestamp DESC')
  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    timestamp: Number(row.timestamp),
    userAgent: row.user_agent,
    device: row.device,
    os: row.os,
    browser: row.browser,
    ip: row.ip,
    city: row.city,
    region: row.region,
    country: row.country,
  }))
}
