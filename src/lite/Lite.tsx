import React from 'react'
import { archive, clients, dripApp, knightvision, profile } from '../site/data'
import { switchView, type Choice } from '../view'
import './lite.css'

// The light version: the same site, made of stills instead of 3D. No WebGL, no
// animation libraries, two small fonts, and images that load only as you reach them.

const FONTS = 'https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Serif:ital@0;1&family=UnifrakturMaguntia&text=A.S.&display=swap'
const FONTS_MAIN = 'https://fonts.googleapis.com/css2?family=Anton&family=Instrument+Serif:ital@0;1&display=swap'

const built: Record<string, string[]> = {
  dgm: ['Catalogue by procedure', 'Training academy', 'Service requests', 'Persian + English'],
  delux: ['Persian · Turkish · English', 'RTL + LTR, one codebase', 'Listings & leads admin', 'WhatsApp close'],
  realco: ['Positioning', 'Design system', 'Project intake', 'English + Persian']
}

const posters: [string, string][] = [
  ['concept-greatness-and-honor', 'Greatness and Honor'],
  ['identity-be-the-man-you-want', 'Be the Man You Want'],
  ['concept-impermanence', 'Impermanence'],
  ['concept-perspective', 'Perspective']
]
// The full version's viewer holds every piece, the podcast covers included.
const originals = archive.length

// A board for the KnightVision card, drawn in markup: the Italian Game, knight on f3.
const BOARD: Record<number, string> = {
  0: '♜', 2: '♝', 3: '♛', 4: '♚', 5: '♝', 7: '♜', 8: '♟', 9: '♟', 10: '♟', 11: '♟', 13: '♟', 14: '♟', 15: '♟',
  18: '♞', 21: '♞', 28: '♟', 34: '♗', 36: '♙', 45: '♘',
  48: '♙', 49: '♙', 50: '♙', 51: '♙', 53: '♙', 54: '♙', 55: '♙', 56: '♖', 57: '♘', 58: '♗', 59: '♕', 60: '♔', 63: '♖'
}

const episodes: [string, string][] = [
  ['9iLwSkk9k6U', 'EP0.3 · Distractions'],
  ['tw4cTelvIQA', 'EP0.2 · Why brutal honesty sets you free'],
  ['7Vks-qv7RjY', 'EP0.1 · Friendship and being alone'],
  ['mESzKmGGksA', 'EP10 · Rome, Mafia & Good Boy']
]

function useFonts(): void {
  React.useEffect(() => {
    for (const href of [FONTS_MAIN, FONTS]) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      document.head.appendChild(link)
    }
  }, [])
}

export default function Lite({ choice }: { choice: Choice }): React.ReactElement {
  useFonts()
  const [user, domain] = profile.email.split('@')
  return (
    <div className="lt">
      <header className="lt-top">
        <span className="lt-mark">A.S.</span>
        <nav>
          <a href="#work" className="lt-hide-s">Work</a>
          <a href="#drip" className="lt-hide-s">Drip</a>
          <button type="button" onClick={() => switchView('full')}>Full version</button>
          <a href="#contact" className="lt-talk">Write to me</a>
        </nav>
      </header>

      {choice.auto ? (
        <p className="lt-note">Light version, because {choice.reason}. Same site, fraction of the size. <button type="button" onClick={() => switchView('full')}>Load the full one</button></p>
      ) : null}

      <section className="lt-hero">
        <h1 className="lt-sr">Arian Shamsabadi</h1>
        <picture>
          <source media="(max-width: 720px)" srcSet="/lite/hero-m.webp" />
          <img src="/lite/hero.webp" alt="Arian, in blackletter, with clay models of a basketball, a chess knight, an iPod and a toy F1 car in front" width="1160" height="490" />
        </picture>
        <div className="lt-hero-foot">
          <p>Engineer and founder of Real Co. I design and build software for companies in Turkey and Iran, and a few products of my own.</p>
          <p className="lt-hint">Things from my shelves.</p>
        </div>
      </section>

      <section className="lt-studio">
        <picture>
          <source media="(max-width: 720px)" srcSet="/lite/studio-m.webp" />
          <img src="/lite/studio.webp" alt="My studio in Istanbul at night: desk and monitor, a chess table by the window, a mosque on the skyline" loading="lazy" width="1400" height="900" />
        </picture>
        <div className="lt-studio-copy">
          <p className="lt-kicker">The studio · Istanbul, after dark</p>
          <h2>Come in,<br /><em>look around.</em></h2>
          <button type="button" className="lt-pill" onClick={() => switchView('full')}>Walk around it in 3D →</button>
        </div>
      </section>

      <section className="lt-manifesto">
        <p className="lt-kicker">Arian Shamsabadi · Istanbul</p>
        <p className="lt-big">I turn <em>unclear</em> ideas into working systems. <em>Designed</em> properly, <em>built</em> properly, and looked after <em>when they’re live.</em></p>
      </section>

      <section className="lt-work" id="work">
        <header className="lt-work-head">
          <p className="lt-kicker">Selected work · 2025–26</p>
          <h2>On the <em>record.</em></h2>
        </header>
        {clients.map((client, i) => (
          <article key={client.id} className="lt-case" style={{ '--c-bg': client.scene.bg, '--c-fg': client.scene.fg, '--c-accent': client.scene.accent } as React.CSSProperties}>
            <div className="lt-case-copy">
              <p className="lt-count"><span>{String(i + 1).padStart(2, '0')}</span> / 03 — {client.place}</p>
              <h3>{client.title}</h3>
              <p className="lt-line">{client.line}</p>
              <p className="lt-story">{client.story}</p>
              <ul className="lt-chips">{built[client.id]?.map((item) => <li key={item}>{item}</li>)}</ul>
              <a className="lt-visit" href={client.url} target="_blank" rel="noreferrer">Visit {client.host} ↗</a>
            </div>
            <a className="lt-window" href={client.url} target="_blank" rel="noreferrer" aria-label={`Visit ${client.host}`}>
              <span className="lt-bar"><i /><i /><i /><span>{client.host}</span></span>
              <img src={`/lite/${client.id}.webp`} alt={`${client.title} website`} loading="lazy" width="640" height="422" />
            </a>
          </article>
        ))}
      </section>

      <section className="lt-drip" id="drip">
        <div className="lt-drip-copy">
          <p className="lt-kicker is-red">My own product · private beta</p>
          <h2>Drip</h2>
          <p className="lt-line is-red">Does this outfit work? One photo, one honest answer.</p>
          <ol>
            {dripApp.chapters.map((chapter, i) => (
              <li key={chapter.label}><span>0{i + 1}</span><b>{chapter.title}</b><p>{chapter.text}</p></li>
            ))}
          </ol>
          <a className="lt-pill is-dark" href={dripApp.url} target="_blank" rel="noreferrer">Join the waitlist ↗</a>
        </div>
        <div className="lt-phone"><img src="/lite/drip.webp" alt="Drip's verdict screen" loading="lazy" width="280" height="595" /></div>
      </section>

      <section className="lt-posters">
        <h2>The <em>poster</em> collection</h2>
        <p>I make these for fun, because I like art. One idea, said loudly, in type and contrast.</p>
        <ul>
          {posters.map(([id, title]) => (
            <li key={id}><img src={`/lite/${id}.webp`} alt={title} loading="lazy" /><span>{title}</span></li>
          ))}
        </ul>
        <button type="button" className="lt-pill is-light" onClick={() => switchView('full')}>See all {originals} in the full version →</button>
      </section>

      <section className="lt-offclock">
        <p className="lt-kicker">Off the clock</p>
        <div className="lt-offclock-grid">
          <article>
            <div className="lt-board" aria-hidden="true">
              {Array.from({ length: 64 }, (_, i) => <i key={i} className={(i % 8 + Math.floor(i / 8)) % 2 ? 'is-dark' : ''}>{BOARD[i] ? `${BOARD[i]}\uFE0E` : ''}</i>)}
            </div>
            <h3>{knightvision.title}</h3>
            <p>{knightvision.story}</p>
            <p className="lt-facts">{knightvision.facts}</p>
            <p className="lt-links-row"><a href={knightvision.url} target="_blank" rel="noreferrer">The repo ↗</a><button type="button" onClick={() => switchView('full')}>Play it (full version) ♞</button></p>
          </article>
          <article>
            <img src="/lite/show.webp" alt="Arian on The Reasonable Show" loading="lazy" width="640" height="400" />
            <h3>The Reasonable Show</h3>
            <ul>
              {episodes.map(([id, title]) => <li key={id}><a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noreferrer">{title} ↗</a></li>)}
            </ul>
          </article>
        </div>
      </section>

      <footer className="lt-foot" id="contact">
        <p className="lt-kicker">Have something that needs to exist?</p>
        <a className="lt-huge" href={`mailto:${profile.email}`}>Let’s <em>build</em> it.</a>
        <div className="lt-foot-row">
          <a className="lt-mail" href={`mailto:${profile.email}`}>{user}@<wbr />{domain}</a>
          <nav>
            <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={profile.telegram} target="_blank" rel="noreferrer">Telegram</a>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={profile.studio} target="_blank" rel="noreferrer">Real Co.</a>
          </nav>
        </div>
        <div className="lt-base">
          <span>© 2026 {profile.name} · Istanbul</span>
          <button type="button" onClick={() => switchView('full')}>Full version, with the 3D studio →</button>
        </div>
      </footer>
    </div>
  )
}
