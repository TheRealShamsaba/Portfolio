import React from 'react'

let topLayer = 20

type StickerProps = {
  children: React.ReactNode
  className?: string
  rotate?: number
  style?: React.CSSProperties
}

// A label that can be peeled off and dropped anywhere on its section.
export default function Sticker({ children, className = '', rotate = 0, style }: StickerProps): React.ReactElement {
  const ref = React.useRef<HTMLDivElement>(null)
  const drag = React.useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0, lastX: 0, tilt: 0, active: false })

  React.useEffect(() => {
    const phone = window.matchMedia('(max-width: 860px), (hover: none)')
    const reset = (): void => {
      if (!phone.matches) return
      drag.current = { x: 0, y: 0, offsetX: 0, offsetY: 0, lastX: 0, tilt: 0, active: false }
      if (ref.current) {
        ref.current.style.transform = `rotate(${rotate}deg)`
        ref.current.classList.remove('is-grabbed')
      }
    }
    reset()
    phone.addEventListener('change', reset)
    return () => phone.removeEventListener('change', reset)
  }, [rotate])

  const place = (scale: number): void => {
    const { x, y, tilt } = drag.current
    if (ref.current) ref.current.style.transform = `translate(${x}px, ${y}px) rotate(${rotate + tilt}deg) scale(${scale})`
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>): void => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || window.matchMedia('(max-width: 860px)').matches) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const state = drag.current
    state.active = true
    state.offsetX = event.clientX - state.x
    state.offsetY = event.clientY - state.y
    state.lastX = event.clientX
    topLayer += 1
    event.currentTarget.style.zIndex = String(topLayer)
    event.currentTarget.classList.add('is-grabbed')
    place(1.08)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    const state = drag.current
    if (!state.active) return
    state.x = event.clientX - state.offsetX
    state.y = event.clientY - state.offsetY
    state.tilt = Math.max(-18, Math.min(18, state.tilt * 0.8 + (event.clientX - state.lastX) * 0.9))
    state.lastX = event.clientX
    place(1.08)
  }

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>): void => {
    const state = drag.current
    state.active = false
    state.tilt = state.tilt * 0.35
    event.currentTarget.classList.remove('is-grabbed')
    place(1)
  }

  return (
    <div
      ref={ref}
      className={`sticker ${className}`}
      style={{ ...style, transform: `rotate(${rotate}deg)` }}
      data-cursor="drag"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {children}
    </div>
  )
}
