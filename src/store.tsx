import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { parseUserAgent } from './lib/device'
import { lookupGeo } from './lib/geo'

/**
 * A single recorded access attempt.
 *
 * This project intentionally accepts ANY username/password typed into the
 * form — it never checks them against a real account, since the research
 * goal is only to see where people access the site from, not to run real
 * authentication. Only the typed username (used purely as a display name)
 * is ever kept here. Whatever the visitor types as a "password" lives in
 * the form's local component state for the UI's look and feel and is
 * discarded right after submit — it is never passed into this store, never
 * logged, and never written to storage.
 */
export interface AccessEvent {
  id: string
  name: string
  timestamp: number
  userAgent: string
  device: string
  os: string
  browser: string
  ip?: string
  city?: string
  region?: string
  country?: string
}

interface Db {
  events: AccessEvent[]
  currentId: string | null
}

const KEY = 'instagrom-access-log-v1'

function load(): Db {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Db
  } catch {
    /* fall through to empty db */
  }
  return { events: [], currentId: null }
}

interface Store {
  current: AccessEvent | null
  access: (name: string) => Promise<void>
  exit: () => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<Db>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(db))
    } catch {
      /* storage full or blocked: keep working in memory */
    }
  }, [db])

  const store = useMemo<Store>(() => {
    const current = db.events.find((e) => e.id === db.currentId) ?? null
    return {
      current,
      async access(name) {
        const ua = navigator.userAgent
        const { device, os, browser } = parseUserAgent(ua)
        const geo = await lookupGeo()
        const payload = { name: name.trim() || 'Usuario', userAgent: ua, device, os, browser, ...geo }

        // The local SQLite database (via the backend) is the source of truth,
        // since the whole point is one shared record across every device that
        // tests this. If the backend isn't reachable, fall back to a
        // browser-only event so the demo still works — it just won't show up
        // in the shared database.
        let event: AccessEvent
        try {
          const res = await fetch('/api/access', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
          if (!res.ok) throw new Error(`status ${res.status}`)
          event = await res.json()
        } catch (err) {
          console.warn('No se pudo guardar el acceso en la base de datos local; queda solo en este navegador.', err)
          event = { id: crypto.randomUUID(), timestamp: Date.now(), ...payload }
        }

        setDb((d) => ({ events: [event, ...d.events], currentId: event.id }))
      },
      exit: () => setDb((d) => ({ ...d, currentId: null })),
    }
  }, [db])

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}
