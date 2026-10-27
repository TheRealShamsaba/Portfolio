import React from 'react'
import { archive, clients, dripApp, knightvision, profile, show } from '../site/data'
import { switchView, type Choice } from '../view'
import './lite.css'

// The light version: a proper portfolio for slow connections, Data Saver and older
// phones. One page of rooms, each in its own colours, the way the first site told it.
// No 3D, no animation libraries, two small fonts, and every image waits until you
// reach it.

const FONTS = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=UnifrakturMaguntia&display=swap'

const ROMAN = ['I', 'II', 'III', 'IV', 'V']

const programme: { id: string; title: string; kind: string; year: string }[] = [
  { id: 'dgm', title: 'Darman Gostar Miad', kind: 'Medical equipment platform', year: '2026' },
  { id: 'delux', title: 'Delux Grup', kind: 'Multilingual sales platform', year: '2026' },
  { id: 'realco', title: 'Real Co.', kind: 'Studio website', year: '2026' },
  { id: 'drip', title: 'Drip', kind: 'iOS app, in private beta', year: 'In progress' },
  { id: 'knightvision', title: 'KnightVision', kind: 'Chess network, graduation project', year: '2025' }
]

const letter = [
  'You talk to the person designing and building it. Nothing gets lost between a salesperson and a developer.',
  'Every week you get a link to the working product, and you open it on your own phone.',
  'I write code the next engineer can read, and I document the parts that matter.',
  'Websites, web and mobile apps, internal tools, and AI features that take repetitive work off your staff. In English, Persian or Turkish.',
  'After launch I stay on it. Fixes, changes, the next version.'
]

const episodes: [string, string][] = [
  ['9iLwSkk9k6U', 'EP0.3 · Distractions'],
  ['tw4cTelvIQA', 'EP0.2 · Why brutal honesty sets you free'],
  ['7Vks-qv7RjY', 'EP0.1 · Friendship and being alone'],
  ['mESzKmGGksA', 'EP10 · Rome, Mafia & Good Boy']
]

// A board for KnightVision, drawn in markup: the Italian Game, knight on f3.
const BOARD: Record<number, string> = {
  0: '♜', 2: '♝', 3: '♛', 4: '♚', 5: '♝', 7: '♜', 8: '♟', 9: '♟', 10: '♟', 11: '♟', 13: '♟', 14: '♟', 15: '♟',
  18: '♞', 21: '♞', 28: '♟', 34: '♗', 36: '♙', 45: '♘',
  48: '♙', 49: '♙', 50: '♙', 51: '♙', 53: '♙', 54: '♙', 55: '♙', 56: '♖', 57: '♘', 58: '♗', 59: '♕', 60: '♔', 63: '♖'
}

const LINKS: [string, string][] = [['work', 'Work'], ['drip', 'Drip'], ['posters', 'Posters'], ['contact', 'Contact']]

const thumb = (image: string): string => image.replace('/posters/', '/lite/posters/')

function useFonts(): void {
  React.useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONTS
    document.head.appendChild(link)
  }, [])
}

// One observer for the whole page: it names the room you're in, in the header, and
// lets each block rise in as it arrives.
function useRooms(): string {
  const [room, setRoom] = React.useState('Arian Shamsabadi')
  React.useEffect(() => {
    const rooms = Array.from(document.querySelectorAll<HTMLElement>('[data-room]'))
    const roomWatch = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) setRoom((entry.target as HTMLElement).dataset.room ?? '')
    }, { rootMargin: '-45% 0px -54% 0px' })
    rooms.forEach((element) => roomWatch.observe(element))
    const rise = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        rise.unobserve(entry.target)
      }
    }, { rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll('.lt-rise').forEach((element) => rise.observe(element))
    return () => { roomWatch.disconnect(); rise.disconnect() }
  }, [])
  return room
}

function IstanbulTime(): React.ReactElement {
  const format = React.useMemo(() => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' }), [])
  const [now, setNow] = React.useState(() => format.format(new Date()))
  React.useEffect(() => {
    const id = window.setInterval(() => setNow(format.format(new Date())), 15000)
    return () => window.clearInterval(id)
  }, [format])
  return <span>Istanbul, {now}</span>
}

function Header({ room }: { room: string }): React.ReactElement {
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent): void => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])
  return (
    <header className={`lt-top ${open ? 'is-open' : ''}`}>
      <a className="lt-mark" href="#top" aria-label={`${profile.name}, back to the top`} onClick={() => setOpen(false)}>A.S.</a>
      <p className="lt-room" aria-live="polite">{room}</p>
      <nav className="lt-links" aria-label="Sections">
        {LINKS.slice(0, 3).map(([id, name]) => <a key={id} href={`#${id}`}>{name}</a>)}
        <button type="button" onClick={() => switchView('full')}>Full version</button>
        <a className="lt-talk" href="#contact">Write to me</a>
      </nav>
      <button type="button" className="lt-menu" aria-expanded={open} aria-controls="lt-sheet" onClick={() => setOpen((value) => !value)}>
        {open ? 'Close' : 'Menu'}<span aria-hidden="true"><i /><i /></span>
      </button>
      <div id="lt-sheet" className="lt-sheet" {...(open ? {} : ({ inert: '' } as object))}>
        {LINKS.map(([id, name], i) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}><small>0{i + 1}</small>{name}</a>)}
        <button type="button" onClick={() => switchView('full')}>Full version, with the 3D studio →</button>
      </div>
    </header>
  )
}

export default function Lite({ choice }: { choice: Choice }): React.ReactElement {
  useFonts()
  React.useEffect(() => { document.documentElement.style.removeProperty('background') }, [])
  const room = useRooms()
  const [copied, setCopied] = React.useState(false)
  const [user, domain] = profile.email.split('@')
  const copy = (): void => {
    navigator.clipboard?.writeText(profile.email).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    }).catch(() => undefined)
  }

  return (
    <div className="lt">
      <Header room={room} />

      {choice.auto ? (
        <p className="lt-note">Light version, because {choice.reason}. Same work, a fraction of the size. <button type="button" onClick={() => switchView('full')}>Load the full one</button></p>
      ) : null}

      <main>
        {/* ── Opening ── */}
        <section className="lt-open" id="top" data-room="Arian Shamsabadi">
          <div className="lt-open-copy">
            <p className="lt-place">Istanbul</p>
            <h1 className="lt-name"><span>Arian</span> <span>Shamsabadi</span></h1>
            <p className="lt-intro">Engineer and founder of Real Co. I design and build software for companies in Turkey and Iran, and a few products of my own.</p>
            <a className="lt-cue" href="#work">Scroll</a>
          </div>
          <figure className="lt-open-photo">
            <img src={profile.portrait} alt="Arian Shamsabadi in Cappadocia" width="675" height="900" />
          </figure>
        </section>

        {/* ── What I do ── */}
        <section className="lt-statement" data-room="What I do">
          <p className="lt-statement-text lt-rise">
            Companies come to me with a <em>problem,</em> rarely a spec. A dealer losing buyers who can’t read Turkish. A medical supplier whose product data lives in brochures. I work out what actually needs to exist, then I build it <b>properly:</b> the interface people see, the system underneath, and the admin your team uses every day.
          </p>
          <p className="lt-statement-next lt-rise">What follows is some of that work, in the order I’d show it to you in person.</p>
        </section>

        {/* ── The programme ── */}
        <section className="lt-programme" id="work" data-room="Programme">
          <div className="lt-card lt-rise">
            <h2 className="lt-card-head">Selected work</h2>
            <p className="lt-card-sub">Five pieces and an intermission · about four minutes</p>
            <ol>
              {programme.map((work, i) => (
                <li key={work.id}>
                  <a href={`#${work.id}`}>
                    <span className="lt-no">{ROMAN[i]}</span>
                    <span className="lt-p-title">{work.title}<small>{work.kind}</small></span>
                    <span className="lt-year">{work.year}</span>
                  </a>
                </li>
              ))}
            </ol>
            <p className="lt-card-foot">Then a note on working together, and some posters from before.</p>
          </div>
        </section>

        {/* ── The client chapters, each in its own colours ── */}
        {clients.map((client, i) => (
          <section
            key={client.id} id={client.id} className="lt-chapter" data-room={client.title}
            style={{ '--bg': client.scene.bg, '--fg': client.scene.fg, '--ac': client.scene.accent } as React.CSSProperties}
          >
            <header className="lt-chapter-head lt-rise">
              <p className="lt-chapter-no">{ROMAN[i]} <span>/ Selected work</span></p>
              <h2>{client.title}</h2>
              <p className="lt-chapter-line">{client.line}</p>
            </header>
            <div className="lt-chapter-body">
              <a className="lt-window lt-rise" href={client.url} target="_blank" rel="noreferrer" aria-label={`Visit ${client.host}`}>
                <span className="lt-bar"><i /><i /><i /><span>{client.host}</span></span>
                <img src={`/lite/${client.id}.webp`} alt={`${client.title} website`} loading="lazy" decoding="async" width="640" height="422" />
              </a>
              <div className="lt-chapter-copy lt-rise">
                <p className="lt-chapter-place">{client.place}</p>
                <p>{client.story}</p>
                <ul className="lt-facts">{client.facts.split(' · ').map((fact) => <li key={fact}>{fact}</li>)}</ul>
                <a className="lt-visit" href={client.url} target="_blank" rel="noreferrer">{client.host} ↗</a>
              </div>
            </div>
          </section>
        ))}

        {/* ── Drip ── */}
        <section className="lt-drip" id="drip" data-room="Drip">
          <header className="lt-drip-head lt-rise">
            <p className="lt-chapter-no">IV <span>/ My own product, an iOS app in private beta</span></p>
            <img className="lt-drip-mark" src={dripApp.wordmark} alt="Drip" loading="lazy" width="240" height="131" />
            <h2>{dripApp.question}</h2>
            <p className="lt-drip-answer">{dripApp.answer}</p>
          </header>
          <ol className="lt-drip-steps">
            {dripApp.chapters.map((chapter, i) => (
              <li key={chapter.label} className="lt-rise">
                <div className="lt-phone"><img src={chapter.screen} alt={`Drip, ${chapter.label.toLowerCase()}`} loading="lazy" decoding="async" width="600" height="1277" /></div>
                <p className="lt-step-label"><span>0{i + 1}</span> {chapter.label}</p>
                <h3>{chapter.title}</h3>
                <p>{chapter.text}</p>
              </li>
            ))}
          </ol>
          <a className="lt-pill" href={dripApp.url} target="_blank" rel="noreferrer">Join the waitlist ↗</a>
        </section>

        {/* ── KnightVision ── */}
        <section
          className="lt-chapter is-kv" id="knightvision" data-room="KnightVision"
          style={{ '--bg': knightvision.scene.bg, '--fg': knightvision.scene.fg, '--ac': knightvision.scene.accent } as React.CSSProperties}
        >
          <header className="lt-chapter-head lt-rise">
            <p className="lt-chapter-no">V <span>/ {knightvision.place}</span></p>
            <h2>{knightvision.title}</h2>
            <p className="lt-chapter-line">{knightvision.line}</p>
          </header>
          <div className="lt-chapter-body">
            <div className="lt-board-wrap lt-rise">
              <div className="lt-board" role="img" aria-label="A chess board in the Italian Game, white knight on f3">
                {Array.from({ length: 64 }, (_, i) => <i key={i} className={(i % 8 + Math.floor(i / 8)) % 2 ? 'is-dark' : ''}>{BOARD[i] ? `${BOARD[i]}︎` : ''}</i>)}
              </div>
              <p className="lt-board-cap"><span>1. e4 e5 2. Nf3 Nc6 3. Bc4</span><span>The Italian Game</span></p>
            </div>
            <div className="lt-chapter-copy lt-rise">
              <p>{knightvision.story}</p>
              <ul className="lt-facts">{knightvision.facts.split(' · ').map((fact) => <li key={fact}>{fact}</li>)}</ul>
              <p className="lt-row">
                <a className="lt-visit" href={knightvision.url} target="_blank" rel="noreferrer">{knightvision.host} ↗</a>
                <a className="lt-visit" href={knightvision.repo} target="_blank" rel="noreferrer">The repo ↗</a>
                <button type="button" className="lt-visit" onClick={() => switchView('full')}>Play it in the full version ♞</button>
              </p>
            </div>
          </div>
        </section>

        {/* ── Intermission ── */}
        <section className="lt-show" id="show" data-room="Intermission">
          <p className="lt-show-k lt-rise">Intermission</p>
          <a className="lt-tv lt-rise" href={show.url} target="_blank" rel="noreferrer">
            <img src="/lite/show.webp" alt="Arian laughing on The Reasonable Show" loading="lazy" decoding="async" width="640" height="400" />
            <span className="lt-tv-bug" aria-hidden="true"><i />Rec · CH 03</span>
            <span className="lt-third" aria-hidden="true"><b>The Reasonable Show</b><span>Ideas tested out loud · with Arian Shamsabadi</span></span>
          </a>
          <div className="lt-show-copy lt-rise">
            <p>{show.text}</p>
            <ul>
              {episodes.map(([id, title]) => <li key={id}><a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer">{title} <span>↗</span></a></li>)}
            </ul>
          </div>
        </section>

        {/* ── A letter ── */}
        <section className="lt-letter" id="working-together" data-room="Working together">
          <div className="lt-sheet-paper lt-rise">
            <h2>If we work together</h2>
            {letter.map((line) => <p key={line}>{line}</p>)}
            <p className="lt-sign"><span>Arian</span><span>Istanbul, 2026</span></p>
          </div>
        </section>

        {/* ── Before the code ── */}
        <section className="lt-archive" id="posters" data-room="Before the code">
          <header className="lt-archive-head lt-rise">
            <h2>Before the code</h2>
            <p>I make posters for fun, because I like art. One idea, said loudly, in type and contrast. Tap any piece for a closer look.</p>
          </header>
          <p className="lt-archive-cue"><span>{archive.length} original pieces</span><span>Swipe ↔</span></p>
          <ul className="lt-reel">
            {archive.map((poster, i) => (
              <li key={poster.id} style={{ '--tilt': `${((i % 3) - 1) * 1.4}deg` } as React.CSSProperties}>
                <a href={poster.image} target="_blank" rel="noreferrer">
                  <img src={thumb(poster.image)} alt={poster.title} loading="lazy" decoding="async" width="420" height="594" />
                  <span>{poster.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ── An invitation to the full version ── */}
        <section className="lt-studio" data-room="The studio">
          <picture>
            <source media="(max-width: 720px)" srcSet="/lite/studio-m.webp" />
            <img src="/lite/studio.webp" alt="My studio in Istanbul at night: desk and monitor, a chess table by the window, a mosque on the skyline" loading="lazy" decoding="async" width="1400" height="900" />
          </picture>
          <div className="lt-studio-copy lt-rise">
            <p className="lt-kicker">The full version · Istanbul, after dark</p>
            <h2>Come in, <em>look around.</em></h2>
            <p>My studio in 3D, a live chess engine, posters you can push around and four moods. Best on Wi-Fi.</p>
            <button type="button" className="lt-pill" onClick={() => switchView('full')}>Open the full version →</button>
          </div>
        </section>

        {/* ── Send it ── */}
        <section className="lt-contact" id="contact" data-room="Send it">
          <h2 className="lt-send lt-rise">Send it.</h2>
          <article className="lt-parcel lt-rise">
            <div className="lt-parcel-row">
              <span className="lt-parcel-k">To:</span>
              <div>
                <p className="lt-parcel-name">{profile.name} · Founder, Real Co.</p>
                <a className="lt-parcel-mail" href={`mailto:${profile.email}`}>{user}@<wbr />{domain}</a>
                <button type="button" className="lt-copy" onClick={copy}>{copied ? 'Copied ✓' : 'Copy address'}</button>
              </div>
            </div>
            <div className="lt-parcel-row">
              <span className="lt-parcel-k">From:</span>
              <p>You, with something that needs to be built properly. Tell me what the business does and where it hurts. I’ll take it from there.</p>
            </div>
            <ul className="lt-channels">
              <li><a href={`mailto:${profile.email}`}>Email</a></li>
              <li><a href={profile.telegram} target="_blank" rel="noreferrer">Telegram</a></li>
              <li><a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></li>
              <li><a href={profile.github} target="_blank" rel="noreferrer">GitHub</a></li>
            </ul>
            <div className="lt-parcel-foot">
              <span className="lt-barcode" aria-hidden="true" />
              <span className="lt-stamp">Priority</span>
              <span>Designed and built in Istanbul.</span>
            </div>
          </article>
          <footer className="lt-foot">
            <span>© 2026 {profile.name}</span>
            <IstanbulTime />
            <a href={profile.studio} target="_blank" rel="noreferrer">Real Co. ↗</a>
            <a href="#top">Back to top ↑</a>
          </footer>
        </section>
      </main>
    </div>
  )
}
