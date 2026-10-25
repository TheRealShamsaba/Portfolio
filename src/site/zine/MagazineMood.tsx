import React from 'react'
import { Barcode } from '../Print'
import { gsap, prefersReducedMotion, scrollToId } from '../motion'
import { clients, dripApp, knightvision, profile, show } from '../data'

// Hip-hop: the work as an issue of a 90s rap magazine. Cover, contents, the cover
// story, who's next, a full-page ad, reviews, shout-outs and a subscription card.

const contents: [string, string, string][] = [
  ['014', 'Arian, in progress', 'mg-story'],
  ['032', 'Who’s Next', 'mg-next'],
  ['048', 'Drip', 'mg-ad'],
  ['056', 'Side projects', 'mg-reviews'],
  ['064', 'Shout Outs', 'mg-shouts']
]

const interview: [string, string][] = [
  ['What do you do?', 'At Real Co., I handle the design, the code and the work after launch.'],
  ['Where’s the work?', 'Turkey and Iran. English, Persian and Turkish, in the same product.'],
  ['And Drip?', 'An outfit check for your own closet. The app I’m building for myself.']
]

const vitals: [string, string][] = [
  ['Base', 'Istanbul'],
  ['Runs', 'Real Co.'],
  ['Building', 'Drip']
]

const next = [
  { ...clients[0], kicker: 'Medical', line: 'Find the laser by the surgery, not the brochure.' },
  { ...clients[1], kicker: 'Automotive', line: 'Three languages, one codebase, every deal closes on WhatsApp.' },
  { ...clients[2], kicker: 'Studio', line: 'Design, build and look after it. One team.' }
]

const reviews = [
  { title: knightvision.title, kind: 'Research build', text: 'A chess engine that learns by playing itself. Policy net proposes, value net judges, Stockfish referees. An experiment in training a model and evaluating the moves it makes.', url: knightvision.url, cta: 'Open the repo' },
  { title: 'The Reasonable Show', kind: 'Talk show', text: show.text, url: show.url, cta: 'Watch an episode' }
]

const subscribe: [string, string][] = [
  ['I have a project', 'A project for Real Co.'],
  ['I want Drip early', 'Drip early access'],
  ['Just saying hi', 'Hi Arian']
]

export default function MagazineMood({ onExit }: { onExit: () => void }): React.ReactElement {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [reading, setReading] = React.useState('000 · THE COVER')

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let frame = 0
    const update = (): void => {
      frame = 0
      if (!window.matchMedia('(max-width: 860px)').matches) return
      const middle = window.innerHeight * 0.4
      const active = contents.find(([, , id]) => {
        const rect = root.querySelector(`#${id}`)?.getBoundingClientRect()
        return rect && rect.top <= middle && rect.bottom > middle
      })
      const toc = root.querySelector('#mg-toc')?.getBoundingClientRect()
      setReading(active ? `${active[0]} · ${active[1].toUpperCase()}` : toc && toc.top <= middle && toc.bottom > middle ? '000 · IN THIS ISSUE' : '000 · THE COVER')
      const rect = root.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight)))
      root.style.setProperty('--issue-progress', String(progress))
    }
    const schedule = (): void => { if (!frame) frame = requestAnimationFrame(update) }
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame) }
  }, [])

  React.useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const phone = window.matchMedia('(max-width: 860px)').matches
      // The cover hits the stand: photo settles, masthead drops, cover lines slam on.
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.mg-cover-photo', { scale: 1.18, duration: 2.2 })
        .from('.mg-mast-title span', { yPercent: -120, duration: 1.1, stagger: 0.07 }, 0.2)
        .from('.mg-cover .mg-line, .mg-banner, .mg-badge', { scale: phone ? 1 : 1.5, y: phone ? 14 : 0, opacity: 0, rotate: phone ? 0 : -4, duration: 0.7, stagger: 0.09, ease: phone ? 'power2.out' : 'back.out(1.8)' }, 0.6)
        .from('.mg-autograph', { clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'power2.inOut' }, 1.3)
      gsap.to('.mg-cover-photo', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.mg-cover', start: 'top top', end: 'bottom top', scrub: true } })

      gsap.from('.mg-toc li', { x: phone ? 0 : -60, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '.mg-toc', start: 'top 70%' } })


      gsap.utils.toArray<HTMLElement>('.mg-feature').forEach((feature) => {
        const print = feature.querySelector('.mg-feature-print')
        gsap.from(print, {
          clipPath: 'inset(0 0 100% 0)', duration: phone ? 1.2 : 0.65,
          ease: phone ? 'power3.inOut' : 'power2.out',
          scrollTrigger: { trigger: phone ? feature : print, start: phone ? 'top 75%' : 'top 95%', once: true }
        })
        if (phone) {
          gsap.fromTo(feature.querySelector('img'), { filter: 'grayscale(1) contrast(1.25)' }, {
            filter: 'grayscale(0) contrast(1)', ease: 'none',
            scrollTrigger: { trigger: feature.querySelector('.mg-feature-print'), start: 'top 90%', end: 'top 50%', scrub: 0.35 }
          })
          gsap.fromTo(feature.querySelector('img'), { objectPosition: '50% 0%' }, {
            objectPosition: '50% 35%', ease: 'none',
            scrollTrigger: { trigger: feature.querySelector('.mg-feature-print'), start: 'top 40%', end: 'bottom top+=100', scrub: 0.35 }
          })
        }
      })
      gsap.from('.mg-ad-sheet', { y: phone ? 24 : 120, rotate: phone ? 0 : 3, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.mg-ad', start: 'top 75%' } })
      gsap.from('.mg-ad-phone', { y: phone ? 24 : 80, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: '.mg-ad-phones', start: 'top 90%', once: true } })
      if (phone) gsap.from('.mg-story-photo img', { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power2.inOut', scrollTrigger: { trigger: '.mg-story-photo', start: 'top 85%', once: true } })

    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div className="magazine" ref={rootRef}>
      <h1 className="sr-only">REAL — Arian Shamsabadi’s portfolio, the magazine edition</h1>
      <section className="mg-cover" id="top">
        <img className="mg-cover-photo" src={profile.portrait} alt="Arian Shamsabadi on the cover" />
        <header className="mg-mast">
          <span className="mg-mast-title" aria-label="Real">{'REAL'.split('').map((letter, i) => <span key={i}>{letter}</span>)}</span>
          <span className="mg-mast-tag">Code · Culture · Product</span>
          <span className="mg-mast-issue">No. 26 · Oct 2026 · $3.95</span>
        </header>
        <p className="mg-banner">The code issue</p>
        <div className="mg-lines is-left">
          <p className="mg-line is-hero"><b>Arian, in progress</b><span>Client work in Tehran and Istanbul. A studio, a chess engine, and an app of his own.</span></p>
          <p className="mg-line is-red"><em>Exclusive</em> Inside Drip, the AI stylist</p>
        </div>
        <div className="mg-lines is-right">
          <p className="mg-line"><b>Tehran → Istanbul</b>3 sites. 3 languages. 1 team.</p>
          <p className="mg-line is-yellow"><b>Plus</b>The chess engine that learns by beating itself</p>
        </div>
        <span className="mg-autograph">Arian S.</span>
        <span className="mg-badge">Collector’s<br />issue</span>
        <div className="mg-barcode"><Barcode code="REAL-26" /><small>0 26 · 74470 · 2026</small></div>
      </section>

      <section className="mg-toc-wrap" id="mg-toc">
        <p className="mg-section">In this issue</p>
        <ol className="mg-toc">
          {contents.map(([page, title, id]) => (
            <li key={id}>
              <button type="button" onClick={() => scrollToId(id)} data-cursor="read">
                <span className="mg-toc-page">{page}</span>
                <span className="mg-toc-title">{title}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <article className="mg-story" id="mg-story">
        <header className="mg-story-head">
          <p className="mg-section">Cover story</p>
          <h2 className="mg-headline"><span>Arian,</span><span>in progress</span></h2>
          <p className="mg-deck">I run Real Co. in Istanbul. Websites for clients, Drip for myself.</p>
          <p className="mg-byline">Words & build: Arian Shamsabadi · Photo: Cappadocia</p>
        </header>
        <figure className="mg-story-photo">
          <img src={profile.portrait} alt="Arian in Cappadocia" loading="lazy" />
          <figcaption>Away from the desk. Cappadocia, Turkey.</figcaption>
        </figure>
        <ol className="mg-story-body" aria-label="Three quick answers">
          {interview.map(([question, answer], i) => (
            <li className="mg-qa" key={question}>
              <span className="mg-qa-no" aria-hidden="true">0{i + 1}</span>
              <div>
                <h3 className="mg-q">{question}</h3>
                <p className="mg-a">{answer}</p>
              </div>
            </li>
          ))}
        </ol>
        <aside className="mg-vitals">
          <p className="mg-vitals-title">At a glance</p>
          <dl>{vitals.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </aside>
      </article>

      <section className="mg-next" id="mg-next">
        <header className="mg-next-head">
          <p className="mg-section">Who’s next</p>
          <h2 className="mg-headline is-small"><span>Three sites</span><span>on heavy rotation</span></h2>
        </header>
        {next.map((site, i) => (
          <article className="mg-feature" key={site.id}>
            <span className="mg-feature-no">{String(i + 1).padStart(2, '0')}</span>
            <a className="mg-feature-print" href={site.url} target="_blank" rel="noreferrer" data-cursor="visit">
              <img src={site.image} alt={`${site.title} website`} loading="lazy" />
            </a>
            <div className="mg-feature-copy">
              <p className="mg-kicker">{site.kicker} · {site.place.split(' · ')[0]}</p>
              <h3>{site.title}</h3>
              <p className="mg-feature-line">{site.line}</p>
              <p>{site.story}</p>
              <p className="mg-feature-facts">{site.facts}</p>
              <a className="mg-more" href={site.url} target="_blank" rel="noreferrer">{site.host} ↗</a>
            </div>
          </article>
        ))}
      </section>

      <section className="mg-ad" id="mg-ad">
        <div className="mg-ad-sheet">
          <div className="mg-ad-title">
            <h2 className="mg-ad-hook"><span>Does this</span><span>work?</span></h2>
          </div>
          <div className="mg-ad-phones">
            <img className="mg-ad-phone" src={dripApp.chapters[0].screen} alt="Drip camera screen" loading="lazy" />
            <img className="mg-ad-phone" src={dripApp.chapters[1].screen} alt="Drip verdict screen" loading="lazy" />
          </div>
          <div className="mg-ad-foot">
            <img className="mg-ad-logo" src={dripApp.wordmark} alt="Drip" loading="lazy" />
            <p>Check your fit before you leave the house. One photo, one honest answer, every swap from your own closet.</p>
            <a className="mg-ad-cta" href={dripApp.url} target="_blank" rel="noreferrer" data-cursor="join">Join the waitlist ↗</a>
          </div>
          <p className="mg-ad-small">Now in private beta. iOS and web. Drip will not tell you it looks good if it doesn’t.</p>
        </div>
      </section>

      <section className="mg-reviews" id="mg-reviews">
        <header>
          <p className="mg-section">Side projects</p>
          <p className="mg-reviews-note">Research at the keyboard. Conversations away from it.</p>
        </header>
        {reviews.map((review) => (
          <article className="mg-review" key={review.title}>
            <div>
              <p className="mg-kicker">{review.kind}</p>
              <h3>{review.title}</h3>
            </div>
            <p>{review.text}</p>
            <a className="mg-more" href={review.url} target="_blank" rel="noreferrer">{review.cta} ↗</a>
          </article>
        ))}
      </section>

      <section className="mg-shouts" id="mg-shouts">
        <div className="mg-shouts-copy">
          <p className="mg-section">Shout outs</p>
          <p className="mg-shouts-text">To the clients in Tehran and Istanbul who trusted us with the work. To the Real Co. team. To the guests who come on The Reasonable Show. And to the people trying Drip while it’s still taking shape.</p>
          <div className="mg-links">
            <a href={profile.telegram} target="_blank" rel="noreferrer">Telegram</a>
            <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            <button type="button" onClick={onExit}>Back to normal ↑</button>
          </div>
        </div>
        <div className="mg-card">
          <span className="mg-card-cut" aria-hidden="true">✂</span>
          <p className="mg-card-title">Write<br /><small>to Arian</small></p>
          <ul>
            {subscribe.map(([label, subject]) => (
              <li key={label}><a href={`mailto:${profile.email}?subject=${encodeURIComponent(subject)}`} data-cursor="write"><i aria-hidden="true" />{label}</a></li>
            ))}
          </ul>
          <a className="mg-card-mail" href={`mailto:${profile.email}`}>{profile.email.split('@')[0]}@<wbr />{profile.email.split('@')[1]}</a>
          <p className="mg-card-small">Tell me a little about what you have in mind.</p>
        </div>
      </section>

      <nav className={`mg-reading ${reading === '000 · THE COVER' ? 'is-cover' : ''}`} aria-label="Magazine reading position">
        <span className="mg-reading-fill" aria-hidden="true" />
        <span>{reading}</span>
        <button type="button" onClick={() => scrollToId('mg-toc')}>INDEX ↑</button>
      </nav>
    </div>
  )
}
