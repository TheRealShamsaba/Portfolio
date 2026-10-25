import React from 'react'

// Ink-dot cursor; elements with data-cursor="label" grow it into a labelled disc.
export default function Cursor(): React.ReactElement | null {
  const dotRef = React.useRef<HTMLDivElement>(null)
  const ringRef = React.useRef<HTMLDivElement>(null)
  const [label, setLabel] = React.useState('')
  const [enabled] = React.useState(() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches)

  React.useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('has-cursor')
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { ...target }
    let frame = 0

    const onMove = (event: PointerEvent): void => {
      target.x = event.clientX
      target.y = event.clientY
      if (dotRef.current) dotRef.current.style.transform = `translate(${target.x}px, ${target.y}px)`
    }
    const onOver = (event: PointerEvent): void => {
      const element = (event.target as Element | null)?.closest?.('[data-cursor]')
      setLabel(element?.getAttribute('data-cursor') ?? '')
    }
    const onDown = (): void => ringRef.current?.classList.add('is-down')
    const onUp = (): void => ringRef.current?.classList.remove('is-down')
    const loop = (): void => {
      frame = requestAnimationFrame(loop)
      ring.x += (target.x - ring.x) * 0.2
      ring.y += (target.y - ring.y) * 0.2
      if (ringRef.current) ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px)`
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    frame = requestAnimationFrame(loop)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className={`cursor-ring ${label ? 'is-active' : ''}`} ref={ringRef} aria-hidden="true">
        <span>{label}</span>
      </div>
    </>
  )
}
