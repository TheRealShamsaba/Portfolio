import React from 'react'
import { Barcode, Handling } from '../Print'
import { gsap, prefersReducedMotion, scrollToId } from '../motion'
import { profile } from '../data'

const channels = [
  { icon: 'up' as const, label: 'Email', href: `mailto:${profile.email}` },
  { icon: 'care' as const, label: 'Telegram', href: profile.telegram },
  { icon: 'fragile' as const, label: 'WhatsApp', href: profile.whatsapp },
  { icon: 'dry' as const, label: 'GitHub', href: profile.github }
]

function IstanbulTime(): React.ReactElement {
  const format = React.useMemo(() => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', second: '2-digit' }), [])
  const [now, setNow] = React.useState(() => format.format(new Date()))
  React.useEffect(() => {
    const id = window.setInterval(() => setNow(format.format(new Date())), 1000)
    return () => window.clearInterval(id)
  }, [format])
  return <span>Istanbul {now}</span>
}

export default function Contact(): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.parcel', {
        y: 140, rotate: -6, duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: '.parcel', start: 'top 92%' }
      })
      gsap.from('.send-it', {
        yPercent: 50, opacity: 0, duration: 1.2, ease: 'expo.out',
        scrollTrigger: { trigger: '.send-it', start: 'top 90%' }
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  const copyEmail = (): void => {
    navigator.clipboard?.writeText(profile.email).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    }).catch(() => undefined)
  }

  return (
    <section className="contact" id="contact" ref={rootRef} data-scene="#8d95f3,#1a1e5c,#f7f4ff" data-title="Send it">
      <h2 className="send-it">Send it.</h2>
      <article className="parcel">
        <div className="parcel-row parcel-to">
          <span className="parcel-key">To:</span>
          <div>
            <p className="parcel-name">{profile.name} · Founder, Real Co.</p>
            <a className="parcel-address" href={`mailto:${profile.email}`} data-cursor="write">{profile.email.split('@')[0]}@<wbr />{profile.email.split('@')[1]}</a>
            <button type="button" className="parcel-copy" onClick={copyEmail}>{copied ? 'Copied ✓' : 'Copy address'}</button>
          </div>
        </div>
        <div className="parcel-row parcel-from">
          <span className="parcel-key">From:</span>
          <p>You, with something that needs to be built properly. Tell me what the business does and where it hurts. I’ll take it from there.</p>
        </div>
        <ul className="parcel-channels">
          {channels.map((channel) => (
            <li key={channel.label}>
              <a href={channel.href} target={channel.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" data-cursor="send">
                <Handling icon={channel.icon} />
                <span>{channel.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="parcel-foot">
          <Barcode code="REAL-CO-2026-AS" />
          <span className="stamp">Priority</span>
          <span className="parcel-warning">Designed and built in Istanbul.</span>
        </div>
      </article>

      <footer className="site-footer">
        <span>© 2026 {profile.name}</span>
        <IstanbulTime />
        <a href={profile.studio} target="_blank" rel="noreferrer">Real Co. ↗</a>
        <a href="#top" onClick={(event) => { event.preventDefault(); scrollToId('top') }} data-cursor="top">Back to top ↑</a>
      </footer>
    </section>
  )
}
