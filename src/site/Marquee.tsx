import React from 'react'
import { getLenis, prefersReducedMotion } from './motion'

type MarqueeProps = {
  children: React.ReactNode
  className?: string
  speed?: number
  reverse?: boolean
}

// Endless strip that speeds up with scroll velocity and flips with scroll direction.
export default function Marquee({ children, className = '', speed = 0.6, reverse = false }: MarqueeProps): React.ReactElement {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const groupRef = React.useRef<HTMLDivElement>(null)
  const paused = React.useRef(false)

  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const manual = window.matchMedia('(max-width: 899px), (hover: none)')
    let x = 0
    let direction = 1
    let frame = 0
    const loop = (): void => {
      frame = requestAnimationFrame(loop)
      if (paused.current || manual.matches) return
      const width = groupRef.current?.offsetWidth ?? 0
      if (!width || !trackRef.current) return
      const lenis = getLenis()
      const velocity = lenis?.velocity ?? 0
      if (lenis && lenis.direction !== 0) direction = lenis.direction
      const step = (speed + Math.min(Math.abs(velocity) * 0.25, 14)) * direction * (reverse ? -1 : 1)
      x = (x - step) % width
      if (x > 0) x -= width
      trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [speed, reverse])

  return (
    <div className={`marquee ${className}`} onMouseEnter={() => { paused.current = true }} onMouseLeave={() => { paused.current = false }}>
      <div className="marquee-track" ref={trackRef}>
        <div className="marquee-group" ref={groupRef}>{children}</div>
        <div className="marquee-group marquee-copy" aria-hidden="true" ref={(node) => { if (node) node.inert = true }}>{children}</div>
      </div>
    </div>
  )
}
