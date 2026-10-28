import React from 'react'
import 'lenis/dist/lenis.css'
import '../site/site.css'
import './next.css'
import './moods.css'
import { loadFonts } from '../fonts'
import { preload, prefetchOtherMoods, type Progress } from './preload'
import { switchView } from '../view'
import { MoodContext, readMood, saveMood, type Mood } from './mood'
import { PALETTES } from './palettes'
import Nav from './Nav'
import Work from './Work'
import Drip from './Drip'
import Collection from './Collection'
import Ending from './Ending'
import useInView from './useInView'
import { gsap, getLenis, ScrollTrigger, prefersReducedMotion, useSmoothScroll } from '../site/motion'
import { medium, profile, show } from '../site/data'

// Prototype of the next direction: a personal brand site, not a portfolio page.
// One colour, one mark, one object you can touch, real photographs.

// Contour lines, like the rock layers in Cappadocia: a smooth noise field traced with
// marching squares. Drawn once, at the size of the screen.
function Contours({ color }: { color: string }): React.ReactElement {
  const ref = React.useRef<HTMLCanvasElement>(null)
  React.useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const draw = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      const cell = 10
      const cols = Math.ceil(w / cell) + 1
      const rows = Math.ceil(h / cell) + 1
      const field = (x: number, y: number): number => {
        const u = x / 420
        const v = y / 420
        return Math.sin(u * 2.1 + Math.sin(v * 1.7) * 1.3) * 0.5 + Math.sin(v * 2.6 - u * 0.9 + Math.cos(u * 1.3) * 1.1) * 0.35 + Math.sin((u + v) * 4.2) * 0.12
      }
      const values: number[] = []
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) values.push(field(i * cell, j * cell))
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      for (let level = -0.9; level <= 0.9; level += 0.12) {
        ctx.beginPath()
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const a = values[j * cols + i]
            const b = values[j * cols + i + 1]
            const c = values[(j + 1) * cols + i + 1]
            const d = values[(j + 1) * cols + i]
            const x = i * cell
            const y = j * cell
            const points: [number, number][] = []
            const edge = (p: number, q: number, x1: number, y1: number, x2: number, y2: number): void => {
              if ((p - level) * (q - level) < 0) {
                const t = (level - p) / (q - p)
                points.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t])
              }
            }
            edge(a, b, x, y, x + cell, y)
            edge(b, c, x + cell, y, x + cell, y + cell)
            edge(c, d, x + cell, y + cell, x, y + cell)
            edge(d, a, x, y + cell, x, y)
            for (let k = 0; k + 1 < points.length; k += 2) {
              ctx.moveTo(points[k][0], points[k][1])
              ctx.lineTo(points[k + 1][0], points[k + 1][1])
            }
          }
        }
        ctx.stroke()
      }
    }
    draw()
    const observer = new ResizeObserver(draw)
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [color])
  return <canvas ref={ref} className="nx-contours" aria-hidden="true" />
}

// The waiting room: downloads everything the mood needs (see preload.ts) while the
// mark fills up like ink, then lifts away. The light version is always one tap away
// here, and pushed forward if the download is crawling.
function Loader({ mood, until, onLoaded, onDone }: { mood: Mood; until?: Promise<void>; onLoaded: () => void; onDone: () => void }): React.ReactElement | null {
  const ref = React.useRef<HTMLDivElement>(null)
  const [progress, setProgress] = React.useState<Progress>({ fraction: 0, label: 'Getting ready' })
  const [slow, setSlow] = React.useState(false)
  const [gone, setGone] = React.useState(false)
  const shown = React.useRef(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    document.documentElement.classList.add('is-loading')
    const started = performance.now()
    let cancelled = false
    const slowTimer = window.setTimeout(() => setSlow(true), 6000)
    // A ceiling, so a stuck request can never keep anyone out.
    const ceiling = new Promise<void>((resolve) => window.setTimeout(resolve, 25000))
    void Promise.race([preload(mood, setProgress), ceiling]).then(async () => {
      if (cancelled) return
      setProgress((value) => ({ ...value, fraction: 1, label: 'Opening the doors' }))
      // Long enough to read as a moment, never as a flash.
      await new Promise((resolve) => window.setTimeout(resolve, Math.max(0, 900 - (performance.now() - started))))
      if (cancelled) return
      onLoaded()
      // The hero draws its first picture behind the curtain before it lifts.
      await Promise.race([until ?? Promise.resolve(), new Promise((resolve) => window.setTimeout(resolve, 5000))])
      await new Promise((resolve) => window.setTimeout(resolve, 250))
      if (cancelled) return
      const finish = (): void => {
        document.documentElement.classList.remove('is-loading')
        document.documentElement.style.removeProperty('background')
        getLenis()?.start()
        setGone(true)
        onDone()
      }
      if (prefersReducedMotion() || document.hidden || !ref.current) { finish(); return }
      gsap.to(ref.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut', onComplete: finish })
    })
    return () => {
      cancelled = true
      window.clearTimeout(slowTimer)
      document.documentElement.classList.remove('is-loading')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The counter eases toward the real figure, so it climbs instead of jumping.
  React.useEffect(() => {
    let frame = 0
    const tick = (): void => {
      const target = progress.fraction * 100
      shown.current += (target - shown.current) * 0.12
      if (target - shown.current < 0.3) shown.current = target
      setCount(shown.current)
      if (shown.current !== target) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [progress.fraction])

  if (gone) return null
  const done = progress.fraction >= 1
  return (
    <div className={`nx-loader is-${mood} ${slow && !done ? 'is-slow' : ''}`} ref={ref} style={{ '--p': count / 100 } as React.CSSProperties} role="status" aria-live="polite">
      <p className="nx-loader-top"><span>Arian Shamsabadi</span><span>Istanbul · {new Date().getFullYear()}</span></p>
      <div className="nx-loader-mark" aria-hidden="true">
        <span className="is-outline">A.S.</span>
        <span className="is-ink">A.S.</span>
      </div>
      <div className="nx-loader-foot">
        <p className="nx-loader-label">{done ? 'Ready' : `${progress.label}…`}</p>
        <p className="nx-loader-count" aria-label={`${Math.round(count)} percent loaded`}>{String(Math.floor(count)).padStart(3, '0')}<small>%</small></p>
      </div>
      <i className="nx-loader-bar" aria-hidden="true" />
      <div className="nx-loader-lite">
        <p>{slow && !done ? 'Taking a while on this connection.' : 'Slow connection?'}</p>
        <button type="button" onClick={() => switchView('lite')}>Open the light version →</button>
      </div>
    </div>
  )
}

const manifesto: [string, boolean][] = [
  ['I turn', false], ['unclear', true], ['ideas into working systems.', false],
  ['Designed', true], ['properly,', false], ['built', true], ['properly,', false],
  ['and looked after', false], ['when they’re live.', true]
]

// The tunnel: photographs and posters hung at different depths. Scrolling flies you
// forward through them; they pass on both sides while the line in the middle changes
// from the day job to the thing I do for fun.
const tunnel: { src: string; caption: string }[] = [
  { src: profile.portrait, caption: 'Cappadocia' },
  { src: '/posters/concept-greatness-and-honor.webp', caption: 'Poster · Greatness and honor' },
  { src: show.image, caption: 'On the mic · The Reasonable Show' },
  { src: '/posters/identity-be-the-man-you-want.webp', caption: 'Poster · Be the man you want' },
  { src: '/posters/concept-perspective.webp', caption: 'Poster · Perspective' },
  { src: '/posters/concept-small-steps-big-mountains.webp', caption: 'Poster · Small steps, big mountains' },
  { src: '/posters/identity-embrace-duality.webp', caption: 'Poster · Embrace duality' },
  { src: '/posters/identity-rooted-in-adventure.webp', caption: 'Poster · Rooted in adventure' },
  { src: '/posters/concept-think-think.webp', caption: 'Poster · Think' },
  { src: '/posters/identity-every-photo-has-a-story.webp', caption: 'Poster · Every photo has a story' },
  { src: '/posters/media-reasonable-show-cover-01.webp', caption: 'Episode cover' },
  { src: '/posters/identity-loyalty.webp', caption: 'Poster · Loyalty' }
]
const DEPTH_STEP = 420
const TRAVEL = tunnel.length * DEPTH_STEP + 900
// Alternate sides and heights so the middle stays clear for the words.
const place = (i: number): { x: number; y: number; z: number; tilt: number } => ({
  x: (i % 2 === 0 ? -1 : 1) * (30 + ((i * 7) % 3) * 6),
  y: [-24, 20, -10, 26, -28, 12][i % 6],
  z: 500 + i * DEPTH_STEP,
  tilt: (i % 2 === 0 ? 1 : -1) * (4 + (i % 3) * 3)
})

// The 3D scenes are the heavy part; they stream in after the page itself.
const Cluster = React.lazy(() => import('./Cluster'))
const Studio = React.lazy(() => import('./Room'))
// Each mood but the studio has its own site structure.
const Covers = React.lazy(() => import('./Covers'))
const Cypher = React.lazy(() => import('./Cypher'))
const Sketch = React.lazy(() => import('./Sketch'))

export default function Next(): React.ReactElement {
  const [loaded, setLoaded] = React.useState(false)
  const [hero] = React.useState(() => {
    let done = (): void => undefined
    const drawn = new Promise<void>((resolve) => { done = resolve })
    return { drawn, done }
  })
  const [ready, setReady] = React.useState(false)
  const [palette, setPalette] = React.useState(0)
  const [mood, setMood] = React.useState<Mood>(readMood)
  const [wipe, setWipe] = React.useState(0)
  React.useEffect(() => { saveMood(mood) }, [mood])
  // Changing mood: a sheet sweeps across and the site comes back re-dressed.
  const changeMood = (next: Mood): void => {
    if (next === mood) return
    setWipe((value) => value + 1)
    // Swap under the sheet once the new mood's code and lettering are in.
    const chunk = { studio: () => import('./Room'), posters: () => import('./Covers'), hiphop: () => import('./Cypher'), sketch: () => import('./Sketch') }[next]
    const wait = (ms: number): Promise<void> => new Promise((resolve) => window.setTimeout(resolve, ms))
    void Promise.all([wait(prefersReducedMotion() ? 0 : 380), Promise.race([Promise.all([chunk(), loadFonts(next)]), wait(4000)])]).then(() => setMood(next))
  }
  const rootRef = React.useRef<HTMLDivElement>(null)
  const heroRef = React.useRef<HTMLElement>(null)
  const heroInView = useInView(heroRef)
  const touch = React.useMemo(() => window.matchMedia('(pointer: coarse)').matches, [])
  const accent = PALETTES[palette].accent
  useSmoothScroll()

  React.useEffect(() => {
    if (!ready || prefersReducedMotion() || mood !== 'studio') return
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.nx-name span', { yPercent: 105, duration: 1.4, stagger: 0.08 })
        .from('.nv > *, .nx-hero-foot > *', { y: 16, opacity: 0, duration: 1, stagger: 0.06 }, 0.3)
      // The giant name sinks behind the cluster as you leave the hero.
      gsap.to('.nx-name', { yPercent: 30, ease: 'none', scrollTrigger: { trigger: '.nx-hero', start: 'top top', end: 'bottom top', scrub: true } })
      // Manifesto: each word inks in as you read down.
      gsap.fromTo('.nx-word', { opacity: 0.12 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '.nx-manifesto', start: 'top 70%', end: 'bottom 60%', scrub: true } })
      // The tunnel: move the camera forward; each photo fades in from the dark and out as it passes.
      const collage = document.querySelector<HTMLElement>('.nx-collage')!
      const world = collage.querySelector<HTMLElement>('.nx-world')!
      const shots = Array.from(collage.querySelectorAll<HTMLElement>('.nx-photo'))
      const state = { p: 0 }
      gsap.to(state, {
        p: 1, ease: 'none',
        scrollTrigger: { trigger: collage, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
        onUpdate: () => {
          const travel = state.p * TRAVEL
          world.style.transform = `translateZ(${travel}px)`
          shots.forEach((shot, i) => {
            const z = travel - place(i).z
            const appear = Math.min(1, Math.max(0, (z + 3400) / 900))
            const leave = Math.min(1, Math.max(0, (760 - z) / 320))
            shot.style.opacity = String(appear * leave)
          })
          collage.dataset.phase = state.p < 0.42 ? 'a' : state.p < 0.8 ? 'b' : 'c'
        }
      })
    }, rootRef)
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [ready, mood])

  return (
    <MoodContext.Provider value={mood}>
    <div className="nx" data-mood={mood} ref={rootRef} style={{ '--nx-accent': accent } as React.CSSProperties}>
      {wipe ? <div key={wipe} className="nx-wipe" aria-hidden="true" /> : null}
      <Loader mood={mood} until={mood === 'studio' ? hero.drawn : undefined} onLoaded={() => setLoaded(true)} onDone={() => { setReady(true); prefetchOtherMoods(mood) }} />

      <Nav mood={mood} onMood={changeMood} />

      {mood === 'posters' ? (
        <React.Suspense fallback={null}><Covers /></React.Suspense>
      ) : mood === 'hiphop' ? (
        <React.Suspense fallback={null}><Cypher /></React.Suspense>
      ) : mood === 'sketch' ? (
        <React.Suspense fallback={null}><Sketch /></React.Suspense>
      ) : (
      <>
      <section className="nx-hero" ref={heroRef}>
        <h1 className="nx-name" aria-label={profile.name}><span>Arian</span></h1>
        {loaded ? <React.Suspense fallback={null}><Cluster onReady={hero.done} accent={accent} active={heroInView} mood={mood} onPick={() => setPalette((value) => (value + 1) % PALETTES.length)} /></React.Suspense> : null}
        <div className="nx-hero-foot">
          <p className="nx-intro">Engineer and founder of Real Co. I design and build software for companies in Turkey and Iran, and a few products of my own.</p>
          <p className="nx-hint">{touch ? <>Things from my shelves. Swipe across to push them, <br />tap to change the clay.</> : <>Things from my shelves. Push them around, <br />click to change the clay.</>}</p>
        </div>
      </section>

      {/* Holds its height while the 3D loads, so nothing below jumps. */}
      <React.Suspense fallback={<section className="ns" id="studio" />}><Studio mood={mood} /></React.Suspense>

      <section className="nx-manifesto">
        <Contours color="rgba(141, 149, 243, 0.18)" />
        <p className="nx-manifesto-kicker">Arian Shamsabadi · Istanbul</p>
        <p className="nx-manifesto-text">
          {manifesto.map(([text, accented], i) => (
            <span key={i} className={`nx-word ${accented ? 'is-accent' : ''}`}>{text} </span>
          ))}
        </p>
      </section>

      <section className="nx-collage" data-phase="a">
        <div className="nx-tunnel">
          <div className="nx-world">
            {tunnel.map((photo, i) => {
              const at = place(i)
              return (
                <figure
                  key={photo.src}
                  className="nx-photo"
                  style={{ transform: `translate(-50%, -50%) translate3d(${at.x}vw, ${at.y}vh, ${-at.z}px) rotate(${at.tilt}deg)` }}
                >
                  <img src={medium(photo.src)} alt="" loading="lazy" decoding="async" />
                  <figcaption>{photo.caption}</figcaption>
                </figure>
              )
            })}
          </div>
          <div className="nx-tunnel-copy">
            <p className="nx-line is-a">I build software<br /><em>for a living.</em></p>
            <p className="nx-line is-b">I make posters<br /><em>for the fun of it.</em></p>
            <span className="nx-sign">Arian</span>
          </div>
          <p className="nx-tunnel-count" aria-hidden="true">{tunnel.length} pieces · scroll to walk through</p>
        </div>
      </section>

      <Work />
      <Drip />
      <Collection />
      <Ending />
      </>
      )}
    </div>
    </MoodContext.Provider>
  )
}
