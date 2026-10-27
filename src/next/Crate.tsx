import React from 'react'

// My posters as sleeves in a milk crate, flipped the way you dig through records: the
// ones you've passed tip forward toward you, the next one rises, and the rest fan a
// little as your hand moves over them. Pulling one out slides it up out of the crate.

type Poster = { id: string; title: string; image: string; description: string }

export default function Crate({ posters, onOpen }: { posters: Poster[]; onOpen: (i: number) => void }): React.ReactElement {
  const [at, setAt] = React.useState(0)
  const [pulling, setPulling] = React.useState(false)
  const boxRef = React.useRef<HTMLDivElement>(null)
  const swipe = React.useRef(0)
  const go = (by: number): void => setAt((v) => Math.max(0, Math.min(posters.length - 1, v + by)))
  const pull = (): void => {
    if (pulling) return
    setPulling(true)
    window.setTimeout(() => { onOpen(at); setPulling(false) }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420)
  }
  return (
    <div
      className="cr"
      tabIndex={0}
      aria-label="A crate of my posters. Use the arrow keys to flip through, Enter to pull one out."
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') { event.preventDefault(); go(1) }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') { event.preventDefault(); go(-1) }
        if (event.key === 'Enter') pull()
      }}
    >
      <div
        className="cr-box"
        ref={boxRef}
        onPointerMove={(event) => {
          const box = boxRef.current?.getBoundingClientRect()
          if (box) boxRef.current!.style.setProperty('--fan', (((event.clientX - box.left) / box.width) * 2 - 1).toFixed(3))
        }}
        onPointerLeave={() => boxRef.current?.style.setProperty('--fan', '0')}
        onPointerDown={(event) => { swipe.current = event.clientX }}
        onPointerUp={(event) => {
          const dx = event.clientX - swipe.current
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
        }}
      >
        {posters.map((poster, i) => {
          const d = i - at
          if (d < -3 || d > 9) return null
          return (
            <button
              key={poster.id}
              type="button"
              className={`cr-sleeve ${d < 0 ? 'is-past' : d === 0 ? 'is-front' : ''} ${d === 0 && pulling ? 'is-pulling' : ''}`}
              style={{ '--d': d, '--dd': Math.abs(d), zIndex: 40 - Math.abs(d) } as React.CSSProperties}
              tabIndex={-1}
              onClick={() => (d === 0 ? pull() : setAt(i))}
              aria-label={d === 0 ? `Pull out ${poster.title}` : `Flip to ${poster.title}`}
            >
              <img src={poster.image} alt="" loading="lazy" decoding="async" />
            </button>
          )
        })}
        <div className="cr-front" aria-hidden="true"><span>Real Co.</span></div>
      </div>
      <div className="cr-info" key={at}>
        <p className="cr-count">{String(at + 1).padStart(2, '0')} / {posters.length}</p>
        <p className="cr-title">{posters[at].title}</p>
        <p className="cr-desc">{posters[at].description}</p>
        <div className="al-actions">
          <button type="button" onClick={() => go(-1)} disabled={at === 0}>‹ Back</button>
          <button type="button" className="is-solid" onClick={pull}>Pull it out</button>
          <button type="button" onClick={() => go(1)} disabled={at === posters.length - 1}>Next ›</button>
        </div>
      </div>
    </div>
  )
}
