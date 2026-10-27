import React from 'react'
import { gsap, prefersReducedMotion } from '../site/motion'
import { clients } from '../site/data'
import { CASES, CaseReader } from './CaseStudy'

// The work, as a stack: each client gets the whole screen in its own colours and
// slides up over the one before, which sinks back into the dark. The site itself
// scrolls inside its window while you read.

// Under the hood: the site lifts and the case study fans out beneath it, one layer
// per chapter, from who it's for down to what ships. Any layer opens the full story.
function Hood({ client }: { client: (typeof clients)[number] }): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  const [reading, setReading] = React.useState<number | null>(null)
  const chapters = CASES[client.id] ?? []
  const hover = React.useMemo(() => window.matchMedia('(hover: hover)').matches, [])
  return (
    <div
      className={`nw-hood ${open ? 'is-open' : ''}`}
      onPointerEnter={() => { if (hover) setOpen(true) }}
      onPointerLeave={() => { if (hover) setOpen(false) }}
    >
      <div className="nw-stack">
        {chapters.slice().reverse().map((chapter, r) => {
          const i = chapters.length - 1 - r
          return (
            <button key={chapter.name} type="button" className="nw-layer nw-chapter" style={{ '--depth': i } as React.CSSProperties} onClick={() => setReading(i)} tabIndex={open ? 0 : -1}>
              <span className="nw-chapter-no">0{i + 1}</span>
              <span className="nw-chapter-name">{chapter.name}</span>
              <span className="nw-chapter-title">{chapter.title}</span>
            </button>
          )
        })}
        <a className="nw-layer nw-window" href={client.url} target="_blank" rel="noreferrer" aria-label={`Visit ${client.host}`}>
          <span className="nw-bar" aria-hidden="true"><i /><i /><i /><span>{client.host}</span></span>
          <span className="nw-screen"><img src={client.image} alt={`${client.title} website`} loading="lazy" decoding="async" /></span>
        </a>
      </div>
      <ol className="nw-legend">
        {chapters.map((chapter, i) => (
          <li key={chapter.name} style={{ '--i': i } as React.CSSProperties}>
            <button type="button" onClick={() => setReading(i)} tabIndex={open ? 0 : -1}><span>0{i + 1}</span>{chapter.name}</button>
          </li>
        ))}
      </ol>
      <div className="nw-hood-actions">
        <button type="button" className="nw-hood-toggle" onClick={() => setOpen((value) => !value)} aria-pressed={open}>
          {open ? 'Put it back together' : 'Look under the hood'}
        </button>
        {open ? <button type="button" className="nw-hood-read" onClick={() => setReading(0)}>Read the case study →</button> : null}
      </div>
      {reading !== null ? <CaseReader id={client.id} title={client.title} start={reading} colours={client.scene} onClose={() => setReading(null)} /> : null}
    </div>
  )
}

const built: Record<string, string[]> = {
  dgm: ['Catalogue by procedure', 'Training academy', 'Service requests', 'Persian + English'],
  delux: ['Persian · Turkish · English', 'RTL + LTR, one codebase', 'Listings & leads admin', 'WhatsApp close'],
  realco: ['Positioning', 'Design system', 'Project intake', 'English + Persian']
}

export default function Work(): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.nw-card')
      cards.forEach((card, i) => {
        const inner = card.querySelector('.nw-inner')
        const next = cards[i + 1]
        // While the next card covers this one, it shrinks and dims behind it.
        if (next) {
          gsap.to(inner, {
            scale: 0.9, opacity: 0.35, borderRadius: 28, ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true }
          })
        }
        // The site in the window reads itself top to bottom across the card's stay.
        gsap.fromTo(card.querySelector('.nw-screen img'), { objectPosition: '50% 0%' }, {
          objectPosition: '50% 100%', ease: 'none',
          scrollTrigger: { trigger: card, start: 'top 60%', end: next ? 'bottom top' : 'bottom bottom', scrub: true }
        })
        gsap.from(card.querySelectorAll('.nw-reveal'), {
          yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.06,
          scrollTrigger: { trigger: card, start: 'top 55%' }
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="nw" ref={rootRef} id="work">
      <header className="nw-head">
        <p className="nx-kicker">Selected work · 2025–26</p>
        <h2 className="nw-head-title"><span>On the</span> <em>record.</em></h2>
        <p className="nw-head-sub">Three businesses, three problems, three things that now exist.</p>
      </header>

      {clients.map((client, i) => (
        <article
          key={client.id}
          className="nw-card"
          style={{ '--c-bg': client.scene.bg, '--c-fg': client.scene.fg, '--c-accent': client.scene.accent } as React.CSSProperties}
        >
          <div className="nw-inner">
            <div className="nw-copy">
              <p className="nw-count"><span>{String(i + 1).padStart(2, '0')}</span> / {String(clients.length).padStart(2, '0')} — {client.place}</p>
              <h3 className="nw-title"><span className="nw-mask"><span className="nw-reveal">{client.title}</span></span></h3>
              <p className="nw-line"><span className="nw-mask"><span className="nw-reveal">{client.line}</span></span></p>
              <p className="nw-story">{client.story}</p>
              <ul className="nw-built">{built[client.id]?.map((item) => <li key={item}>{item}</li>)}</ul>
              <a className="nw-visit" href={client.url} target="_blank" rel="noreferrer" data-cursor="visit">Visit {client.host} <span>↗</span></a>
            </div>
            <Hood client={client} />
          </div>
        </article>
      ))}
    </section>
  )
}
