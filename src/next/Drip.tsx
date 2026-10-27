import React from 'react'
import { ScrollTrigger, prefersReducedMotion } from '../site/motion'
import { dripApp } from '../site/data'

// Drip, my own product, presented like a product page: the phone holds still in the
// middle of the screen, leans toward the pointer, and changes screen chapter by chapter
// while the story runs beside it.

export default function Drip(): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)
  const phoneRef = React.useRef<HTMLDivElement>(null)
  const [chapter, setChapter] = React.useState(0)
  const count = dripApp.chapters.length

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const trigger = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setChapter(Math.min(count - 1, Math.floor(self.progress * count)))
    })
    return () => trigger.kill()
  }, [count])

  // A gentle lean toward the pointer, eased so it never jitters.
  React.useEffect(() => {
    const phone = phoneRef.current
    if (!phone || prefersReducedMotion() || window.matchMedia('(hover: none)').matches) return
    const target = { x: 0, y: 0 }
    const now = { x: 0, y: 0 }
    let frame = 0
    const onMove = (event: PointerEvent): void => {
      target.x = (event.clientX / window.innerWidth - 0.5) * 2
      target.y = (event.clientY / window.innerHeight - 0.5) * 2
    }
    const loop = (): void => {
      frame = requestAnimationFrame(loop)
      now.x += (target.x - now.x) * 0.06
      now.y += (target.y - now.y) * 0.06
      phone.style.transform = `rotateY(${now.x * 9 - 6}deg) rotateX(${-now.y * 6}deg)`
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    frame = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className="nd" ref={rootRef} id="drip">
      <div className="nd-stage">
        <div className="nd-copy">
          <img className="nd-mark" src={dripApp.wordmark} alt="Drip" />
          <p className="nd-tag">My own product · private beta</p>
          <ol className="nd-chapters">
            {dripApp.chapters.map((item, i) => (
              <li key={item.label} className={i === chapter ? 'is-on' : ''} aria-current={i === chapter}>
                <p className="nd-label"><span>0{i + 1}</span>{item.label}</p>
                <h3>{item.title}</h3>
                <p className="nd-text">{item.text}</p>
              </li>
            ))}
          </ol>
          <a className="nd-cta" href={dripApp.url} target="_blank" rel="noreferrer" data-cursor="join">Join the waitlist ↗</a>
        </div>

        <div className="nd-device">
          <span className="nd-glow" aria-hidden="true" />
          <div className="nd-phone" ref={phoneRef}>
            {dripApp.chapters.map((item, i) => (
              <img
                key={item.screen}
                src={item.screen}
                alt={i === chapter ? item.title : ''}
                className={i === chapter ? 'is-on' : i < chapter ? 'is-past' : ''}
              />
            ))}
          </div>
        </div>

        <ol className="nd-progress" aria-hidden="true">
          {dripApp.chapters.map((item, i) => <li key={item.label} className={i === chapter ? 'is-on' : i < chapter ? 'is-done' : ''}><span>0{i + 1}</span>{item.label}</li>)}
        </ol>
      </div>
    </section>
  )
}
