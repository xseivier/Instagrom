export interface GeoInfo {
  ip?: string
  city?: string
  region?: string
  country?: string
}

/**
 * Approximate location for the login-activity log, via a public IP-geolocation
 * API (ipapi.co) called directly from the browser. This is a demo shortcut:
 * a real system would resolve this server-side from the connecting IP instead
 * of sending it to a third party on every login. Fails soft — a login never
 * blocks on this.
 */
export async function lookupGeo(): Promise<GeoInfo> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 4000)
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal })
    clearTimeout(timer)
    if (!res.ok) return {}
    const d = await res.json()
    return { ip: d.ip, city: d.city, region: d.region, country: d.country_name }
  } catch {
    return {}
  }
}
