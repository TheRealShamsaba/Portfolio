import React from 'react'
import { gsap, getLenis, prefersReducedMotion, ScrollTrigger } from '../motion'
import { clients, dripApp, knightvision, profile, show } from '../data'

// Art: the work as my studio notebook. The book stays on the desk and its pages turn as you scroll;
// doodles draw themselves, screenshots are taped in, and you can draw on the pages yourself.

// ───────────── Doodles (each path draws itself when its page arrives) ─────────────

function Doodle({ children, className = '', viewBox = '0 0 200 160', stretch = false }: { children: React.ReactNode; className?: string; viewBox?: string; stretch?: boolean }): React.ReactElement {
  return (
    <svg className={`sk-doodle ${className}`} viewBox={viewBox} preserveAspectRatio={stretch ? 'none' : undefined} fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

// An arrow that curls up and to the left, from a note towards the picture above it.
const PointUp = ({ className = '' }: { className?: string }): React.ReactElement => (
  <Doodle className={`sk-point ${className}`} viewBox="0 0 120 110">
    <path className="ink" d="M100 100 C 96 60, 70 34, 24 22" />
    <path className="ink" d="M40 8 L22 22 L42 34" />
  </Doodle>
)

const Scribble = ({ className = '' }: { className?: string }): React.ReactElement => (
  <Doodle className={className} viewBox="0 0 220 60">
    <path className="ink" d="M8 40 C 40 8, 80 52, 110 26 S 170 6, 212 34" />
  </Doodle>
)

const Ring = ({ className = '' }: { className?: string }): React.ReactElement => (
  <Doodle className={className} viewBox="0 0 220 90" stretch>
    <path className="ink" d="M30 50 C 20 18, 120 4, 180 18 C 220 30, 200 76, 120 82 C 60 86, 12 70, 24 44 C 30 32, 60 22, 90 20" />
  </Doodle>
)

const Stars = (): React.ReactElement => (
  <Doodle className="sk-stars" viewBox="0 0 120 60">
    <path className="ink" d="M20 8 L24 22 L38 24 L24 28 L20 42 L16 28 L2 24 L16 22 Z" />
    <path className="ink" d="M78 20 L80 28 L88 30 L80 32 L78 40 L76 32 L68 30 L76 28 Z" />
    <path className="ink" d="M104 4 v12 M98 10 h12" />
  </Doodle>
)

const Laser = (): React.ReactElement => (
  <Doodle>
    <path className="ink" d="M40 120 L40 40 Q40 30 50 30 L110 30 Q120 30 120 40 L120 120 Z" />
    <path className="ink" d="M50 44 L110 44 L110 76 L50 76 Z" />
    <path className="ink" d="M120 60 C 150 60, 150 100, 180 96" />
    <path className="ink" d="M58 96 h20 M58 106 h34" />
    <path className="ink" d="M36 130 h88 M50 130 v12 M110 130 v12" />
  </Doodle>
)

const Car = (): React.ReactElement => (
  <Doodle>
    <path className="ink" d="M20 104 L30 80 Q36 66 52 64 L120 60 Q140 60 152 74 L172 90 Q184 94 182 106 L180 112 L20 112 Z" />
    <circle className="ink" cx="56" cy="114" r="14" />
    <circle className="ink" cx="146" cy="114" r="14" />
    <path className="ink" d="M58 66 L66 86 L144 86 L132 66" />
    <path className="ink" d="M186 70 h-20 M190 82 h-12" />
  </Doodle>
)

const Cycle = (): React.ReactElement => (
  <Doodle viewBox="0 0 220 180">
    <path className="ink" d="M110 24 C 170 24, 196 70, 180 112" />
    <path className="ink" d="M170 104 L182 116 L190 98" />
    <path className="ink" d="M164 140 C 130 170, 70 168, 42 134" />
    <path className="ink" d="M52 130 L38 138 L34 120" />
    <path className="ink" d="M34 100 C 24 56, 58 26, 98 24" />
    <path className="ink" d="M88 16 L102 24 L90 34" />
  </Doodle>
)

const Figure = (): React.ReactElement => (
  <Doodle viewBox="0 0 160 220">
    <path className="ink" d="M62 34 Q80 14 98 30 L100 40 L60 42 Z" />
    <circle className="ink" cx="80" cy="50" r="14" />
    <path className="ink" d="M54 70 L106 70 L112 120 L48 120 Z" />
    <path className="ink" d="M54 120 L60 196 L76 196 L80 140 L84 196 L100 196 L106 120" />
    <path className="ink" d="M54 200 h24 M84 200 h24" />
    <path className="ink" d="M48 76 L30 110 M112 76 L130 110" />
  </Doodle>
)

const Board = (): React.ReactElement => (
  <Doodle viewBox="0 0 180 180">
    <path className="ink" d="M20 20 h140 v140 h-140 Z" />
    <path className="ink" d="M55 20 v140 M90 20 v140 M125 20 v140 M20 55 h140 M20 90 h140 M20 125 h140" />
    <path className="ink accent" d="M38 142 L38 72 L72 72" />
    <path className="ink accent" d="M64 64 L74 72 L64 80" />
  </Doodle>
)

const Mic = (): React.ReactElement => (
  <Doodle viewBox="0 0 140 200">
    <path className="ink" d="M48 24 Q70 4 92 24 L92 92 Q70 112 48 92 Z" />
    <path className="ink" d="M48 44 h44 M48 64 h44" />
    <path className="ink" d="M30 80 Q30 130 70 130 Q110 130 110 80" />
    <path className="ink" d="M70 130 L70 172 M44 176 h52" />
  </Doodle>
)

const Plane = (): React.ReactElement => (
  <Doodle className="sk-plane" viewBox="0 0 300 180">
    <path className="ink dashed" d="M10 160 C 60 150, 70 90, 120 100 S 180 140, 200 80" />
    <path className="ink" d="M196 84 L290 20 L232 110 L218 84 Z" />
    <path className="ink" d="M218 84 L290 20" />
  </Doodle>
)

// ───────────── Pieces of a page ─────────────

function Taped({ src, alt, tilt = -2, position = '50% 0%', className = '' }: { src: string; alt: string; tilt?: number; position?: string; className?: string }): React.ReactElement {
  return (
    <figure className={`sk-taped ${className}`} style={{ '--tilt': `${tilt}deg` } as React.CSSProperties}>
      <img src={src} alt={alt} loading="lazy" style={{ objectPosition: position }} />
      <i className="sk-tape is-left" />
      <i className="sk-tape is-right" />
    </figure>
  )
}

function PostIt({ children, colour = 'yellow', tilt = 3, className = '' }: { children: React.ReactNode; colour?: 'yellow' | 'pink' | 'blue'; tilt?: number; className?: string }): React.ReactElement {
  return <p className={`sk-postit is-${colour} ${className}`} style={{ '--tilt': `${tilt}deg` } as React.CSSProperties}>{children}</p>
}

// ───────────── The book ─────────────
// The notebook stays on the desk. Scrolling turns its leaves: each leaf carries one
// page on its front and the next on its back, and swings around the spiral.

const PAGE_W = 540
const PAGE_H = 760
const PHONE = '(max-width: 860px)'

type Page = { kind: 'cover' | 'paper'; node: React.ReactNode; date?: string }
const InkMode = React.createContext(false)
const chapters: [number, string][] = [[0, 'The cover'], [1, 'Inside the cover'], [2, 'Hello, I’m Arian'], [3, 'Darman Gostar Miad'], [5, 'Delux Grup'], [7, 'Real Co.'], [9, 'Drip'], [11, 'KnightVision'], [12, 'The Reasonable Show'], [13, 'Write to me'], [15, 'The end']]

// Ink you add yourself: hold the mouse down on a page and draw. The ink lives on
// that page, so it turns with it.
function useInk(face: React.RefObject<HTMLDivElement | null>, canvas: React.RefObject<HTMLCanvasElement | null>, enabled: boolean): void {
  React.useEffect(() => {
    const root = face.current
    const ink = canvas.current
    if (!root || !ink) return
    // Hidden pages need no drawing buffers. Allocate one only when the visitor
    // actually puts a pen down, rather than opening every canvas on an iPhone.
    let ctx: CanvasRenderingContext2D | null = null
    let drawing = false
    let pointer = -1
    let last = { x: 0, y: 0 }
    const point = (event: PointerEvent): { x: number; y: number } => {
      const rect = root.getBoundingClientRect()
      const scale = PAGE_W / rect.width
      return { x: (event.clientX - rect.left) * scale, y: (event.clientY - rect.top) * scale }
    }
    const down = (event: PointerEvent): void => {
      if (event.button !== 0 || (event.pointerType !== 'mouse' && !enabled)) return
      if ((event.target as Element).closest('a, button')) return
      ctx = ink.getContext('2d')
      if (!ctx) return
      ctx.setTransform(2, 0, 0, 2, 0, 0)
      drawing = true
      pointer = event.pointerId
      root.setPointerCapture(pointer)
      last = point(event)
      event.preventDefault()
    }
    const move = (event: PointerEvent): void => {
      if (!drawing || !ctx || event.pointerId !== pointer) return
      event.preventDefault()
      const next = point(event)
      const speed = Math.hypot(next.x - last.x, next.y - last.y)
      ctx.strokeStyle = '#2f4bd8'
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      // Fountain pen: quick strokes run thinner.
      ctx.lineWidth = Math.max(1.4, 3.6 - speed * 0.08)
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(next.x, next.y)
      ctx.stroke()
      last = next
    }
    const up = (): void => {
      drawing = false
      if (root.hasPointerCapture(pointer)) root.releasePointerCapture(pointer)
      pointer = -1
    }
    root.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      up()
      root.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [face, canvas, enabled])
}

function Face({ page, side, folio, onOpen }: { page: Page; side: 'front' | 'back'; folio: number; onOpen?: () => void }): React.ReactElement {
  const faceRef = React.useRef<HTMLDivElement>(null)
  const inkRef = React.useRef<HTMLCanvasElement>(null)
  useInk(faceRef, inkRef, React.useContext(InkMode))
  const hand = side === 'back' ? 'is-left' : 'is-right'
  return (
    <div className={`sk-face is-${side} ${page.kind === 'cover' ? 'is-cover' : `sk-paper ${hand}`} ${onOpen ? 'is-openable' : ''}`} ref={faceRef}>
      {page.date ? <span className="sk-date">{page.date}</span> : null}
      {page.node}
      {onOpen ? <button type="button" className="sk-open" aria-label="Open notebook" onClick={onOpen}><span>Open notebook →</span></button> : null}
      {page.kind === 'paper' && folio > 0 ? <span className="sk-folio">— {folio} —</span> : null}
      {page.kind === 'paper' ? <canvas className="sk-ink" ref={inkRef} width={PAGE_W * 2} height={PAGE_H * 2} aria-hidden="true" /> : null}
      <i className="sk-shade" aria-hidden="true" />
    </div>
  )
}

type Project = {
  title: string
  place: string
  notes: [string, string][]
  url: string
  host: string
  doodle: React.ReactNode
  image: string
  callouts: [string, string]
  postit: string
}

function projectPages(project: Project, date: string): [Page, Page] {
  return [
    {
      kind: 'paper',
      date,
      node: (
        <>
          <div>
            <h2 className="sk-title">{project.title}</h2>
            <Scribble className="sk-underline" />
            <p className="sk-place">{project.place}</p>
            <ul className="sk-notes">
              {project.notes.map(([label, text]) => <li key={label}><b>{label}</b> {text}</li>)}
            </ul>
          </div>
          <div className="sk-sketch">{project.doodle}</div>
        </>
      )
    },
    {
      kind: 'paper',
      node: (
        <>
          <div>
            <Taped src={project.image} alt={`${project.title} website`} tilt={2} />
            <div className="sk-annotations">
              <div className="sk-callout is-a"><PointUp /><span>{project.callouts[0]}</span></div>
              <div className="sk-callout is-b"><PointUp className="is-flip" /><span>{project.callouts[1]}</span></div>
            </div>
          </div>
          <div className="sk-foot">
            <a className="sk-link" href={project.url} target="_blank" rel="noreferrer" data-cursor="visit">{project.host} →</a>
            <PostIt tilt={-3}>{project.postit}</PostIt>
          </div>
        </>
      )
    }
  ]
}

function buildPages(): Page[] {
  const [user, domain] = profile.email.split('@')
  const dgm = projectPages({
    title: clients[0].title,
    place: 'Tehran · medical equipment',
    notes: [['problem:', 'surgeons have no time and the specs live in brochures'], ['idea:', 'start from the clinical question, not the product list'], ['built:', 'catalogue, academy, service requests, in Persian + English']],
    url: clients[0].url,
    host: clients[0].host,
    doodle: <Laser />,
    image: clients[0].image,
    callouts: ['find a device by specialty', 'every number from the official docs'],
    postit: 'start from the procedure, not the product'
  }, 'DGM')
  const delux = projectPages({
    title: clients[1].title,
    place: 'Istanbul · car dealership',
    notes: [['who:', 'Iranians in Istanbul who don’t read Turkish yet'], ['trick:', 'three languages, one codebase, right-to-left and left-to-right'], ['close:', 'every car ends in a WhatsApp chat']],
    url: clients[1].url,
    host: clients[1].host,
    doodle: <Car />,
    image: clients[1].image,
    callouts: ['فارسی · Türkçe · English', 'admin for listings + leads'],
    postit: 'one site, three languages, every lead in WhatsApp'
  }, 'Delux')
  const realco = projectPages({
    title: clients[2].title,
    place: 'Istanbul · my studio',
    notes: [['rule:', 'one team does all of it'], ['loop:', 'design → build → look after it'], ['site:', 'say it plainly, make starting easy']],
    url: clients[2].url,
    host: clients[2].host,
    doodle: <Cycle />,
    image: clients[2].image,
    callouts: ['English + Persian', 'one step to start a project'],
    postit: 'rule #1: say it plainly'
  }, 'Real Co.')

  return [
    {
      kind: 'cover',
      node: (
        <div className="sk-cover-front">
          <span className="sk-cover-label">Sketchbook</span>
          <span className="sk-cover-name">{profile.name}</span>
          <span className="sk-cover-vol">Vol. 26 · Istanbul</span>
          <span className="sk-sticker is-a">ideas</span>
          <span className="sk-sticker is-b" lang="fa">فکر</span>
        </div>
      )
    },
    {
      kind: 'paper',
      node: (
        <>
          <div className="sk-found">
            <p className="sk-hand">If found, please return to</p>
            <a className="sk-hand is-big" href={`mailto:${profile.email}`}>{user}@<wbr />{domain}</a>
            <p className="sk-hand">(reward: a website)</p>
          </div>
          <div className="sk-me">
            <Taped src={profile.portrait} alt="Arian in Cappadocia" tilt={-3} position="50% 60%" className="is-portrait" />
            <div className="sk-callout is-side"><PointUp /><span>me, Cappadocia, probably thinking about a database schema</span></div>
          </div>
        </>
      )
    },
    {
      kind: 'paper',
      date: 'page 01',
      node: (
        <>
          <div>
            <h2 className="sk-title is-huge">Hi, I’m Arian.</h2>
            <Scribble className="sk-underline" />
            <ul className="sk-checks">
              <li>engineer <i>✓</i></li>
              <li>founder of Real Co. <i>✓</i></li>
              <li>builds products: AI, software, brand, media <i>✓</i></li>
              <li>sleeps enough <i className="is-no">✗</i></li>
            </ul>
          </div>
          <div className="sk-thesis">
            <p className="sk-margin">Sites for clients. Drip for myself. A notebook for everything in between.</p>
            <p className="sk-margin is-key"><mark>Start with a problem.</mark></p>
            <Ring className="sk-ring is-key" />
          </div>
          <div className="sk-foot is-end">
            <PostIt colour="blue" tilt={4} className="is-hint"><span className="sk-mouse-hint">psst: hold the mouse and draw on these pages ✎</span><span className="sk-touch-hint">tap Draw to leave a note on the page ✎</span></PostIt>
          </div>
        </>
      )
    },
    ...dgm,
    ...delux,
    ...realco,
    {
      kind: 'paper',
      date: 'Drip (mine!)',
      node: (
        <>
          <div>
            <h2 className="sk-title">Drip</h2>
            <Scribble className="sk-underline" />
            <p className="sk-place">my own app · private beta</p>
            <ul className="sk-notes">
              <li><b>the moment:</b> standing at the door, “does this work?”</li>
              <li><b>the answer:</b> one photo → one word</li>
              <li><b>the rule:</b> swaps only from clothes you own</li>
            </ul>
          </div>
          <div className="sk-drip-row">
            <div className="sk-verdict">
              <p className="sk-words"><span>Clean.</span> <span>Bold.</span> <span>Nah.</span></p>
              <Ring className="sk-ring is-words" />
            </div>
            <div className="sk-sketch is-figure"><Figure /></div>
          </div>
        </>
      )
    },
    {
      kind: 'paper',
      node: (
        <>
          <div className="sk-phones">
            <Taped src={dripApp.chapters[0].screen} alt="Drip camera" tilt={-4} className="is-phone" />
            <Taped src={dripApp.chapters[1].screen} alt="Drip verdict" tilt={3} className="is-phone" />
          </div>
          <div className="sk-foot">
            <a className="sk-link" href={dripApp.url} target="_blank" rel="noreferrer" data-cursor="join">join the waitlist →</a>
            <PostIt colour="pink" tilt={-4}>I build all of it: the iOS app, the API, the model, the web</PostIt>
          </div>
        </>
      )
    },
    {
      kind: 'paper',
      date: 'side quests',
      node: (
        <>
          <div>
            <h2 className="sk-title">{knightvision.title}</h2>
            <Scribble className="sk-underline" />
            <p className="sk-place">a chess engine that learns by playing itself</p>
          </div>
          <div className="sk-sketch is-board"><Board /></div>
          <div>
            <p className="sk-margin">policy net proposes · value net judges · Stockfish referees</p>
            <a className="sk-link" href={knightvision.url} target="_blank" rel="noreferrer">the repo →</a>
          </div>
        </>
      )
    },
    {
      kind: 'paper',
      node: (
        <>
          <div>
            <h2 className="sk-title">The Reasonable Show</h2>
            <Scribble className="sk-underline" />
            <p className="sk-place">ideas tested out loud</p>
          </div>
          <div className="sk-show-row">
            <Taped src={show.image} alt="The Reasonable Show" tilt={-2} position="60% 40%" className="is-small" />
            <div className="sk-sketch is-mic"><Mic /></div>
          </div>
          <div className="sk-foot">
            <a className="sk-link" href={show.url} target="_blank" rel="noreferrer">watch an episode →</a>
            <PostIt tilt={5}>building is half the job. explaining it is the other half</PostIt>
          </div>
        </>
      )
    },
    {
      kind: 'paper',
      date: 'last page',
      node: (
        <>
          <div>
            <h2 className="sk-title is-huge">Write to me.</h2>
            <Scribble className="sk-underline" />
            <a className="sk-mail" href={`mailto:${profile.email}`} data-cursor="write">{user}@<wbr />{domain}</a>
          </div>
          <ul className="sk-checks is-links">
            <li><a href={profile.telegram} target="_blank" rel="noreferrer">Telegram</a></li>
            <li><a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></li>
            <li><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a></li>
          </ul>
          <Plane />
        </>
      )
    },
    {
      kind: 'paper',
      node: (
        <>
          <div>
            <p className="sk-signature">Arian</p>
            <div className="sk-sign-row">
              <span className="sk-stamp">Istanbul · 2026</span>
              <Stars />
            </div>
          </div>
          <p className="sk-margin">P.S. this notebook has a tidier twin, if you need to show it to your boss.</p>
          <p className="sk-margin is-small">keep scrolling to close the book ↓</p>
          <i className="sk-stain" aria-hidden="true" />
        </>
      )
    },
    {
      kind: 'cover',
      node: (
        <div className="sk-cover-back">
          <span className="sk-sticker is-c">the end</span>
          <span className="sk-cover-label">Real Co. · Istanbul</span>
        </div>
      )
    }
  ]
}

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value))

export default function SketchMood({ onExit }: { onExit: () => void }): React.ReactElement {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [still] = React.useState(prefersReducedMotion)
  const pages = React.useMemo(buildPages, [])
  const leaves = React.useMemo(() => {
    const pairs: [Page, Page][] = []
    for (let i = 0; i < pages.length; i += 2) pairs.push([pages[i], pages[i + 1]])
    return pairs
  }, [pages])
  const [step, setStep] = React.useState(0)
  const [drawing, setDrawing] = React.useState(false)
  const [steps, setSteps] = React.useState(leaves.length)
  const stepRef = React.useRef(0)
  stepRef.current = step
  const goTo = React.useRef<(target: number, immediate?: boolean) => void>(() => undefined)
  React.useEffect(() => { setDrawing(false) }, [step])
  const clearPage = (): void => {
    const canvas = rootRef.current?.querySelector<HTMLCanvasElement>('.sk-face[aria-hidden="false"] .sk-ink')
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.save()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
  }

  React.useEffect(() => {
    const root = rootRef.current
    if (!root || still) return
    const stage = root.querySelector<HTMLElement>('.sk-stage')!
    const book = root.querySelector<HTMLElement>('.sk-book')!
    const leafEls = Array.from(root.querySelectorAll<HTMLElement>('.sk-leaf'))
    const fronts = leafEls.map((leaf) => leaf.querySelector<HTMLElement>('.sk-face.is-front')!)
    const backs = leafEls.map((leaf) => leaf.querySelector<HTMLElement>('.sk-face.is-back')!)
    const count = leafEls.length

    // Every ink line starts undrawn and is drawn when its page is first seen.
    root.querySelectorAll<SVGGeometryElement>('.ink:not(.dashed)').forEach((path) => {
      const length = path.getTotalLength()
      path.style.strokeDasharray = `${length}`
      path.style.strokeDashoffset = still ? '0' : `${length}`
    })
    const reveal = (face: HTMLElement): void => {
      if (face.classList.contains('is-seen')) return
      face.classList.add('is-seen')
      const ink = face.querySelectorAll('.ink:not(.dashed)')
      if (ink.length) gsap.to(ink, { strokeDashoffset: 0, duration: 1.2, ease: 'power1.inOut', stagger: 0.1, delay: 0.15 })
    }

    const fit = (): void => {
      const phone = window.matchMedia(PHONE).matches
      const width = phone ? root.clientWidth - 28 : root.clientWidth * 0.92
      const height = (phone ? stage.clientHeight : window.innerHeight) - (phone ? 224 : 170)
      const scale = Math.min(width / (phone ? PAGE_W : PAGE_W * 2), height / PAGE_H)
      stage.style.setProperty('--scale', String(Math.max(0.1, scale)))
    }
    fit()
    window.addEventListener('resize', fit)

    // s is how far through the book you are. On a wide screen one step turns one
    // leaf. On a phone you see one page at a time, so a step either turns a leaf
    // or slides across the spread to the page beside it.
    const render = (s: number, phone: boolean): void => {
      let camera: number
      if (phone) {
        const pair = Math.floor(s)
        const t = s - pair
        camera = pair % 2 === 0 ? -0.5 + t : 0.5 - t
      } else {
        camera = s < 1 ? -0.5 * (1 - s) : s > count - 1 ? 0.5 * (s - (count - 1)) : 0
      }
      book.style.setProperty('--camera', String(camera))
      leafEls.forEach((leaf, k) => {
        const local = clamp01(phone ? s - 2 * k : s - k)
        const angle = -180 * local
        // The free edge lifts off the desk before the leaf crosses the spine.
        const lift = Math.sin(Math.PI * local)
        leaf.style.transform = `translateZ(${lift * 16}px) rotateY(${angle}deg) rotateX(${Math.sin(local * Math.PI * 2) * 1.2}deg)`
        leaf.style.setProperty('--turn-shadow', String(lift * .18))
        leaf.style.setProperty('--corner-lift', String(lift))
        leaf.style.zIndex = String(local > 0 && local < 1 ? count * 3 : local >= 0.5 ? count + k : count - k)
        fronts[k].style.setProperty('--shade', String(Math.min(local, 0.5) * 0.9))
        backs[k].style.setProperty('--shade', String(Math.min(1 - local, 0.5) * 0.9))
        if (local > 0.5) reveal(backs[k])
        if (k > 0 && clamp01(phone ? s - 2 * (k - 1) : s - (k - 1)) > 0.5) reveal(fronts[k])
      })
      const at = Math.round(s)
      fronts.forEach((face, k) => {
        const visible = phone ? at === k * 2 : at === k
        face.inert = !visible
        face.setAttribute('aria-hidden', String(!visible))
      })
      backs.forEach((face, k) => {
        const visible = phone ? at === k * 2 + 1 : at === k + 1
        face.inert = !visible
        face.setAttribute('aria-hidden', String(!visible))
      })
      setStep(at)
    }

    const mm = gsap.matchMedia()
    const build = (phone: boolean): (() => void) => {
      fit()
      // A breakpoint reverts the old GSAP context, including its ink strokes.
      // Pages already visited should keep their drawings in the new layout.
      const seenInk = root.querySelectorAll('.sk-face.is-seen .ink:not(.dashed)')
      if (seenInk.length) gsap.set(seenInk, { strokeDashoffset: 0 })
      const total = phone ? count * 2 - 1 : count
      setSteps(total)
      if (phone) {
        const track = stage.parentElement!
        track.classList.add('is-native-book')
        const bookLength = 1 + .45 + (total - 1) * .65
        track.style.setProperty('--book-length', String(bookLength))
        let viewportWidth = 0
        let frame = 0
        const measure = (): void => {
          // Keep browser-toolbar resizes from changing the book's scroll track.
          // Rotation and actual width changes still refit the page.
          if (Math.abs(window.innerWidth - viewportWidth) > 2) {
            viewportWidth = window.innerWidth
            stage.style.removeProperty('height')
            const height = stage.clientHeight || window.innerHeight
            stage.style.height = `${height}px`
            track.style.height = `${height * bookLength}px`
            fit()
          }
        }
        measure()
        render(0, true)
        // Read native page geometry directly on phones. Opening the cover starts
        // on the first swipe; later pages hold flat long enough to read.
        const update = (): void => {
          frame = 0
          const distance = Math.max(0, -track.getBoundingClientRect().top) / stage.clientHeight
          const s = Math.min(total, distance < .45 ? distance / .45 : 1 + (distance - .45) / .65)
          const at = Math.floor(s)
          const turn = at === 0 ? s : clamp01((s - at - .6) / .4)
          render(at + turn * turn * (3 - 2 * turn), true)
        }
        const schedule = (): void => { if (!frame) frame = requestAnimationFrame(update) }
        const resize = (): void => { measure(); schedule() }
        window.addEventListener('scroll', schedule, { passive: true })
        window.addEventListener('touchmove', schedule, { passive: true })
        window.addEventListener('resize', resize)
        window.addEventListener('pageshow', resize)
        goTo.current = (target, immediate = false) => {
          const at = Math.min(total, Math.max(0, target))
          const distance = at <= 1 ? at * .45 : .45 + (at - 1) * .65
          const top = track.getBoundingClientRect().top + window.scrollY + distance * stage.clientHeight
          if (immediate) { window.scrollTo(0, top); render(at, true) }
          else window.scrollTo({ top, behavior: 'smooth' })
          schedule()
        }
        schedule()
        return () => {
          cancelAnimationFrame(frame)
          window.removeEventListener('scroll', schedule)
          window.removeEventListener('touchmove', schedule)
          window.removeEventListener('resize', resize)
          window.removeEventListener('pageshow', resize)
          track.classList.remove('is-native-book')
          track.style.removeProperty('--book-length')
          track.style.removeProperty('height')
          stage.style.removeProperty('height')
        }
      }
      const state = { s: 0 }
      render(0, phone)
      const trigger = { current: null as ScrollTrigger | null }
      let preserve: number | null = null
      let refreshFrame = 0
      // A mood switch resets the old page's scroll on the next frame. Only
      // preserve a page after that reset, so the previous view cannot open the book.
      let canPreserve = false
      const tween = gsap.fromTo(state, { s: 0 }, {
        s: total,
        ease: 'none',
        onUpdate: () => {
          if (window.scrollY <= 2) canPreserve = true
          render(state.s, phone)
        },
        scrollTrigger: {
          trigger: stage,
          pin: true,
          start: 'top top',
          end: () => `+=${total * window.innerHeight * (phone ? 0.7 : 0.85)}`,
          scrub: still ? true : 0.7,
          onRefreshInit: () => {
            preserve = canPreserve && Math.abs(stage.getBoundingClientRect().top) < 4 ? Math.round(state.s) : null
          },
          onRefresh: (self) => {
            trigger.current = self
            if (preserve !== null) {
              const target = preserve
              preserve = null
              cancelAnimationFrame(refreshFrame)
              refreshFrame = requestAnimationFrame(() => goTo.current(target, true))
            }
          }
        }
      })
      trigger.current = tween.scrollTrigger ?? null
      const stepY = (target: number): number => {
        const st = trigger.current!
        return st.start + (Math.min(total, Math.max(0, target)) / total) * (st.end - st.start)
      }
      goTo.current = (target: number, immediate = false) => {
        if (!trigger.current) return
        const lenis = getLenis()
        if (lenis) lenis.scrollTo(stepY(target), { duration: 1.1, immediate, force: immediate })
        else window.scrollTo({ top: stepY(target), behavior: immediate ? 'instant' : 'smooth' })
        if (immediate) {
          ScrollTrigger.update()
          tween.scrollTrigger?.getTween()?.progress(1)
          tween.progress(Math.min(total, Math.max(0, target)) / total)
        }
      }
      // On wide screens, the book settles on the nearer spread.
      let settle = 0
      const onScroll = (): void => {
        window.clearTimeout(settle)
        settle = window.setTimeout(() => {
          const st = trigger.current
          const lenis = getLenis()
          if (!st || !lenis || lenis.isScrolling || window.scrollY <= st.start || window.scrollY >= st.end) return
          const nearest = Math.round(((window.scrollY - st.start) / (st.end - st.start)) * total)
          if (Math.abs(window.scrollY - stepY(nearest)) > 2) lenis.scrollTo(stepY(nearest), { duration: 0.6 })
        }, 160)
      }
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => {
        cancelAnimationFrame(refreshFrame)
        window.clearTimeout(settle)
        window.removeEventListener('scroll', onScroll)
        tween.scrollTrigger?.kill()
      }
    }
    mm.add(PHONE, () => build(true))
    mm.add('(min-width: 861px)', () => build(false))

    const keys = (event: KeyboardEvent): void => {
      if (event.target instanceof Element && event.target.closest('a, button, input, textarea, select, [contenteditable]')) return
      const rect = stage.getBoundingClientRect()
      if (Math.abs(rect.top) > 4) return
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        goTo.current(Math.round(stepRef.current) + (event.key === 'ArrowRight' ? 1 : -1))
      }
    }
    window.addEventListener('keydown', keys)
    return () => {
      mm.revert()
      window.removeEventListener('resize', fit)
      window.removeEventListener('keydown', keys)
    }
  }, [leaves, still])

  return (
    <InkMode.Provider value={drawing}>
    <div className={`sketchbook ${still ? 'is-still' : ''} ${drawing ? 'is-drawing' : ''}`} ref={rootRef}>
      <h1 className="sr-only">Arian Shamsabadi’s sketchbook</h1>
      {still ? <section className="sk-static" aria-label="Notebook pages">
        {pages.map((page, i) => <Face key={i} page={page} side={i % 2 ? 'back' : 'front'} folio={i - 1} />)}
      </section> : <div className="sk-scroll-track"><section className="sk-stage">
        <div className="sk-tools">
          <select aria-label="Notebook chapter" value={chapters.reduce((at, [candidate]) => candidate <= step ? candidate : at, 0)} onChange={(event) => { setDrawing(false); goTo.current(Number(event.target.value)) }}>
            {chapters.map(([at, label]) => <option key={at} value={at}>{label}</option>)}
          </select>
          <button type="button" aria-pressed={drawing} disabled={pages[step]?.kind === 'cover'} onClick={() => { if (!drawing) goTo.current(step, true); setDrawing((value) => !value) }}>{drawing ? 'Done' : 'Draw'}</button>
          <button type="button" aria-label="Clear this page" disabled={pages[step]?.kind === 'cover'} onClick={clearPage}>Clear</button>
        </div>
        <div className="sk-desk">
          <div className="sk-book">
            {leaves.map(([front, back], k) => (
              <div className="sk-leaf" key={k}>
                <Face page={front} side="front" folio={2 * k - 1} onOpen={k === 0 ? () => goTo.current(1) : undefined} />
                <Face page={back} side="back" folio={2 * k} />
              </div>
            ))}
            <div className="sk-rings" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} />)}</div>
          </div>
        </div>
        <nav className="sk-controls" aria-label="Turn pages">
          <button type="button" onClick={() => goTo.current(step - 1)} disabled={step === 0}>← back</button>
          <span role="status" aria-live="polite">{step === 0 ? 'scroll to open ↓' : step >= steps ? 'the end' : `${step} / ${steps - 1}`}</span>
          <button type="button" onClick={() => goTo.current(step + 1)} disabled={step >= steps}>next →</button>
        </nav>
      </section></div>}

      <footer className="sk-footer">
        <p className="sk-footer-big">That’s the whole notebook.</p>
        <a className="sk-mail" href={`mailto:${profile.email}`} data-cursor="write">{profile.email.split('@')[0]}@<wbr />{profile.email.split('@')[1]}</a>
        <div className="sk-footer-links">
          <a href={profile.telegram} target="_blank" rel="noreferrer">Telegram</a>
          <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          <button type="button" onClick={onExit}>back to normal →</button>
        </div>
        <p className="sk-footer-small">© 2026 {profile.name} · drawn in Istanbul</p>
      </footer>
    </div>
    </InkMode.Provider>
  )
}
