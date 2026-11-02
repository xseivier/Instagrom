export interface DeviceInfo {
  device: 'Mobile' | 'Tablet' | 'Desktop'
  os: string
  browser: string
}

/** Small hand-rolled User-Agent parser — good enough for a login-activity demo. */
export function parseUserAgent(ua: string): DeviceInfo {
  const isTablet = /iPad|Tablet/i.test(ua)
  const isMobile = !isTablet && /Mobi|Android/i.test(ua)
  const device = isTablet ? 'Tablet' : isMobile ? 'Mobile' : 'Desktop'

  let os = 'Unknown OS'
  if (/Windows/i.test(ua)) os = 'Windows'
  else if (/Mac OS X/i.test(ua)) os = 'macOS'
  else if (/Android/i.test(ua)) os = 'Android'
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS'
  else if (/Linux/i.test(ua)) os = 'Linux'

  let browser = 'Unknown browser'
  if (/Edg\//i.test(ua)) browser = 'Edge'
  else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera'
  else if (/Firefox\//i.test(ua)) browser = 'Firefox'
  else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) browser = 'Chrome'
  else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari'

  return { device, os, browser }
}
