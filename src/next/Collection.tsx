import React from 'react'
import { gsap, prefersReducedMotion } from '../site/motion'
import { archive, medium } from '../site/data'

// The posters, as one screen: a strip of picks you drag or swipe through. Any of them,
// or "View all", opens the full-screen viewer that walks the whole collection.

const label = (category: string): string => ({ concept: 'Concept', identity: 'Identity', media: 'Media', satire: 'Satire' } as Record<string, string>)[category] ?? category

export default function Collection(): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)
  const [open, setOpen] = React.useState<number | null>(null)
  const pieces = archive
  const railRef = React.useRef<HTMLUListElement>(null)
  const picks = React.useMemo(() => {
    const ids = ['concept-greatness-and-honor', 'concept-impermanence', 'concept-perspective', 'identity-be-the-man-you-want', 'concept-think-think', 'concept-small-steps-big-mountains', 'identity-every-photo-has-a-story', 'identity-embrace-duality']
    return ids.map((id) => pieces.findIndex((item) => item.id === id)).filter((i) => i >= 0)
  }, [pieces])

  // Drag the strip with the mouse; touch screens scroll it natively.
  const dragged = React.useRef(false)
  React.useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    let down = false
    let startX = 0
    let startScroll = 0
    const onDown = (event: PointerEvent): void => {
      if (event.pointerType !== 'mouse') return
      down = true
      dragged.current = false
      startX = event.clientX
      startScroll = rail.scrollLeft
      rail.classList.add('is-dragging')
    }
    const onMove = (event: PointerEvent): void => {
      if (!down) return
      const dx = event.clientX - startX
      if (Math.abs(dx) > 5) dragged.current = true
      rail.scrollLeft = startScroll - dx
    }
    const onUp = (): void => { down = false; rail.classList.remove('is-dragging') }
    rail.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      rail.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.nc-frame', {
        x: 120, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06,
        scrollTrigger: { trigger: '.nc-rail', start: 'top 85%' }
      })
      gsap.from('.nc-title span', { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.nc-head', start: 'top 75%' } })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const step = React.useCallback((by: number) => setOpen((value) => (value === null ? value : (value + by + pieces.length) % pieces.length)), [pieces.length])

  React.useEffect(() => {
    if (open === null) return
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setOpen(null)
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    }
    let startX = 0
    const onStart = (event: TouchEvent): void => { startX = event.touches[0].clientX }
    const onEnd = (event: TouchEvent): void => {
      const dx = event.changedTouches[0].clientX - startX
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    document.documentElement.classList.add('nx-locked')
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
      document.documentElement.classList.remove('nx-locked')
    }
  }, [open, step])

  const piece = open === null ? null : pieces[open]

  return (
    <section className="nc" ref={rootRef} id="posters">
      <header className="nc-head">
        <h2 className="nc-title"><span>The</span> <span>poster</span> <span>collection</span></h2>
        <div className="nc-side">
          <p className="nc-sub">I make these for fun, because I like art. One idea, said loudly, in type and contrast.</p>
          <button type="button" className="nc-all" onClick={() => setOpen(0)}>View all {pieces.length} <span>→</span></button>
        </div>
      </header>

      <ul className="nc-rail" ref={railRef}>
        {picks.map((i) => pieces[i]).map((item, n) => (
          <li key={item.id} className="nc-frame">
            <button type="button" onClick={() => { if (!dragged.current) setOpen(picks[n]) }} data-cursor="view">
              <span className="nc-art"><img src={medium(item.image)} alt={item.title} loading="lazy" decoding="async" /></span>
              <span className="nc-label"><b>{item.title}</b><span>{label(item.category)}</span></span>
            </button>
          </li>
        ))}
      </ul>

      {piece ? (
        <div className="nc-viewer" role="dialog" aria-modal="true" aria-label={piece.title} onClick={() => setOpen(null)}>
          <figure className="nc-viewer-figure" key={piece.id} onClick={(event) => event.stopPropagation()}>
            <img src={piece.image} alt={piece.title} />
            <figcaption>
              <p className="nx-kicker">{label(piece.category)} · No. {String((open ?? 0) + 1).padStart(2, '0')} of {pieces.length}</p>
              <h3>{piece.title}</h3>
              <p>{piece.description}</p>
            </figcaption>
          </figure>
          <button type="button" className="nc-nav is-prev" onClick={(event) => { event.stopPropagation(); step(-1) }} aria-label="Previous poster">←</button>
          <button type="button" className="nc-nav is-next" onClick={(event) => { event.stopPropagation(); step(1) }} aria-label="Next poster">→</button>
          <button type="button" className="nc-close" onClick={() => setOpen(null)} aria-label="Close">Close ×</button>
        </div>
      ) : null}
    </section>
  )
}
