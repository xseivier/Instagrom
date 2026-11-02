import type { ReactNode, SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

function Svg({ size = 24, children, ...rest }: P & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const LogoutIcon = (p: P) => (
  <Svg {...p}>
    <path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H9" />
  </Svg>
)
export const CheckIcon = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="m7.5 12.5 3 3 6-6.5" />
  </Svg>
)
export const PinIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.3" />
  </Svg>
)

/** Original app mark: a gradient tile with a sparkle. */
export function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      aria-label="Instagram"
      style={{ display: 'block' }}
    >
      <defs>
        {/* Gradiente de fondo (base radial + lineal) */}
        <radialGradient id="ig-radial" cx="20%" cy="100%" r="120%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>

      {/* Fondo con bordes redondeados */}
      <rect width="40" height="40" rx="10" fill="url(#ig-radial)" />

      {/* Icono de la cámara */}
      <g fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Cuerpo exterior de la cámara */}
        <rect x="9" y="9" width="22" height="22" rx="6" />

        {/* Lente central */}
        <circle cx="20" cy="20" r="4.5" />
      </g>

      {/* Punto del flash */}
      <circle cx="25.5" cy="14.5" r="1.2" fill="#ffffff" />
    </svg>
  );
}
