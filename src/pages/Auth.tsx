import { useState } from 'react'
import { useStore, type AccessEvent } from '../store'
import { CheckIcon, Logo, LogoutIcon, PinIcon } from '../icons'

function locationOf(e: AccessEvent) {
  const parts = [e.city, e.region, e.country].filter(Boolean)
  return parts.length ? parts.join(', ') : 'ubicación desconocida'
}

export default function Auth() {
  const { current, access, exit } = useStore()

  if (current) return <Success event={current} onExit={exit} />
  return <LoginForm onSubmit={access} />
}

function Success({ event, onExit }: { event: AccessEvent; onExit: () => void }) {
  return (
    <div className="screen">
      <div className="card success-card">
        <CheckIcon size={48} />
        <h1>¡Has iniciado sesión correctamente!</h1>
        <p className="muted">
          Hola, <b>{event.name}</b>. Registramos tu acceso desde{' '}
          <span className="inline-pin"><PinIcon size={13} />{locationOf(event)}</span>, el{' '}
          {new Date(event.timestamp).toLocaleString('es-ES')}.
        </p>
        <button className="btn btn-primary btn-lg" onClick={onExit}>
          <LogoutIcon size={18} /> Salir y probar de nuevo
        </button>
      </div>
    </div>
  )
}

function LoginForm({ onSubmit }: { onSubmit: (name: string) => Promise<void> }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    await onSubmit(username)
    setUsername('')
    setPassword('')
    setBusy(false)
  }

  return (
    <div className="screen">
      <form className="card auth-form" onSubmit={submit}>
        <div className="row gap-10 center-row">
          <Logo size={40} />
          <span className="wordmark">Instagrom</span>
        </div>
        <h2>Iniciar sesión</h2>

        <label className="field">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder=" "
            autoComplete="off"
            name="test-username"
            autoFocus
          />
          <span>Usuario o correo electrónico</span>
        </label>
        <label className="field">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder=" "
            type="password"
            autoComplete="off"
            name="test-password"
          />
          <span>Contraseña</span>
        </label>

        <button className="btn btn-primary btn-lg" disabled={!username || !password || busy}>
          {busy ? 'Comprobando…' : 'Iniciar sesión'}
        </button>

        <p className="notice">
          ⚠ Este formulario es parte de un proyecto de tesis y <b>no verifica ninguna cuenta real</b>. No
          introduzcas tu contraseña real de Instagram ni de ninguna otra red social — cualquier texto funciona
          para continuar.
        </p>
      </form>
    </div>
  )
}
