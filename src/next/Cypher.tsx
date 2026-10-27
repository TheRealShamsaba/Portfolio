import React from 'react'
import { getLenis, prefersReducedMotion, resetScroll, scrollToId } from '../site/motion'
import { archive, clients, dripApp, knightvision, profile, show, type Chapter } from '../site/data'
import { CaseReader } from './CaseStudy'
import { KnightVisionBoard } from './KnightVisionBoard'
import { BPM, Deck, HITS, LOOP, since } from './beat'
import Crate from './Crate'
import type { Member, Rig } from './CypherScene'
import './album.css'
import './cypher.css'

// The Hip-hop mood: a cypher. My six projects stand in a circle; scrolling passes the
// mic round it. Whoever has it gets the light, and their verse (the real story of the
// project) lands word by word on the beat, like a lyric video.

const CypherScene = React.lazy(() => import('./CypherScene'))

type Spot = Member & {
  id: string
  name: string
  role: string
  verse: string
  client?: Chapter
  links: { label: string; href: string }[]
  play?: boolean
}

const PLAYLIST = 'https://embed.music.apple.com/tr/playlist/hustleholic/pl.u-d2b0k40uMpEJb93'
const [dgm, delux, realco] = clients

// Crops show the top of each site in a 3:4 screen: [repeat x, repeat y, offset x, offset y].
const SPOTS: Spot[] = [
  { id: 'dgm', name: dgm.title, role: dgm.place, image: dgm.image, crop: [1, 0.472, 0, 0.528], light: '#3fd0ff', verse: `${dgm.line} ${dgm.story}`, client: dgm, links: [{ label: `${dgm.host} ↗`, href: dgm.url }] },
  { id: 'delux', name: delux.title, role: delux.place, image: delux.image, crop: [1, 0.428, 0, 0.572], light: '#ff3b30', verse: `${delux.line} ${delux.story}`, client: delux, links: [{ label: `${delux.host} ↗`, href: delux.url }] },
  { id: 'realco', name: realco.title, role: realco.place, image: realco.image, crop: [1, 0.427, 0, 0.573], light: '#5b78ff', verse: `${realco.line} ${realco.story}`, client: realco, links: [{ label: `${realco.host} ↗`, href: realco.url }] },
  { id: 'drip', name: 'Drip', role: 'My own product · Private beta', image: '/projects/drip-app/screens/verdict.webp', crop: [1, 0.626, 0, 0.187], light: '#ff6a3d', verse: `${dripApp.question} ${dripApp.chapters[1].title} ${dripApp.chapters[1].text}`, links: [{ label: 'Join the waitlist ↗', href: dripApp.url }] },
  { id: 'knightvision', name: `${knightvision.title} feat. BakerDmo`, role: knightvision.place, board: true, crop: [1, 1, 0, 0], light: '#f2c14e', verse: `${knightvision.line} ${knightvision.story}`, play: true, links: [{ label: 'The repo ↗', href: knightvision.url }] },
  { id: 'show', name: show.title, role: 'The podcast I host', image: show.image, crop: [0.442, 1, 0.3, 0], light: '#a45bff', verse: show.text, links: [{ label: 'Episodes ↗', href: 'https://www.youtube.com/@TheReasonableShow' }] }
]
const WORDS = SPOTS.map((spot) => spot.verse.split(/\s+/).filter(Boolean))
const PER_LINE = 8

export default function Cypher(): React.ReactElement {
  const stageRef = React.useRef<HTMLElement>(null)
  const captionRef = React.useRef<HTMLParagraphElement>(null)
  const deckRef = React.useRef<Deck | null>(null)
  const rig = React.useRef<Rig>({ intro: 0, active: -1, kick: 0, snare: 0 })
  const [active, setActive] = React.useState(-1)
  const [live, setLive] = React.useState(true)
  const [sound, setSound] = React.useState<'off' | 'loading' | 'on'>('off')
  const [reading, setReading] = React.useState<Chapter | null>(null)
  const [playing, setPlaying] = React.useState(false)
  const [viewing, setViewing] = React.useState<number | null>(null)
  const originals = archive.filter((poster) => poster.category !== 'media')
  const viewed = viewing === null ? null : originals[viewing]

  React.useEffect(() => { resetScroll() }, [])
  React.useEffect(() => () => { deckRef.current?.close() }, [])

  // The clock: the deck's when there's sound, kept here when there isn't. It drives the
  // kick on the light and camera, and which word of the verse is landing.
  React.useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const still = prefersReducedMotion()
    let pos = 0
    let lastPos = 0
    let beats = 0
    let verseAt = 0
    let lastActive = -2
    let lastWord = -1
    let prev = performance.now()
    let raf = 0
    const frame = (now: number): void => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      const vh = window.innerHeight
      const top = -stage.getBoundingClientRect().top
      const inView = top > -vh && top < stage.offsetHeight
      setLive(inView)
      const intro = Math.min(1, Math.max(0, top / (vh * 0.6)))
      const index = top < vh * 0.6 ? -1 : Math.min(SPOTS.length - 1, Math.floor((top - vh * 0.6) / vh))
      if (index !== lastActive) {
        lastActive = index
        setActive(index)
        verseAt = beats
        lastWord = -1
      }
      const deck = deckRef.current
      deck?.setRate(inView ? 1 : 0)
      if (deck && sound === 'on') pos = deck.position
      else if (inView) pos = (pos + dt) % LOOP
      beats += ((pos - lastPos + LOOP) % LOOP) / (60 / BPM)
      lastPos = pos
      const kick = still ? 0 : Math.exp(-since(HITS.kick, pos) * 9)
      const snare = still ? 0 : Math.exp(-since(HITS.snare, pos) * 11)
      rig.current = { intro, active: index, kick, snare }
      stage.style.setProperty('--kick', kick.toFixed(3))

      // The verse: a word every eighth note, a line of eight to a bar.
      if (index >= 0 && captionRef.current) {
        const words = WORDS[index]
        const w = Math.floor((beats - verseAt) * 2) % words.length
        if (w !== lastWord) {
          lastWord = w
          const line = Math.floor(w / PER_LINE)
          const from = line * PER_LINE
          captionRef.current.innerHTML = words.slice(from, from + PER_LINE)
            .map((word, k) => `<span class="${from + k < w ? 'is-said' : from + k === w ? 'is-now' : ''}">${word.replace(/</g, '&lt;')}</span>`).join(' ')
        }
      }
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [sound])

  const startSound = async (): Promise<void> => {
    if (deckRef.current) { await deckRef.current.ctx.resume(); setSound('on'); return }
    setSound('loading')
    try {
      const deck = await Deck.start()
      deck.setRate(1)
      deckRef.current = deck
      setSound('on')
    } catch {
      setSound('off')
    }
  }
  const toggleSound = (): void => {
    if (sound === 'on') { void deckRef.current?.ctx.suspend(); setSound('off') }
    else void startSound()
  }

  const goTo = (i: number): void => {
    const stage = stageRef.current
    if (!stage) return
    const top = stage.getBoundingClientRect().top + window.scrollY + window.innerHeight * (0.6 + i) + 4
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(top, { duration: 1.2 })
    else window.scrollTo({ top, behavior: prefersReducedMotion() ? 'instant' : 'smooth' })
  }

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

  const spot = active >= 0 ? SPOTS[active] : null
  const [user, domain] = profile.email.split('@')

  return (
    <div className="al cy">
      <section className="cy-stage" ref={stageRef} style={{ '--spots': SPOTS.length, '--light': spot?.light ?? '#f2c14e' } as React.CSSProperties}>
        <span id="top" className="al-anchor" style={{ top: 0 }} />
        <span id="work" className="al-anchor" style={{ top: '60svh' }} />
        <span id="drip" className="al-anchor" style={{ top: '360svh' }} />
        <div className="cy-sticky">
          <div className="cy-canvas">
            <React.Suspense fallback={null}><CypherScene members={SPOTS} rig={rig} active={live} /></React.Suspense>
          </div>

          <div className={`cy-intro ${active < 0 ? 'is-on' : ''}`}>
            <p className="cy-kick">Hip-hop · a cypher</p>
            <h1 className="cy-name">Arian Shamsabadi</h1>
            <p className="cy-line">Six projects stand in a circle. Scroll, and they take turns on the mic.</p>
            <div className="al-actions">
              <button type="button" className="is-solid" onClick={() => { void startSound().then(() => goTo(0)) }}>{sound === 'loading' ? 'Loading the beat…' : 'Drop the beat ▶ sound on'}</button>
              <button type="button" onClick={() => goTo(0)}>Watch it quiet</button>
            </div>
          </div>

          <ol className={`cy-list ${active >= 0 ? 'is-on' : ''}`} aria-label="Who's in the cypher">
            {SPOTS.map((s, i) => (
              <li key={s.id} className={active === i ? 'is-on' : ''}>
                <button type="button" onClick={() => goTo(i)}><i style={{ background: s.light }} />{s.name}</button>
              </li>
            ))}
          </ol>
          <button type="button" className={`cy-sound is-${sound}`} onClick={toggleSound}>{sound === 'on' ? 'Sound on' : sound === 'loading' ? 'Loading…' : 'Sound off'}</button>

          {spot ? (
            <>
              <div className="cy-verse" key={`v${active}`}>
                <p className="cy-mic">On the mic · <b>{spot.name}</b></p>
                <p className="cy-bars" ref={captionRef} aria-live="off" />
              </div>
              <div className="cy-card" key={`c${active}`}>
                <p className="cy-role">{spot.role}</p>
                <div className="al-actions">
                  {spot.client ? <button type="button" className="is-solid" onClick={() => setReading(spot.client!)}>The case study</button> : null}
                  {spot.play ? <button type="button" className="is-solid" onClick={() => setPlaying(true)}>Play the real network ♞</button> : null}
                  {spot.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}
                </div>
              </div>
            </>
          ) : null}
          {/* The full verse, for screen readers. */}
          <div className="cy-sr">{SPOTS.map((s) => <p key={s.id}><b>{s.name}.</b> {s.verse}</p>)}</div>
        </div>
      </section>

      <section className="al-playlist">
        <div>
          <p className="tag">after the cypher</p>
          <h2 className="chrome">Hustleholic</h2>
          <p>My playlist on Apple Music. Press play.</p>
        </div>
        <iframe title="Hustleholic on Apple Music" src={PLAYLIST} allow="autoplay *; encrypted-media *; clipboard-write" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" loading="lazy" />
      </section>

      <section className="al-artwork" id="posters">
        <header>
          <p className="tag">dig through it</p>
          <h2 className="chrome">The crate</h2>
          <p>My posters, filed as sleeves. Flip through, pull one out.</p>
        </header>
        <Crate posters={originals} onOpen={setViewing} />
      </section>

      {/* The end of the cypher: the mic comes round to you. */}
      <footer className="cy-end" id="contact">
        <div className="cy-end-main">
          <p className="tag">pass the mic</p>
          <h2 className="chrome cy-end-title">Your turn.</h2>
          <p className="cy-end-line">Have something that needs to exist? Write to me.</p>
          <a className="cy-end-mail" href={`mailto:${profile.email}`}>{user}@<wbr />{domain}</a>
          <div className="al-actions">
            <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp ↗</a>
            <a href={profile.telegram} target="_blank" rel="noreferrer">Telegram ↗</a>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={profile.studio} target="_blank" rel="noreferrer">Real Co. ↗</a>
          </div>
        </div>
        <div className="cy-end-base">
          <span>© 2026 Real Co. · Istanbul</span>
          <span>Designed and built by Arian Shamsabadi</span>
          <button type="button" onClick={() => scrollToId('top')}>↺ Run it back</button>
        </div>
      </footer>

      {viewed ? (
        <div className="al-box" role="dialog" aria-modal="true" aria-label={viewed.title} onClick={() => setViewing(null)}>
          <figure onClick={(event) => event.stopPropagation()}>
            <img src={viewed.image} alt={viewed.title} />
            <figcaption><b>{viewed.title}</b>{viewed.description}</figcaption>
          </figure>
          <button type="button" className="al-box-close" onClick={() => setViewing(null)}>Close ×</button>
        </div>
      ) : null}
      {reading ? <CaseReader id={reading.id} title={reading.title} start={0} colours={reading.scene} onClose={() => setReading(null)} /> : null}
      {playing ? <KnightVisionBoard onClose={() => setPlaying(false)} /> : null}
    </div>
  )
}
