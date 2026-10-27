import React from 'react'
import { resetScroll } from '../site/motion'
import { archive, clients, dripApp, knightvision, profile, show, type Chapter } from '../site/data'
import { CaseReader } from './CaseStudy'
import { KnightVisionBoard } from './KnightVisionBoard'
import { fit, liveType, type Effect, type Paint } from './livetype'
import './covers.css'

// The Posters mood: every section is a cover, set the way I set my parody covers
// (issue box, masthead, cover lines, barcode), with one huge word in the middle that
// you can push around. The effect on each word comes from one of my posters or from
// the project itself.

const ANTON = (s: number): string => `400 ${s}px Anton`
const BLACK = (s: number): string => `400 ${s}px UnifrakturMaguntia`
const UNCIAL = (s: number): string => `400 ${s}px 'Uncial Antiqua'`
const SERIF = (s: number): string => `400 ${s}px 'Instrument Serif'`
const SERIF_I = (s: number): string => `italic 400 ${s}px 'Instrument Serif'`
const BRUSH = (s: number): string => `400 ${s}px 'Permanent Marker'`

const narrow = (w: number): boolean => w < 700

// Centre a line on (cx, cy) by its drawn ink, not its em box.
function line(ctx: CanvasRenderingContext2D, text: string, cx: number, cy: number): void {
  const m = ctx.measureText(text)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(text, cx, cy + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2)
}

// A stack of lines, each set as large as it fits, filling a band of the cover.
function stack(ctx: CanvasRenderingContext2D, lines: string[], font: (s: number) => string, w: number, top: number, bottom: number, gap = 0.04, widthShare = 0.9): void {
  const band = bottom - top
  const each = (band - gap * band * (lines.length - 1)) / lines.length
  lines.forEach((text, i) => {
    fit(ctx, text, font, w * widthShare, each)
    line(ctx, text, w / 2, top + each / 2 + i * (each + gap * band))
  })
}

const paintHero: Paint = (ctx, w, h) => {
  ctx.fillStyle = '#f4efe6'
  const n = narrow(w)
  stack(ctx, ['ARIAN'], ANTON, w, h * (n ? 0.26 : 0.24), h * (n ? 0.5 : 0.7), 0, n ? 0.92 : 0.94)
}

const paintDgm: Paint = (ctx, w, h) => {
  ctx.fillStyle = '#12163f'
  const n = narrow(w)
  stack(ctx, ['Darman', 'Gostar', 'Miad'], UNCIAL, w, h * 0.22, h * (n ? 0.58 : 0.74), 0.02, n ? 0.9 : 0.7)
}

const paintDelux: Paint = (ctx, w, h) => {
  ctx.fillStyle = '#d62a1e'
  const n = narrow(w)
  stack(ctx, ['Delux'], BLACK, w, h * 0.24, h * (n ? 0.5 : 0.72), 0, 0.88)
}

const paintRealco: Paint = (ctx, w, h) => {
  ctx.fillStyle = '#f2f0ea'
  const n = narrow(w)
  stack(ctx, ['ONE', 'TEAM.'], ANTON, w, h * 0.2, h * (n ? 0.6 : 0.76), 0.03, n ? 0.8 : 0.5)
}

const paintDrip: Paint = (ctx, w, h) => {
  const n = narrow(w)
  ctx.fillStyle = '#121212'
  fit(ctx, 'Does this', SERIF, w * (n ? 0.86 : 0.7), h * (n ? 0.15 : 0.24))
  line(ctx, 'Does this', w / 2, h * (n ? 0.3 : 0.36))
  ctx.fillStyle = '#e5482f'
  fit(ctx, 'work?', SERIF_I, w * (n ? 0.8 : 0.6), h * (n ? 0.17 : 0.28))
  line(ctx, 'work?', w / 2, h * (n ? 0.47 : 0.62))
}

const paintThink: Paint = (ctx, w, h) => {
  ctx.fillStyle = '#121212'
  const n = narrow(w)
  stack(ctx, ['THINK.'], ANTON, w, h * 0.24, h * (n ? 0.48 : 0.72), 0, n ? 0.9 : 0.8)
}

const paintShow: Paint = (ctx, w, h) => {
  ctx.fillStyle = '#f4efe6'
  const n = narrow(w)
  stack(ctx, ['The Reasonable', 'Show'], BRUSH, w, h * 0.24, h * (n ? 0.52 : 0.7), 0.03, n ? 0.9 : 0.78)
}

const paintStay: Paint = (ctx, w, h) => {
  ctx.fillStyle = '#f4efe6'
  const n = narrow(w)
  stack(ctx, ['STAY', 'CLOSE.'], ANTON, w, h * 0.16, h * (n ? 0.54 : 0.66), 0.02, n ? 0.8 : 0.44)
}

function LiveType({ effect, paint, fonts }: { effect: Effect; paint: Paint; fonts: string[] }): React.ReactElement {
  const ref = React.useRef<HTMLCanvasElement>(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => (ref.current ? liveType(ref.current, effect, paint, fonts) : undefined), [])
  return <canvas ref={ref} className="cv-type" aria-hidden="true" />
}

// A barcode, like the ones on my parody covers. Decorative; the numbers are the issue.
function Barcode({ seed, label }: { seed: number; label: string }): React.ReactElement {
  const bars = React.useMemo(() => {
    let s = seed
    const out: [number, number][] = []
    let x = 0
    while (x < 96) {
      s = (s * 9301 + 49297) % 233280
      const w = 1 + Math.floor((s / 233280) * 3)
      out.push([x, w])
      x += w + 1 + Math.floor(((s * 7) % 233280) / 233280 * 2)
    }
    return out
  }, [seed])
  return (
    <div className="cv-barcode" aria-hidden="true">
      <svg viewBox="0 0 96 40" preserveAspectRatio="none">{bars.map(([x, w]) => <rect key={x} x={x} y={0} width={w} height={40} />)}</svg>
      <span>{label}</span>
    </div>
  )
}

type CoverProps = {
  id?: string
  n: number
  className: string
  effect: Effect
  paint: Paint
  fonts: string[]
  title: string
  hint: string
  back?: React.ReactNode
  children: React.ReactNode
}

function Cover({ id, n, className, effect, paint, fonts, title, hint, back, children }: CoverProps): React.ReactElement {
  return (
    <section id={id} className={`cv ${className}`}>
      {back}
      <LiveType effect={effect} paint={paint} fonts={fonts} />
      <h2 className="cv-sr">{title}</h2>
      <header className="cv-mast">
        <span className="cv-issue"><small>No.</small>{n}</span>
        <span className="cv-masthead">Real Co.</span>
        <span className="cv-date">Istanbul<br />2026</span>
      </header>
      {children}
      <p className="cv-hint" aria-hidden="true">{hint}</p>
    </section>
  )
}

const episodes: [string, string][] = [
  ['9iLwSkk9k6U', 'EP0.3 · Distractions'],
  ['tw4cTelvIQA', 'EP0.2 · Why brutal honesty sets you free'],
  ['7Vks-qv7RjY', 'EP0.1 · Friendship and being alone'],
  ['mESzKmGGksA', 'EP10 · Rome, Mafia & Good Boy']
]

const PROJECTS: { client: Chapter; effect: Effect; paint: Paint; fonts: string[]; hint: string; className: string }[] = [
  { client: clients[0], effect: 'lens', paint: paintDgm, fonts: [UNCIAL(100)], hint: 'Move over the name', className: 'is-dgm' },
  { client: clients[1], effect: 'mirror', paint: paintDelux, fonts: [BLACK(100)], hint: 'Move over it', className: 'is-delux' },
  { client: clients[2], effect: 'pinch', paint: paintRealco, fonts: [ANTON(100)], hint: 'Drag across it and pull', className: 'is-realco' }
]

export default function Covers(): React.ReactElement {
  const [reading, setReading] = React.useState<Chapter | null>(null)
  const [playing, setPlaying] = React.useState(false)
  const [viewing, setViewing] = React.useState<number | null>(null)
  const originals = archive.filter((poster) => poster.category !== 'media')
  const viewed = viewing === null ? null : originals[viewing]
  const [user, domain] = profile.email.split('@')

  React.useEffect(() => { resetScroll() }, [])
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
    <div className="cvs">
      <Cover
        id="top" n={1} className="is-hero" effect="flow" paint={paintHero} fonts={[ANTON(100)]} title={profile.name}
        hint="Move across the type"
        back={<img className="cv-photo" src={profile.portrait} alt="" decoding="async" />}
      >
        <div className="cv-lines">
          <p>Engineer and founder of Real Co.</p>
          <p>I design and build software for companies in Turkey and Iran, and a few products of my own.</p>
          <p>I make posters for fun.</p>
        </div>
        <Barcode seed={1} label="01 · 2026" />
      </Cover>

      {PROJECTS.map(({ client, effect, paint, fonts, hint, className }, i) => (
        <Cover key={client.id} id={i === 0 ? 'work' : undefined} n={i + 2} className={className} effect={effect} paint={paint} fonts={fonts} title={client.title} hint={hint}>
          <div className="cv-lines">
            <p className="cv-kick">{client.place}</p>
            <p className="cv-big">{client.line}</p>
            <p>{client.facts}</p>
            <div className="cv-actions">
              <button type="button" onClick={() => setReading(client)}>Read the case study</button>
              <a href={client.url} target="_blank" rel="noreferrer">{client.host} ↗</a>
            </div>
          </div>
          <a className="cv-inset" href={client.url} target="_blank" rel="noreferrer" aria-label={`Visit ${client.host}`}>
            <img src={client.image} alt={`${client.title} website`} loading="lazy" decoding="async" />
          </a>
          <Barcode seed={i + 2} label={`0${i + 2} · ${client.id.toUpperCase()}`} />
        </Cover>
      ))}

      <Cover id="drip" n={5} className="is-drip" effect="halftone" paint={paintDrip} fonts={[SERIF(100), SERIF_I(100)]} title="Drip" hint="Move over it">
        <img className="cv-phone" src="/projects/drip-app/screens/verdict.webp" alt="Drip’s verdict screen" loading="lazy" decoding="async" />
        <div className="cv-lines">
          <p className="cv-kick">My own product · Private beta</p>
          <p className="cv-big">One photo. One honest word.</p>
          <p>{dripApp.chapters[1].text}</p>
          <div className="cv-actions">
            <a className="is-solid" href={dripApp.url} target="_blank" rel="noreferrer">Join the waitlist ↗</a>
          </div>
        </div>
        <Barcode seed={5} label="05 · DRIP" />
      </Cover>

      <Cover n={6} className="is-think" effect="twirl" paint={paintThink} fonts={[ANTON(100)]} title={knightvision.title} hint="Stir it">
        <div className="cv-lines">
          <p className="cv-kick">{knightvision.title} · {knightvision.place}</p>
          <p className="cv-big">{knightvision.line}</p>
          <p>{knightvision.facts}</p>
          <div className="cv-actions">
            <button type="button" className="is-solid" onClick={() => setPlaying(true)}>Play the real network ♞</button>
            <a href={knightvision.url} target="_blank" rel="noreferrer">The repo ↗</a>
          </div>
        </div>
        <Barcode seed={6} label="06 · KV" />
      </Cover>

      <Cover
        n={7} className="is-show" effect="ripple" paint={paintShow} fonts={[BRUSH(100)]} title={show.title} hint="Move over it"
        back={<img className="cv-photo" src={show.image} alt="" loading="lazy" decoding="async" />}
      >
        <div className="cv-lines">
          <p className="cv-kick">The podcast I host</p>
          <p>Long conversations with guests about technology, culture and business, with enough humour to keep everyone honest.</p>
          <ul className="cv-eps">
            {episodes.map(([id, name]) => <li key={id}><a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer">{name} ↗</a></li>)}
          </ul>
        </div>
        <Barcode seed={7} label="07 · TRS" />
      </Cover>

      <section id="posters" className="cv-originals">
        <header>
          <p className="cv-kick">No. 8 · The originals</p>
          <h2>I make these for fun, because I like art.</h2>
          <p className="cv-count">{originals.length} posters · tap one to see it properly</p>
        </header>
        <div className="cv-grid">
          {originals.map((poster, i) => (
            <button key={poster.id} type="button" onClick={() => setViewing(i)}>
              <img src={poster.image} alt={poster.title} loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </section>

      <Cover id="contact" n={9} className="is-stay" effect="melt" paint={paintStay} fonts={[ANTON(100)]} title="Stay close" hint="Drag through it">
        <div className="cv-lines">
          <p className="cv-kick">Have something that needs to exist?</p>
          <a className="cv-mail" href={`mailto:${profile.email}`}>{user}@<wbr />{domain}</a>
          <div className="cv-actions">
            <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp ↗</a>
            <a href={profile.telegram} target="_blank" rel="noreferrer">Telegram ↗</a>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={profile.studio} target="_blank" rel="noreferrer">Real Co. ↗</a>
          </div>
        </div>
        <Barcode seed={9} label={`© 2026 · ${profile.name.toUpperCase()}`} />
      </Cover>

      {viewed ? (
        <div className="cv-box" role="dialog" aria-modal="true" aria-label={viewed.title} onClick={() => setViewing(null)}>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={viewed.image} alt={viewed.title} />
            <figcaption><b>{viewed.title}</b>{viewed.description}</figcaption>
          </figure>
          <button type="button" className="cv-box-close" onClick={() => setViewing(null)}>Close ×</button>
        </div>
      ) : null}
      {reading ? <CaseReader id={reading.id} title={reading.title} start={0} colours={reading.scene} onClose={() => setReading(null)} /> : null}
      {playing ? <KnightVisionBoard onClose={() => setPlaying(false)} /> : null}
    </div>
  )
}
