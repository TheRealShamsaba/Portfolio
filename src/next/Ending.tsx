import React from 'react'
import ChessBoard from '../site/ChessBoard'
import { KnightVisionBoard } from './KnightVisionBoard'
import { knightvision, medium, profile, show } from '../site/data'
import { switchView } from '../view'

// Off the clock, then the sign-off: one huge line in the accent colour and every way to reach me.

function IstanbulTime(): React.ReactElement {
  const format = React.useMemo(() => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' }), [])
  const [now, setNow] = React.useState(() => format.format(new Date()))
  React.useEffect(() => {
    const id = window.setInterval(() => setNow(format.format(new Date())), 10000)
    return () => window.clearInterval(id)
  }, [format])
  return <span>Istanbul · {now}</span>
}

export default function Ending(): React.ReactElement {
  const [copied, setCopied] = React.useState(false)
  const [playing, setPlaying] = React.useState(false)
  const copy = (): void => {
    navigator.clipboard?.writeText(profile.email).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    }).catch(() => undefined)
  }

  return (
    <>
      <section className="no" id="off-the-clock">
        <p className="nx-kicker">Off the clock</p>
        <div className="no-grid">
          <button type="button" className="no-card" onClick={() => setPlaying(true)}>
            <span className="no-media chapter-media-board"><ChessBoard /></span>
            <span className="no-meta"><b>{knightvision.title}</b><span>My chess AI, with BakerDmo. Play the real network →</span></span>
            <span className="no-arrow">♞</span>
          </button>
          <a className="no-card" href={show.url} target="_blank" rel="noreferrer">
            <span className="no-media"><img src={medium(show.image)} alt="Arian on The Reasonable Show" loading="lazy" /></span>
            <span className="no-meta"><b>{show.title}</b><span>Talk show on technology, culture and business</span></span>
            <span className="no-arrow">↗</span>
          </a>
        </div>
        {playing ? <KnightVisionBoard onClose={() => setPlaying(false)} /> : null}
      </section>

      <footer className="nf" id="contact">
        <p className="nx-kicker">Have something that needs to exist?</p>
        <a className="nf-big" href={`mailto:${profile.email}`} data-cursor="write"><span>Let’s</span> <em>build</em> <span>it.</span></a>
        <div className="nf-row">
          <button type="button" className="nf-mail" onClick={copy}>{copied ? 'Copied ✓' : profile.email}</button>
          <nav className="nf-links">
            <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={profile.telegram} target="_blank" rel="noreferrer">Telegram</a>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={profile.studio} target="_blank" rel="noreferrer">Real Co.</a>
          </nav>
        </div>
        <div className="nf-base">
          <span>© 2026 {profile.name}</span>
          <IstanbulTime />
          <span>English · فارسی · Türkçe</span>
          <button type="button" className="nf-lite" onClick={() => switchView('lite')}>Light version for slow connections</button>
        </div>
      </footer>
    </>
  )
}
