import { listEvents } from './_db.js'
import { renderAdminHtml } from './_admin-view.js'

// Researcher-only view of the database. Not linked from the app itself.
export default async function handler(_req, res) {
  const events = await listEvents()
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.status(200).send(renderAdminHtml(events))
}
