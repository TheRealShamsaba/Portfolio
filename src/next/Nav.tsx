import React from 'react'
import './nav.css'
import { switchView } from '../view'
import { MOODS, type Mood } from './mood'
import { getLenis, scrollToId } from '../site/motion'
import { profile } from '../site/data'

// The header: a floating bar dressed by the mood. On a laptop the links, the mood
// switch and the way to talk sit in one line; on a phone they fold into a menu that
// fills the screen. It slips away while you read down and comes back when you scroll up.

const LINKS: [string, string][] = [['work', 'Work'], ['drip', 'Drip'], ['posters', 'Posters'], ['contact', 'Contact']]

function useHeader(open: boolean): { hidden: boolean; here: string } {
  const [hidden, setHidden] = React.useState(false)
  const [here, setHere] = React.useState('')
  React.useEffect(() => {
    let last = window.scrollY
    let frame = 0
    const update = (): void => {
      frame = 0
      const y = window.scrollY
      // A few pixels of slack, so a finger resting on the glass doesn't make it flicker.
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 160)
        last = y
      }
      const middle = window.innerHeight * 0.45
      const current = LINKS.find(([id]) => {
        const box = document.getElementById(id)?.getBoundingClientRect()
        return box ? box.top <= middle && box.bottom > middle : false
      })
      setHere(current ? current[0] : '')
    }
    const schedule = (): void => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', schedule, { passive: true })
    return () => { window.removeEventListener('scroll', schedule); cancelAnimationFrame(frame) }
  }, [])
  return { hidden: hidden && !open, here }
}

export default function Nav({ mood, onMood }: { mood: Mood; onMood: (mood: Mood) => void }): React.ReactElement {
  const [sheet, setSheet] = React.useState(false)
  const [picker, setPicker] = React.useState(false)
  const { hidden, here } = useHeader(sheet || picker)
  const sheetRef = React.useRef<HTMLDivElement>(null)
  const pickerRef = React.useRef<HTMLDivElement>(null)
  const current = MOODS.find((item) => item.id === mood)!

  // The phone menu holds the page still while it is open, and Escape closes it.
  React.useEffect(() => {
    if (!sheet) return
    document.documentElement.classList.add('nx-locked')
    getLenis()?.stop()
    sheetRef.current?.querySelector<HTMLElement>('a, button')?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent): void => { if (event.key === 'Escape') setSheet(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.classList.remove('nx-locked')
      getLenis()?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [sheet])

  // The laptop mood list closes on a click anywhere else.
  React.useEffect(() => {
    if (!picker) return
    const onDown = (event: PointerEvent): void => { if (!pickerRef.current?.contains(event.target as Node)) setPicker(false) }
    const onKey = (event: KeyboardEvent): void => { if (event.key === 'Escape') setPicker(false) }
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('pointerdown', onDown); window.removeEventListener('keydown', onKey) }
  }, [picker])

  const go = (id: string) => (event: React.MouseEvent): void => {
    event.preventDefault()
    setSheet(false)
    // Let the menu release the page before travelling.
    window.setTimeout(() => scrollToId(id), sheet ? 60 : 0)
  }
  const pick = (next: Mood): void => {
    setPicker(false)
    setSheet(false)
    onMood(next)
  }

  return (
    <>
      <header className={`nv ${hidden ? 'is-hidden' : ''} ${sheet ? 'is-open' : ''}`}>
        <a className="nv-mark" href="#top" onClick={go('top')} aria-label={`${profile.name}, back to the top`}>A.S.</a>

        <nav className="nv-bar" aria-label="Sections">
          {LINKS.slice(0, 3).map(([id, name]) => (
            <a key={id} href={`#${id}`} className={`nv-link ${here === id ? 'is-here' : ''}`} onClick={go(id)}>{name}</a>
          ))}
          <i className="nv-rule" aria-hidden="true" />
          <div className="nv-mood" ref={pickerRef}>
            <button type="button" className="nv-mood-btn" aria-expanded={picker} aria-haspopup="true" onClick={() => setPicker((value) => !value)}>
              <i className={`nv-dot is-${mood}`} aria-hidden="true" /><span className="nv-mood-k">Mood</span> {current.label}<svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" /></svg>
            </button>
            {picker ? (
              <ul className="nv-moods" role="menu">
                {MOODS.map((item) => (
                  <li key={item.id} role="none">
                    <button type="button" role="menuitemradio" aria-checked={item.id === mood} className={`nv-mood-item is-${item.id}`} onClick={() => pick(item.id)}>
                      <b>{item.label}</b><small>{item.line}</small>
                    </button>
                  </li>
                ))}
                <li role="none" className="nv-moods-lite">
                  <button type="button" role="menuitem" onClick={() => switchView('lite')}>Light version <small>for slow connections</small></button>
                </li>
              </ul>
            ) : null}
          </div>
          <a href="#contact" className="nv-cta" onClick={go('contact')}>Write to me</a>
        </nav>

        <button type="button" className="nv-burger" aria-expanded={sheet} aria-controls="nv-sheet" onClick={() => setSheet((value) => !value)}>
          <i className={`nv-dot is-${mood}`} aria-hidden="true" />
          <span>{sheet ? 'Close' : 'Menu'}</span>
          <span className="nv-lines" aria-hidden="true"><i /><i /></span>
        </button>
      </header>

      <div id="nv-sheet" className={`nv-sheet ${sheet ? 'is-open' : ''}`} ref={sheetRef} aria-hidden={!sheet} {...(sheet ? {} : ({ inert: '' } as object))}>
        <nav className="nv-sheet-links" aria-label="Sections">
          {LINKS.map(([id, name], i) => (
            <a key={id} href={`#${id}`} className={here === id ? 'is-here' : ''} onClick={go(id)} style={{ '--i': i } as React.CSSProperties}>
              <small>0{i + 1}</small>{name}
            </a>
          ))}
        </nav>
        <div className="nv-sheet-moods">
          <p className="nv-sheet-k">Pick a mood</p>
          <ul>
            {MOODS.map((item, i) => (
              <li key={item.id} style={{ '--i': i + 4 } as React.CSSProperties}>
                <button type="button" aria-pressed={item.id === mood} className={`nv-mood-item is-${item.id}`} onClick={() => pick(item.id)}>
                  <b>{item.label}</b><small>{item.line}</small>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="nv-sheet-foot">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <button type="button" onClick={() => switchView('lite')}>Light version →</button>
        </div>
      </div>
    </>
  )
}
