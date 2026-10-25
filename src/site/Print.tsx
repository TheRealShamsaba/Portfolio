import React from 'react'

// Small print-production graphics borrowed from packaging and poster work.

export type HandlingIcon = 'up' | 'care' | 'fragile' | 'dry'

export function Handling({ icon }: { icon: HandlingIcon }): React.ReactElement {
  return (
    <svg viewBox="0 0 40 40" className="handling-icon" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square">
      {icon === 'up' && (
        <>
          <path d="M13 34V9M7 15l6-7 6 7" />
          <path d="M27 34V9M21 15l6-7 6 7" />
        </>
      )}
      {icon === 'care' && (
        <>
          <path d="M20 6l9 5v9l-9 5-9-5v-9z" />
          <path d="M11 11l9 5 9-5M20 16v9" />
          <path d="M4 22c2 6 6 11 16 11s14-5 16-11" />
        </>
      )}
      {icon === 'fragile' && (
        <>
          <path d="M11 5h18c0 9-3 15-9 15S11 14 11 5z" />
          <path d="M20 20v12M13 35h14" />
          <path d="M19 6l-2 5 4 1-2 4" strokeWidth="1.8" />
        </>
      )}
      {icon === 'dry' && (
        <>
          <circle cx="20" cy="20" r="6" />
          <path d="M20 3v7M20 30v7M3 20h7M30 20h7M8 8l5 5M27 27l5 5M32 8l-5 5M13 27l-5 5" />
        </>
      )}
    </svg>
  )
}

export function Barcode({ code }: { code: string }): React.ReactElement {
  const bars: { x: number; w: number }[] = []
  let x = 0
  for (const char of code.repeat(2)) {
    const value = char.charCodeAt(0)
    for (let bit = 0; bit < 4; bit += 1) {
      const width = ((value >> bit) & 3) + 1
      if (bit % 2 === 0) bars.push({ x, w: width })
      x += width + 1
    }
  }
  return (
    <figure className="barcode">
      <svg viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" aria-hidden="true">
        {bars.map((bar) => <rect key={bar.x} x={bar.x} width={bar.w} height="40" fill="currentColor" />)}
      </svg>
      <figcaption>{code}</figcaption>
    </figure>
  )
}

export function RingText({ text, className = '' }: { text: string; className?: string }): React.ReactElement {
  const id = React.useId().replace(/:/g, '')
  return (
    <svg viewBox="0 0 200 200" className={`ring-text ${className}`} aria-hidden="true">
      <defs>
        <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <text>
        <textPath href={`#${id}`} textLength="489">{text}</textPath>
      </text>
    </svg>
  )
}

export function RegMark({ className = '' }: { className?: string }): React.ReactElement {
  return (
    <svg viewBox="0 0 30 30" className={`reg-mark ${className}`} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="15" cy="15" r="7" />
      <path d="M15 0v30M0 15h30" />
    </svg>
  )
}

export function Crown({ className = '' }: { className?: string }): React.ReactElement {
  return (
    <svg viewBox="0 0 120 70" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 58L14 20l24 22 22-34 22 34 24-22 4 38z" />
      <path d="M8 66h104" />
    </svg>
  )
}
