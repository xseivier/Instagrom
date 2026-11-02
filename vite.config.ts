import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // expose on the LAN so phones on the same Wi-Fi can open this
    proxy: {
      // Forwards to the local backend (server/index.js) so the browser only
      // ever talks to one origin; the API port itself stays localhost-only.
      '/api': 'http://127.0.0.1:5174',
    },
  },
})
