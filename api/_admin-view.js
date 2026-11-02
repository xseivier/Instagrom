function locationOf(e) {
  const parts = [e.city, e.region, e.country].filter(Boolean)
  return parts.length ? parts.join(', ') : 'Ubicación desconocida'
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

/** Minimal server-rendered page — this is for the researcher's own review, never shown to test participants. */
export function renderAdminHtml(events) {
  const rows = events
    .map(
      (e) => `
        <tr>
          <td>${escapeHtml(e.name)}</td>
          <td>${escapeHtml(e.device)} · ${escapeHtml(e.os)} · ${escapeHtml(e.browser)}</td>
          <td>${escapeHtml(locationOf(e))}</td>
          <td class="mono">${escapeHtml(e.ip ?? '—')}</td>
          <td>${new Date(e.timestamp).toLocaleString('es-ES')}</td>
        </tr>`,
    )
    .join('')

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="5">
<title>Instagrom · Registro de accesos</title>
<style>
  :root { color-scheme: dark; }
  body { margin: 0; padding: 32px; background: #000; color: #f5f5f5; font-family: system-ui, sans-serif; }
  h1 { font-size: 18px; margin: 0 0 4px; }
  p.muted { color: #a8a8a8; font-size: 13px; margin: 0 0 24px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid #262626; }
  th { color: #a8a8a8; font-weight: 600; text-transform: uppercase; font-size: 11px; letter-spacing: .4px; }
  .mono { font-family: ui-monospace, Consolas, monospace; }
  .empty { padding: 40px 0; color: #a8a8a8; text-align: center; }
</style>
</head>
<body>
  <h1>Registro de accesos — Instagrom</h1>
  <p class="muted">${events.length} registro${events.length === 1 ? '' : 's'} en la base de datos. Esta página se refresca sola cada 5s. Solo tú deberías ver esto — no está enlazada desde la app.</p>
  ${
    events.length === 0
      ? '<p class="empty">Todavía no hay accesos registrados.</p>'
      : `<table>
          <thead><tr><th>Usuario</th><th>Dispositivo</th><th>Ubicación</th><th>IP</th><th>Hora</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>`
  }
</body>
</html>`
}
