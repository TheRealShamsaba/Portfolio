import React from 'react'
import PosterMood from './PosterMood'
import MagazineMood from './MagazineMood'
import SketchMood from './SketchMood'
import { applyScene } from '../scenes'
import { prefersReducedMotion, resetScroll } from '../motion'
import { moods, type Mood } from './data'

// The other side of the site: the same work, told three completely different ways.

const MOOD_SCENE: Record<Mood, { bg: string; fg: string; accent: string }> = {
  poster: { bg: '#ebe6dc', fg: '#131313', accent: '#8d95f3' },
  magazine: { bg: '#f4f1ea', fg: '#0d0d0d', accent: '#e10600' },
  sketch: { bg: '#f6f1e4', fg: '#1d2340', accent: '#2f4bd8' }
}

export default function Zine({ onExit }: { onExit: () => void }): React.ReactElement {
  const [mood, setMood] = React.useState<Mood>(() => {
    try {
      const saved = localStorage.getItem('mood') as Mood | null
      return saved && moods.some((m) => m.id === saved) ? saved : 'poster'
    } catch {
      return 'poster'
    }
  })
  const [turn, setTurn] = React.useState(0)
  const turnTimer = React.useRef(0)
  React.useEffect(() => () => window.clearTimeout(turnTimer.current), [])
  const changeMood = (next: Mood): void => {
    window.clearTimeout(turnTimer.current)
    if (next === mood) return
    setTurn((value) => value + 1)
    turnTimer.current = window.setTimeout(() => setMood(next), prefersReducedMotion() ? 0 : 420)
  }

  React.useEffect(() => {
    applyScene(MOOD_SCENE[mood], 'The other side', true)
    const frame = requestAnimationFrame(resetScroll)
    try {
      localStorage.setItem('mood', mood)
    } catch {
      // Private mode: the mood lasts until reload.
    }
    return () => cancelAnimationFrame(frame)
  }, [mood])

  return (
    <div className={`zine-shell is-${mood}`}>
      <div key={turn} className={`side-wipe ${turn ? 'is-on' : ''}`} aria-hidden="true"><span>A.S.</span></div>
      <header className="z-header">
        <span className="z-mark">A.S.</span>
        <nav className="z-moods" aria-label="Mood">
          {moods.map((option) => (
            <button key={option.id} type="button" className={mood === option.id ? 'is-on' : ''} aria-pressed={mood === option.id} onClick={() => changeMood(option.id)}>
              {option.label}
            </button>
          ))}
        </nav>
        <button type="button" className="z-exit" onClick={onExit} data-cursor="normal"><span className="z-exit-long">Back to </span>normal</button>
      </header>
      <main id="main-content" tabIndex={-1}>
        {mood === 'poster' ? <PosterMood key="poster" onExit={onExit} /> : null}
        {mood === 'magazine' ? <MagazineMood key="magazine" onExit={onExit} /> : null}
        {mood === 'sketch' ? <SketchMood key="sketch" onExit={onExit} /> : null}
      </main>
    </div>
  )
}
