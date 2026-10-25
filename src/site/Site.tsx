import React from 'react'
import Header from './Header'
import Loader from './Loader'
import Opening from './sections/Opening'
import Statement from './sections/Statement'
import Programme from './sections/Programme'
import ChapterScene from './sections/ChapterScene'
import DripFilm from './sections/DripFilm'
import Broadcast from './sections/Broadcast'
import Letter from './sections/Letter'
import Archive from './sections/Archive'
import Contact from './sections/Contact'
import Zine from './zine/Zine'
import { ScrollTrigger, getLenis, prefersReducedMotion, resetScroll, useSmoothScroll } from './motion'
import { applyScene, parseScene } from './scenes'
import { clients, knightvision, works } from './data'

// Every section declares data-scene="bg,fg,accent"; as it reaches the middle of the
// screen the page eases into its colours and the header names the room.
function useScenes(setTitle: (title: string) => void): void {
  React.useEffect(() => {
    const onTitle = (event: Event): void => setTitle((event as CustomEvent<string>).detail)
    window.addEventListener('roomtitle', onTitle)
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'))
    let current: HTMLElement | undefined
    let frame = 0
    // Measure the visible rooms themselves: pin spacers move during refresh and
    // can otherwise announce the next project while the previous one is on screen.
    const update = (): void => {
      frame = 0
      const middle = window.innerHeight * 0.55
      const active = sections.find((section) => {
        const rect = section.getBoundingClientRect()
        return rect.top <= middle && rect.bottom > middle
      })
      if (!active || active === current) return
      current = active
      applyScene(parseScene(active.dataset.scene ?? ''), active.dataset.title ?? '')
    }
    const schedule = (): void => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    schedule()
    return () => {
      window.removeEventListener('roomtitle', onTitle)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(frame)
    }
  }, [setTitle])
}

const numberOf = (id: string): string => ['I', 'II', 'III', 'IV', 'V'][works.findIndex((work) => work.id === id)]
const detailsOf = (id: string): { kind: string; year: string } => works.find((work) => work.id === id) ?? { kind: '', year: '' }

const OPENING_SCENE = parseScene('#0c0c0c,#efebe3,#8d95f3')

// The normal, presentable page: the rooms, in order.
function LightSide({ ready, onDark }: { ready: boolean; onDark: () => void }): React.ReactElement {
  const [title, setTitle] = React.useState('Arian Shamsabadi')
  useScenes(setTitle)
  React.useEffect(() => { applyScene(OPENING_SCENE, 'Arian Shamsabadi', true) }, [])

  return (
    <>
      <Header title={title} onDark={onDark} />
      <main id="main-content" tabIndex={-1}>
        <Opening ready={ready} />
        <Statement />
        <Programme />
        {clients.map((chapter) => (
          <ChapterScene key={chapter.id} chapter={chapter} number={numberOf(chapter.id)} {...detailsOf(chapter.id)} />
        ))}
        <DripFilm />
        <ChapterScene chapter={knightvision} number={numberOf('knightvision')} {...detailsOf('knightvision')} />
        <Broadcast />
        <Letter />
        <Archive />
        <Contact />
      </main>
    </>
  )
}

// Ways in that aren't on the page: type "wild", or click the A.S. mark five times fast.
function useSecretDoor(open: () => void): void {
  React.useEffect(() => {
    let typed = ''
    let clicks: number[] = []
    const onKey = (event: KeyboardEvent): void => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
      typed = (typed + event.key.toLowerCase()).slice(-4)
      if (typed === 'wild') {
        typed = ''
        open()
      }
    }
    const onClick = (event: MouseEvent): void => {
      if (!(event.target as Element | null)?.closest?.('.site-mark')) return
      const now = performance.now()
      clicks = [...clicks.filter((time) => now - time < 2000), now]
      if (clicks.length >= 5) {
        clicks = []
        open()
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClick)
    }
  }, [open])
}

export default function Site(): React.ReactElement {
  const [ready, setReady] = React.useState(false)
  const [side, setSide] = React.useState<'normal' | 'moods'>('normal')
  const [flash, setFlash] = React.useState(0)
  useSmoothScroll()

  React.useEffect(() => {
    const lenis = getLenis()
    if (ready) lenis?.start()
    else lenis?.stop()
    document.documentElement.classList.toggle('is-loading', !ready)
  }, [ready])

  React.useEffect(() => {
    const frame = requestAnimationFrame(resetScroll)
    return () => cancelAnimationFrame(frame)
  }, [side])

  React.useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const onLoad = (): void => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    // Lazy images change section heights after first layout; re-measure every trigger when they do.
    let timer = 0
    let lastHeight = document.documentElement.scrollHeight
    const observer = new ResizeObserver(() => {
      const height = document.documentElement.scrollHeight
      if (Math.abs(height - lastHeight) < 2) return
      lastHeight = height
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(true), 200)
    })
    observer.observe(document.body)
    return () => {
      window.removeEventListener('load', onLoad)
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [])

  // A sheet crosses the viewport, concealing the swap at its fully closed frame.
  const flipTimer = React.useRef(0)
  React.useEffect(() => () => window.clearTimeout(flipTimer.current), [])
  const flip = React.useCallback((to?: 'normal' | 'moods') => {
    window.clearTimeout(flipTimer.current)
    setFlash((count) => count + 1)
    flipTimer.current = window.setTimeout(() => {
      setSide((current) => to ?? (current === 'normal' ? 'moods' : 'normal'))
    }, prefersReducedMotion() ? 0 : 420)
  }, [])
  const toMoods = React.useCallback(() => flip('moods'), [flip])
  const toNormal = React.useCallback(() => flip('normal'), [flip])
  const toggle = React.useCallback(() => flip(), [flip])
  useSecretDoor(toggle)

  const onLoaded = React.useCallback(() => setReady(true), [])

  return (
    <div className="site">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Loader onDone={onLoaded} />
      <div className="grain" aria-hidden="true" />
      <div key={flash} className={`side-wipe ${flash ? 'is-on' : ''}`} aria-hidden="true"><span>A.S.</span></div>
      {side === 'normal' ? <LightSide ready={ready} onDark={toMoods} /> : <Zine onExit={toNormal} />}
    </div>
  )
}
