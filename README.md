# Instagrom

Proyecto de tesis sobre seguimiento de actividad de inicio de sesión en sitios web. **No es Instagram ni está afiliado con Instagram/Meta** — es un clon visual simplificado, hecho solo con fines de prueba e investigación.

La app tiene una sola pantalla: un formulario de "inicio de sesión" que **acepta cualquier usuario y contraseña** (no verifica ninguna cuenta real — lee el aviso dentro del propio formulario) y, tras enviarlo, registra el dispositivo, navegador, ubicación aproximada y hora del acceso en una base de datos, mostrando un mensaje de bienvenida con esos datos.

## Cómo correrlo en local

```bash
npm install
npm run dev:all
```

Esto levanta el frontend (Vite, puerto 5173) y el backend (puerto 5174) juntos. Sin configurar nada más, los datos se guardan en un archivo SQLite local (`server/data/instagrom.db`), ignorado por git.

- App: http://localhost:5173
- Panel de accesos registrados (solo para ti, no enlazado desde la app): http://localhost:5173/api/admin

Para probar desde un celular en la misma red Wi-Fi, usa la URL "Network" que imprime la consola al correr `npm run dev:all`.

## Despliegue (Vercel + Turso)

El backend son funciones serverless en [`api/`](api/), pensadas para desplegarse junto con el frontend en el mismo proyecto de Vercel — no hace falta un servidor aparte.

1. Crea una base de datos gratis en [turso.tech](https://turso.tech) y copia su **Database URL** y su **token**.
2. Importa este repo en Vercel.
3. En *Project Settings → Environment Variables*, agrega:
   ```
   DATABASE_URL=libsql://tu-base.turso.io
   DATABASE_AUTH_TOKEN=tu-token
   ```
4. Deploy. Los accesos quedan visibles en `https://tu-proyecto.vercel.app/api/admin`.

Ver [`.env.example`](.env.example) para más detalle.

## Estructura

- `src/` — frontend (React + Vite).
- `api/` — backend: funciones que Vercel despliega como serverless (`access.js`, `admin.js`) más la capa de datos compartida (`_db.js`, con prefijo `_` para que Vercel no la trate como ruta).
- `server/dev-server.js` — únicamente para desarrollo local; reutiliza las mismas funciones de `api/` para que no haya dos implementaciones distintas.
- `email/` — plantilla de correo de invitación para testers, con aviso de que es un clon de prueba.
