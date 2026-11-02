import express from 'express'
import accessHandler from '../api/access.js'
import adminHandler from '../api/admin.js'

/**
 * Local-only dev server. It does NOT duplicate any logic — it just imports
 * the exact same functions that get deployed to Vercel (api/access.js,
 * api/admin.js) and mounts them, so there's one implementation, not two.
 * This exists purely so you can test the whole app with `npm run dev:all`
 * without installing or logging into the Vercel CLI.
 */
const app = express()
app.use(express.json())

app.all('/api/access', accessHandler)
app.all('/api/admin', adminHandler)

const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 5174
app.listen(PORT, '127.0.0.1', () => {
  console.log(`[instagrom-api] (dev local) escuchando en http://127.0.0.1:${PORT}`)
  console.log(`[instagrom-api] revisar accesos: http://127.0.0.1:${PORT}/api/admin`)
})
