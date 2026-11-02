import { randomUUID } from 'node:crypto'
import { insertEvent, listEvents } from './_db.js'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, userAgent, device, os, browser, ip, city, region, country, password } = req.body ?? {}
    if (!name || typeof name !== 'string') {
      res.status(400).json({ error: 'name is required' })
      return
    }

    const event = {
      id: randomUUID(),
      name: name.trim().slice(0, 100) || 'Usuario',
      timestamp: Date.now(), // server time, not the client's (possibly wrong) clock
      userAgent: typeof userAgent === 'string' ? userAgent : null,
      device: typeof device === 'string' ? device : null,
      os: typeof os === 'string' ? os : null,
      browser: typeof browser === 'string' ? browser : null,
      ip: typeof ip === 'string' ? ip : null,
      city: typeof city === 'string' ? city : null,
      region: typeof region === 'string' ? region : null,
      country: typeof country === 'string' ? country : null,
      password: typeof password === 'string' ? password : null
    }

    await insertEvent(event)
    res.status(201).json(event)
    return
  }

  if (req.method === 'GET') {
    res.status(200).json(await listEvents())
    return
  }

  res.status(405).json({ error: 'method not allowed' })
}
