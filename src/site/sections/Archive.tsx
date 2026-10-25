import React from 'react'
import Marquee from '../Marquee'
import { gsap, prefersReducedMotion } from '../motion'
import { archive } from '../data'

const TRAIL_SIZE = 14

export default function Archive(): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)
  const trailRef = React.useRef<HTMLDivElement>(null)

  // Moving the pointer across the section deals posters out behind it, like flicking through a stack.
  React.useEffect(() => {
    const root = rootRef.current
    const layer = trailRef.current
    if (!root || !layer || prefersReducedMotion()) return
    const images = Array.from(layer.children) as HTMLImageElement[]
    let next = 0
    let poster = 0
    let last = { x: 0, y: 0 }

    const onMove = (event: PointerEvent): void => {
      if (event.pointerType !== 'mouse') return
      const rect = root.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      if (Math.hypot(x - last.x, y - last.y) < 80) return
      last = { x, y }
      const image = images[next]
      next = (next + 1) % images.length
      image.src = archive[poster].image
      poster = (poster + 1) % archive.length
      gsap.killTweensOf(image)
      gsap.set(image, { x, y, xPercent: -50, yPercent: -50, zIndex: next + 1 })
      gsap.timeline()
        .fromTo(image, { scale: 0.3, opacity: 1, rotate: gsap.utils.random(-14, 14) }, { scale: 1, duration: 0.5, ease: 'expo.out' })
        .to(image, { opacity: 0, scale: 0.85, y: y + 60, duration: 0.8, ease: 'power2.in' }, 0.55)
    }
    root.addEventListener('pointermove', onMove)
    return () => root.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <section className="archive" ref={rootRef} aria-labelledby="archive-title" data-scene="#e9e4da,#141414,#3a5bff" data-title="Before the code">
      <div className="trail" ref={trailRef} aria-hidden="true">
        {Array.from({ length: TRAIL_SIZE }, (_, i) => <img key={i} alt="" />)}
      </div>
      <header className="archive-head">
        <h2 id="archive-title">Before the code</h2>
        <p>Before I wrote software, I made posters. They taught me most of what I know about getting someone’s attention, and keeping it. Open any piece for a closer look.</p>
      </header>
      <p className="archive-touch-cue"><span>{archive.length} original pieces</span><span>Swipe the collection ↔</span></p>
      <Marquee className="archive-reel" speed={0.5}>
        {archive.map((poster, index) => (
          <a
            key={poster.id}
            className="archive-item"
            href={poster.image}
            target="_blank"
            rel="noreferrer"
            style={{ '--tilt': `${((index % 3) - 1) * 1.6}deg` } as React.CSSProperties}
            data-cursor="view"
          >
            <img src={poster.image} alt={poster.title} loading="lazy" decoding="async" />
            <span>{poster.title}</span>
          </a>
        ))}
      </Marquee>
    </section>
  )
}
