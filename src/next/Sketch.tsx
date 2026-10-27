import React from 'react'
import { resetScroll, scrollToId } from '../site/motion'
import { archive, clients, dripApp, knightvision, profile, show, type Chapter } from '../site/data'
import { CaseReader } from './CaseStudy'
import { KnightVisionBoard } from './KnightVisionBoard'
import './sketch.css'

// The Sketchbook mood: across the universes. It opens on my sketchbook, and every
// project lives in its own universe, each drawn in its own style, the way every
// Spider-Person's world is. Crossing from one to the next glitches the page. All the
// words are the projects' real ones; only the sound effects are made up.

type Look = 'noir' | 'anime' | 'brooklyn' | 'water' | 'neon' | 'toon'

// The real thing, shown clearly: a site in a browser, the app's screens, the board,
// the episodes. The universe styles the frame around it, never the work itself.
type Work =
  | { kind: 'site'; src: string; host: string; url: string }
  | { kind: 'phones'; screens: string[]; url: string }
  | { kind: 'board' }
  | { kind: 'episodes'; ids: [string, string][] }

type Universe = {
  id: string
  look: Look
  name: string
  title: string
  feat?: string
  place: string
  line: string
  notes: string[]
  inset: { src: string; pos?: string }
  work: Work
  sfx: string
  client?: Chapter
  links: { label: string; href: string }[]
  play?: boolean
}

// Sentences, without breaking on the "Co." in "Real Co.".
const firstSentences = (text: string, n: number): string[] =>
  (text.replace(/Co\./g, 'Co\u2024').match(/[^.!?]+[.!?]+/g) ?? [text]).slice(0, n).map((s) => s.trim().replace(/\u2024/g, '.'))

const [dgm, delux, realco] = clients
const UNIVERSES: Universe[] = [
  { id: 'dgm', look: 'noir', name: 'Noir', title: dgm.title, place: dgm.place, line: dgm.line, notes: firstSentences(dgm.story, 2), inset: { src: dgm.image, pos: '50% 38%' }, sfx: 'Tap tap tap', work: { kind: 'site', src: dgm.image, host: dgm.host, url: dgm.url }, client: dgm, links: [{ label: `${dgm.host} ↗`, href: dgm.url }] },
  { id: 'delux', look: 'anime', name: 'Anime', title: delux.title, place: delux.place, line: delux.line, notes: firstSentences(delux.story, 2), inset: { src: delux.image, pos: '50% 30%' }, sfx: 'Vroom!', work: { kind: 'site', src: delux.image, host: delux.host, url: delux.url }, client: delux, links: [{ label: `${delux.host} ↗`, href: delux.url }] },
  { id: 'realco', look: 'brooklyn', name: 'Brooklyn', title: realco.title, place: realco.place, line: realco.line, notes: firstSentences(realco.story, 2), inset: { src: '/posters/concept-teamwork.webp', pos: '50% 44%' }, sfx: 'Pssshhh', work: { kind: 'site', src: realco.image, host: realco.host, url: realco.url }, client: realco, links: [{ label: `${realco.host} ↗`, href: realco.url }] },
  { id: 'drip', look: 'water', name: 'Watercolour', title: 'Drip', place: 'My own product · Private beta', line: 'Does this work? One photo, one honest answer.', notes: [dripApp.chapters[0].text, dripApp.chapters[1].title], inset: { src: '/projects/drip-app/screens/closet.webp' }, sfx: 'Swish', work: { kind: 'phones', screens: ['camera', 'verdict', 'closet'].map((n) => `/projects/drip-app/screens/${n}.webp`), url: dripApp.url }, links: [{ label: 'Join the waitlist ↗', href: dripApp.url }] },
  { id: 'knightvision', look: 'neon', name: '2099', title: knightvision.title, feat: 'BakerDmo', place: knightvision.place, line: knightvision.line, notes: firstSentences(knightvision.story, 2), inset: { src: '/posters/concept-think-think.webp' }, sfx: 'Bzzt', work: { kind: 'board' }, play: true, links: [{ label: 'The repo ↗', href: knightvision.url }] },
  { id: 'show', look: 'toon', name: 'Cartoon', title: show.title, feat: 'guests', place: 'The podcast I host', line: 'Long conversations about technology, culture and business.', notes: ['With enough humour to keep everyone honest.', 'Building things is half the job. Explaining them to people is the other half.'], inset: { src: '/posters/media-reasonable-show-cover-01.webp' }, sfx: 'Ha!', work: { kind: 'episodes', ids: [['9iLwSkk9k6U', 'EP0.3 · Distractions'], ['tw4cTelvIQA', 'EP0.2 · Why brutal honesty sets you free'], ['7Vks-qv7RjY', 'EP0.1 · Friendship and being alone']] }, links: [{ label: 'Episodes ↗', href: 'https://www.youtube.com/@TheReasonableShow' }] }
]

// One image, printed the way its universe prints things.
function Art({ src, pos, look }: { src: string; pos?: string; look: Look }): React.ReactElement {
  if (!src) return <Board />
  return (
    <div className={`sv-art is-${look}`}>
      <img src={src} alt="" loading="lazy" decoding="async" style={{ objectPosition: pos }} />
      {look === 'brooklyn' ? (
        <>
          <img className="sv-plate is-c" src={src} alt="" loading="lazy" decoding="async" style={{ objectPosition: pos }} />
          <img className="sv-plate is-m" src={src} alt="" loading="lazy" decoding="async" style={{ objectPosition: pos }} />
        </>
      ) : null}
      <i className="sv-fx" />
    </div>
  )
}

function Showcase({ work, onPlay }: { work: Work; onPlay: () => void }): React.ReactElement {
  if (work.kind === 'site') {
    return (
      <a className="sv-screen" href={work.url} target="_blank" rel="noreferrer" aria-label={`Visit ${work.host}`}>
        <span className="sv-bar"><i /><i /><i /><b>{work.host}</b><em>Visit ↗</em></span>
        <span className="sv-view"><img src={work.src} alt={`${work.host}, the full page`} loading="lazy" decoding="async" /></span>
      </a>
    )
  }
  if (work.kind === 'phones') {
    return (
      <a className="sv-phones" href={work.url} target="_blank" rel="noreferrer" aria-label="Drip, three screens of the app">
        {work.screens.map((src, i) => <img key={src} src={src} alt="" loading="lazy" decoding="async" style={{ '--i': i } as React.CSSProperties} />)}
      </a>
    )
  }
  if (work.kind === 'board') {
    return (
      <button type="button" className="sv-playboard" onClick={onPlay}>
        <Board />
        <span className="sv-playcta">Play the real network ♞</span>
      </button>
    )
  }
  return (
    <div className="sv-episodes">
      {work.ids.map(([id, name]) => (
        <a key={id} href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer">
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" decoding="async" />
          <span>▶ {name}</span>
        </a>
      ))}
    </div>
  )
}

// The Italian Game a few moves in: white's knight has just jumped g1 to f3.
type Piece = [glyph: string, file: number, rank: number, black: boolean]
const GLYPH: Record<string, string> = { K: '\u265A', Q: '\u265B', R: '\u265C', B: '\u265D', N: '\u265E', P: '\u265F' }
const rank = (row: string, r: number, black: boolean): Piece[] => row.split('').flatMap((p, f) => (p === '.' ? [] : [[p, f, r, black] as Piece]))
const POSITION: Piece[] = [
  ...rank('RNBQK..R', 0, false), ...rank('PPPP.PPP', 1, false), ...rank('..B.P...', 3, false), ...rank('.....N..', 2, false),
  ...rank('R.BQKB.R', 7, true), ...rank('PPPP.PPP', 6, true), ...rank('....P...', 4, true), ...rank('..N..N..', 5, true)
].map(([p, f, r, b]) => [`${GLYPH[p]}\uFE0E`, f, r, b])

// KnightVision's board: a neon board, a knight mid-move.
function Board(): React.ReactElement {
  return (
    <div className="sv-art is-neon sv-board" aria-hidden="true">
      <svg viewBox="0 0 80 80">
        {Array.from({ length: 64 }, (_, i) => <rect key={i} x={(i % 8) * 10} y={Math.floor(i / 8) * 10} width="10" height="10" className={(i % 8 + Math.floor(i / 8)) % 2 ? 'is-dark' : ''} />)}
        <path className="sv-move" d="M65 75 L65 55 L55 55" />
        {POSITION.map(([glyph, file, rank, black], k) => (
          <text key={k} x={file * 10 + 5} y={(7 - rank) * 10 + 5} className={`sv-piece ${black ? 'is-black' : ''}`}>{glyph}</text>
        ))}
      </svg>
      <i className="sv-fx" />
    </div>
  )
}

// Doodle on the sketchbook: a pen that leaves wobbly ink lines that boil like a drawing.
function Doodle(): React.ReactElement {
  const ref = React.useRef<HTMLCanvasElement>(null)
  React.useEffect(() => {
    const canvas = ref.current
    const host = canvas?.parentElement
    if (!canvas || !host) return
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = (): void => {
      const box = host.getBoundingClientRect()
      canvas.width = box.width * dpr
      canvas.height = box.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#1b2a8a'
      ctx.lineWidth = 3
    }
    size()
    let last: { x: number; y: number } | null = null
    const at = (event: PointerEvent): { x: number; y: number } => {
      const box = canvas.getBoundingClientRect()
      return { x: event.clientX - box.left, y: event.clientY - box.top }
    }
    const down = (event: PointerEvent): void => {
      if ((event.target as HTMLElement).closest('a, button')) return
      last = at(event)
    }
    const move = (event: PointerEvent): void => {
      if (!last) return
      const p = at(event)
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      last = p
    }
    const up = (): void => { last = null }
    host.addEventListener('pointerdown', down)
    host.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    const observer = new ResizeObserver(size)
    observer.observe(host)
    return () => {
      host.removeEventListener('pointerdown', down)
      host.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      observer.disconnect()
    }
  }, [])
  return <canvas ref={ref} className="sv-doodle" aria-hidden="true" />
}

export default function Sketch(): React.ReactElement {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [reading, setReading] = React.useState<Chapter | null>(null)
  const [playing, setPlaying] = React.useState(false)
  const [viewing, setViewing] = React.useState<number | null>(null)
  const originals = archive.filter((poster) => poster.category !== 'media')
  const viewed = viewing === null ? null : originals[viewing]
  const [user, domain] = profile.email.split('@')

  React.useEffect(() => { resetScroll() }, [])

  // Crossing into a universe: the page glitches in, then settles.
  React.useEffect(() => {
    const pages = Array.from(rootRef.current?.querySelectorAll<HTMLElement>('.sv-page') ?? [])
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement
        if (entry.isIntersecting && !el.classList.contains('is-here')) {
          el.classList.add('is-here')
          el.classList.remove('is-glitch')
          void el.offsetWidth
          el.classList.add('is-glitch')
        } else if (!entry.isIntersecting) el.classList.remove('is-here')
      })
    }, { threshold: 0.35 })
    pages.forEach((page) => observer.observe(page))
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    if (viewing === null) return
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setViewing(null)
      if (event.key === 'ArrowRight') setViewing((v) => (v === null ? v : (v + 1) % originals.length))
      if (event.key === 'ArrowLeft') setViewing((v) => (v === null ? v : (v + originals.length - 1) % originals.length))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [viewing, originals.length])

  return (
    <div className="sv" ref={rootRef}>
      {/* Line boil: three slightly different wobbles, cycled on twos. */}
      <svg className="sv-defs" aria-hidden="true">
        {[3, 7, 11].map((seed, i) => (
          <filter key={seed} id={`sv-boil-${i}`}><feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="2" seed={seed} /><feDisplacementMap in="SourceGraphic" scale="3.5" /></filter>
        ))}
        <filter id="sv-water"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="4" /><feDisplacementMap in="SourceGraphic" scale="16" /><feGaussianBlur stdDeviation="0.8" /></filter>
        <filter id="sv-poster"><feComponentTransfer><feFuncR type="discrete" tableValues="0 0.3 0.62 0.86 1" /><feFuncG type="discrete" tableValues="0 0.3 0.62 0.86 1" /><feFuncB type="discrete" tableValues="0 0.3 0.62 0.86 1" /></feComponentTransfer></filter>
        <filter id="sv-toon"><feComponentTransfer><feFuncR type="discrete" tableValues="0.05 0.45 0.95" /><feFuncG type="discrete" tableValues="0.05 0.45 0.95" /><feFuncB type="discrete" tableValues="0.08 0.45 0.95" /></feComponentTransfer></filter>
        <filter id="sv-neon"><feColorMatrix type="saturate" values="0" /><feComponentTransfer><feFuncR type="table" tableValues="0.05 1 0.28" /><feFuncG type="table" tableValues="0 0.16 0.96" /><feFuncB type="table" tableValues="0.13 0.84 1" /></feComponentTransfer></filter>
        <filter id="sv-cyan"><feColorMatrix values="0.3 0.59 0.11 0 0  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0" /></filter>
        <filter id="sv-magenta"><feColorMatrix values="0 0 0 0 1  0.3 0.59 0.11 0 0  0 0 0 0 1  0 0 0 1 0" /></filter>
      </svg>

      {/* The sketchbook: lined paper, my name lettered like a cover, a pen you can draw with. */}
      <section className="sv-book" id="top">
        <Doodle />
        <div className="sv-holes" aria-hidden="true"><i /><i /><i /></div>
        <p className="sv-hand sv-date">Istanbul, 2026</p>
        <h1 className="sv-name"><span>Arian</span><span>Shamsabadi</span></h1>
        <p className="sv-hand sv-role">engineer · founder of Real Co. · posters for fun</p>
        <div className="sv-sticky">
          <p>Six projects. Six universes. Each one drawn the way its world looks.</p>
          <a href="#work" onClick={(event) => { event.preventDefault(); scrollToId('work') }}>Jump in ↓</a>
        </div>
        <svg className="sv-scribble is-ball" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="40" /><path d="M10 50 H90 M50 10 V90 M22 22 C40 40 40 60 22 78 M78 22 C60 40 60 60 78 78" /></svg>
        <svg className="sv-scribble is-arrow" viewBox="0 0 120 80" aria-hidden="true"><path d="M8 12 C 40 8, 80 30, 96 64" /><path d="M76 60 L 98 66 L 102 44" /></svg>
        <p className="sv-hand sv-try">go on, draw on it</p>
      </section>

      {UNIVERSES.map((u, i) => (
        <section key={u.id} id={i === 0 ? 'work' : u.id === 'drip' ? 'drip' : undefined} className={`sv-page is-${u.look} ${i % 2 ? 'is-flip' : ''}`}>
          <div className="sv-panel sv-p-art"><Showcase work={u.work} onPlay={() => setPlaying(true)} /></div>
          <div className="sv-panel sv-p-title">
            <p className="sv-universe">Universe {String(i + 1).padStart(2, '0')} · {u.name}</p>
            <h2 className="sv-title">{u.title}</h2>
            {u.feat ? <p className="sv-feat">feat. {u.feat}</p> : null}
            <p className="sv-place">{u.place}</p>
          </div>
          <div className="sv-panel sv-p-notes">
            <p className="sv-box is-lead">{u.line}</p>
            {u.notes.map((note) => <p key={note} className="sv-box">{note}</p>)}
          </div>
          <div className="sv-panel sv-p-strip"><Art {...u.inset} look={u.look} /><span className="sv-sfx">{u.sfx}</span></div>
          <div className="sv-panel sv-p-next">
            <p className="sv-next-label">Next issue</p>
            <div className="sv-actions">
              {u.client ? <button type="button" onClick={() => setReading(u.client!)}>Read the case study</button> : null}
              {u.play ? <button type="button" onClick={() => setPlaying(true)}>Play the real network ♞</button> : null}
              {u.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}
            </div>
          </div>
        </section>
      ))}

      {/* My posters, taped into the back of the sketchbook. */}
      <section className="sv-book sv-taped" id="posters">
        <p className="sv-hand sv-date">the back pages</p>
        <h2 className="sv-name is-small"><span>Stuff I made</span><span>for fun</span></h2>
        <div className="sv-tapes">
          {originals.map((poster, i) => (
            <button key={poster.id} type="button" className="sv-tape" style={{ '--r': `${((i * 37) % 9) - 4}deg` } as React.CSSProperties} onClick={() => setViewing(i)}>
              <img src={poster.image} alt={poster.title} loading="lazy" decoding="async" />
              <span className="sv-hand">{poster.title}</span>
            </button>
          ))}
        </div>
      </section>

      <footer className="sv-book sv-end" id="contact">
        <h2 className="sv-name is-small"><span>Write</span><span>to me</span></h2>
        <a className="sv-mail" href={`mailto:${profile.email}`}>{user}@<wbr />{domain}</a>
        <div className="sv-stickers">
          <a href={profile.whatsapp} target="_blank" rel="noreferrer" style={{ '--r': '-6deg' } as React.CSSProperties}>WhatsApp</a>
          <a href={profile.telegram} target="_blank" rel="noreferrer" style={{ '--r': '4deg' } as React.CSSProperties}>Telegram</a>
          <a href={profile.github} target="_blank" rel="noreferrer" style={{ '--r': '-3deg' } as React.CSSProperties}>GitHub</a>
          <a href={profile.studio} target="_blank" rel="noreferrer" style={{ '--r': '7deg' } as React.CSSProperties}>Real Co.</a>
        </div>
        <p className="sv-hand sv-sign">— Arian · © 2026 Real Co., Istanbul</p>
      </footer>

      {viewed ? (
        <div className="sv-box-view" role="dialog" aria-modal="true" aria-label={viewed.title} onClick={() => setViewing(null)}>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={viewed.image} alt={viewed.title} />
            <figcaption><b>{viewed.title}</b>{viewed.description}</figcaption>
          </figure>
          <button type="button" className="sv-close" onClick={() => setViewing(null)}>Close ×</button>
        </div>
      ) : null}
      {reading ? <CaseReader id={reading.id} title={reading.title} start={0} colours={reading.scene} onClose={() => setReading(null)} /> : null}
      {playing ? <KnightVisionBoard onClose={() => setPlaying(false)} /> : null}
    </div>
  )
}
