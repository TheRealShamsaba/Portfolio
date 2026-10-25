import React from 'react'
import { gsap, prefersReducedMotion, scrollToId } from '../motion'
import { clients, dripApp, knightvision, profile, show } from '../data'

// An independent portfolio LP: album artwork, a track list and the liner notes.

const contents: [string, string, string][] = [
  ['01', 'The introduction', 'mg-story'],
  ['02', 'On heavy rotation', 'mg-next'],
  ['03', 'Drip — the solo project', 'mg-ad'],
  ['04', 'The B-sides', 'mg-reviews'],
  ['05', 'Credits & connections', 'mg-shouts']
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

const readChapter = (id: string): void => scrollToId(id, window.innerWidth <= 860 ? 80 : 96)

export default function MagazineMood({ onExit }: { onExit: () => void }): React.ReactElement {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [reading, setReading] = React.useState(-1)

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    let frame = 0
    const update = (): void => {
      frame = 0
      const middle = window.innerHeight * 0.4
      const active = contents.findIndex(([, , id]) => {
        const rect = root.querySelector(`#${id}`)?.getBoundingClientRect()
        return rect && rect.top <= middle && rect.bottom > middle
      })
      const toc = root.querySelector('#mg-toc')?.getBoundingClientRect()
      setReading(active >= 0 ? active : toc && toc.top <= middle ? 0 : -1)
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
    const media = gsap.matchMedia()
    media.add({ phone: '(max-width: 860px)', desktop: '(min-width: 861px)' }, (context) => {
      const phone = Boolean(context.conditions?.phone)
      const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.mg-album-art', { y: 28, opacity: 0, duration: 1.1 })
        .from('.mg-cover-photo', { scale: 1.08, duration: 1.8 }, 0)
        .from('.mg-art-title', { xPercent: -18, opacity: 0, duration: 1.2, ease: 'expo.out' }, .15)
        .from('.mg-album-copy > *', { y: 18, opacity: 0, duration: .8, stagger: .07 }, .2)
      gsap.to('.mg-cover-photo', { yPercent: 5, ease: 'none', scrollTrigger: { trigger: '.mg-cover', start: 'top top', end: 'bottom top', scrub: true } })
      gsap.to('.mg-session-track', { xPercent: -16, ease: 'none', scrollTrigger: { trigger: '.mg-session-strip', start: 'top bottom', end: 'bottom top', scrub: .5 } })

      gsap.from('.mg-toc li', { x: phone ? 0 : -60, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.07, scrollTrigger: { trigger: '.mg-toc', start: 'top 70%' } })


      gsap.utils.toArray<HTMLElement>('.mg-feature').forEach((feature) => {
        const print = feature.querySelector('.mg-feature-print')
        gsap.from(print, {
          clipPath: 'inset(0 0 100% 0)', duration: phone ? 1.2 : 0.65,
          ease: phone ? 'power3.inOut' : 'power2.out',
          scrollTrigger: { trigger: phone ? feature : print, start: 'top 95%', once: true }
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
      gsap.from('.mg-ad-sheet', { y: phone ? 24 : 60, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.mg-ad', start: 'top 75%' } })
      gsap.from('.mg-ad-phone', { y: phone ? 24 : 80, opacity: 0, duration: 0.8, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: '.mg-ad-phones', start: 'top 90%', once: true } })
      if (phone) gsap.from('.mg-story-photo img', { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'power2.inOut', scrollTrigger: { trigger: '.mg-story-photo', start: 'top 85%', once: true } })

      }, root)
      return () => ctx.revert()
    })
    return () => media.revert()
  }, [])

  return (
    <div className="magazine" ref={rootRef}>
      <section className="mg-cover" id="top">
        <div className="mg-cover-topline"><span>REAL. RECORDS</span><span>INDEPENDENT WORK · VOL. 026</span></div>
        <div className="mg-album-art">
          <img className="mg-cover-photo" src={profile.portrait} alt="Arian Shamsabadi in Cappadocia" />
          <span className="mg-art-title" aria-hidden="true">REAL.</span>
          <span className="mg-art-credit">Arian Shamsabadi<br />The portfolio LP / 2026</span>
          <span className="mg-art-catalogue" aria-hidden="true">AS—026</span>
        </div>
        <div className="mg-album-copy">
          <p className="mg-kicker">The Hip-hop edition</p>
          <h1>Arian,<br />in progress.</h1>
          <p className="mg-artist">Arian Shamsabadi</p>
          <p className="mg-album-deck">Design. Code. Culture.<br />A body of work, with a few B‑sides.</p>
          <p className="mg-album-meta">Istanbul · 2026 · 5 chapters</p>
          <div className="mg-album-actions">
            <button type="button" className="mg-start" onClick={() => readChapter('mg-story')}>Explore the album <span aria-hidden="true">↓</span></button>
            <button type="button" className="mg-track-button" onClick={() => readChapter('mg-toc')}>Track list</button>
          </div>
          <p className="mg-album-note">Written, designed & built by Arian.<br />Client releases. Personal experiments. Still recording.</p>
        </div>
      </section>

      <section className="mg-toc-wrap" id="mg-toc">
        <div className="mg-toc-heading"><p className="mg-section">The track list</p><p>Two cities.<br />One body of work.</p><span>NO SKIPS. JUST SCROLL.</span></div>
        <ol className="mg-toc">
          {contents.map(([page, title, id]) => (
            <li key={id}>
              <button type="button" onClick={() => readChapter(id)} data-cursor="read">
                <span className="mg-toc-page">{page}</span>
                <span className="mg-toc-title">{title}<small>{["The person behind the work", "Three client releases", "An outfit check, built from scratch", "Research & conversations", "The people. The next project."][contents.findIndex((item) => item[2] === id)]}</small></span><span className="mg-toc-arrow" aria-hidden="true">↗</span>
              </button>
            </li>
          ))}
        </ol>
      </section>

      <div className="mg-session-strip" aria-hidden="true"><div className="mg-session-track">{Array.from({ length: 3 }, (_, i) => <span key={i}>ARIAN, IN PROGRESS.</span>)}</div></div>

      <article className="mg-story" id="mg-story">
        <header className="mg-story-head">
          <p className="mg-section">01 / Liner notes</p>
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
          <p className="mg-section">02 / Client releases</p>
          <h2 className="mg-headline is-small"><span>Three sites</span><span>on heavy rotation</span></h2>
        </header>
        {next.map((site, i) => (
          <article className={`mg-feature mg-feature-${site.id}`} key={site.id}>
            <p className="mg-feature-no"><span>SIDE A / {String(i + 1).padStart(2, '0')}</span><span>{site.kicker} · 2026</span></p>
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
            {i === 1 && <blockquote className="mg-feature-pull"><span>THE BRIEF, IN ONE LINE</span>“Every deal ends<br />in a conversation.”</blockquote>}
          </article>
        ))}
      </section>

      <section className="mg-ad" id="mg-ad">
        <div className="mg-ad-sheet">
          <div className="mg-ad-repeat" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <span key={i}>DRESS RIGHT IN PUBLIC</span>)}</div>
          <p className="mg-ad-edition">03 / THE SOLO PROJECT</p>
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
          <p className="mg-section">The B-sides.</p>
          <p className="mg-reviews-note">Research at the keyboard. Conversations away from it.</p>
        </header>
        {reviews.map((review, i) => (
          <article className="mg-review" key={review.title}>
            <a className={`mg-review-art is-${i}`} href={review.url} target="_blank" rel="noreferrer" aria-label={review.cta}><img src={i === 0 ? "/posters/concept-perspective.webp" : show.image} alt={i === 0 ? "Perspective, an original poster by Arian" : "The Reasonable Show"} loading="lazy" /><span aria-hidden="true">{i === 0 ? "KNIGHT / VISION" : "THE REASONABLE SHOW"}</span></a>
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
          <p className="mg-section">05 / Credits & connections</p>
          <p className="mg-shouts-text">To the clients in Tehran and Istanbul who trusted us with the work. To the Real Co. team. To the guests who come on The Reasonable Show. And to the people trying Drip while it’s still taking shape.</p>
          <div className="mg-links">
            <a href={profile.telegram} target="_blank" rel="noreferrer">Telegram</a>
            <a href={profile.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
            <button type="button" onClick={onExit}>Back to normal ↑</button>
          </div>
        </div>
        <div className="mg-card">
          <p className="mg-card-overline">THE NEXT RELEASE</p>
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

      <nav className={`mg-reading ${reading < 0 ? 'is-cover' : ''}`} aria-label="Album reading position">
        <img src={profile.portrait} alt="" />
        <div className="mg-reading-title"><small>NOW READING</small><span>{contents[Math.max(0, reading)][1]}</span></div>
        <button type="button" className="mg-reading-prev" aria-label="Previous chapter" disabled={reading <= 0} onClick={() => readChapter(contents[reading - 1][2])}>←</button>
        <button type="button" aria-label="Next chapter" disabled={reading >= contents.length - 1} onClick={() => readChapter(contents[reading + 1][2])}>→</button>
        <button type="button" className="mg-reading-index" onClick={() => readChapter('mg-toc')}>Track list</button>
        <span className="mg-reading-fill" aria-hidden="true" />
      </nav>
    </div>
  )
}
