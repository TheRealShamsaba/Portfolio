import React from 'react'
import Halftone from './Halftone'
import Sticker from './Sticker'
import Marquee from '../Marquee'
import { Barcode, Handling, RingText, type HandlingIcon } from '../Print'
import { gsap, prefersReducedMotion, scrollToId } from '../motion'
import { archive, profile, show } from '../data'
import { covers, labels, posterCopy, type ZLabel } from './data'

// Posters: the site set like your poster work. Halftone, blackletter, stickers, packaging.

const letters = (word: string): React.ReactElement[] =>
  word.split('').map((char, index) => <span key={index} className="z-char">{char}</span>)

// A photo printed out of register: two ink plates sit off to the sides of a grey print.
// Hover and the plates slide into register while the print comes up to full colour.
function PrintImage({ src, alt, position = '50% 50%' }: { src: string; alt: string; position?: string }): React.ReactElement {
  const rootRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(max-width: 860px)', () => {
      const timeline = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 90%', end: 'top 45%', scrub: 0.35 } })
      timeline.fromTo(root.querySelector('.z-print-base'), { filter: 'grayscale(1) contrast(1.25)' }, { filter: 'grayscale(0) contrast(1)', ease: 'none' }, 0)
      if (!root.closest('.z-label-drip')) timeline.to(root.querySelectorAll('.z-print-plate'), { x: 0, y: 0, opacity: 0, ease: 'none' }, 0)
    })
    return () => mm.revert()
  }, [])
  const style = { '--src': `url("${src}")`, '--pos': position } as React.CSSProperties
  return (
    <div className="z-print" style={style} data-cursor="look" ref={rootRef}>
      <img className="z-print-base" src={src} alt={alt} loading="lazy" decoding="async" />
      <span className="z-print-plate is-magenta" aria-hidden="true" />
      <span className="z-print-plate is-cyan" aria-hidden="true" />
    </div>
  )
}

function Hero(): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const media = gsap.matchMedia()
    const ctx = gsap.context(() => {
      const phone = window.matchMedia('(max-width: 860px)').matches
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.z-first .z-char', { yPercent: phone ? 0 : 120, y: phone ? 18 : 0, rotate: phone ? 0 : 8, opacity: 0, duration: 1.3, stagger: 0.06 })
        .from('.z-last', { yPercent: phone ? 0 : 40, y: phone ? 18 : 0, opacity: 0, duration: 1.4 }, 0.15)
        .from('.z-role', { xPercent: phone ? 0 : 30, opacity: 0, duration: 1.2 }, 0.3)
        .from('.z-quote, .z-persian', { y: 24, opacity: 0, duration: 1 }, 0.45)
      const scrub = { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.z-portrait', { yPercent: 14, ease: 'none', scrollTrigger: { ...scrub } })
      media.add('(min-width: 861px)', () => {
        gsap.to('.z-first', { yPercent: -60, ease: 'none', scrollTrigger: { ...scrub } })
        gsap.to('.z-last', { yPercent: -18, ease: 'none', scrollTrigger: { ...scrub } })
        gsap.to('.z-role', { xPercent: 22, ease: 'none', scrollTrigger: { ...scrub } })
      })
    }, rootRef)
    return () => { media.revert(); ctx.revert() }
  }, [])

  return (
    <section className="z-hero" id="top" ref={rootRef}>
      <div className="z-stage">
        <div className="z-portrait" data-cursor="look">
          <Halftone src={profile.portrait} alt="Portrait of Arian Shamsabadi in Cappadocia" cell={5} angle={22} contrast={1.6} brightness={0.3} focus={[0.5, 0.62]} zoom={1.3} radius={150} wander />
        </div>
        <h1 className="z-name">
          <span className="z-first">{letters('Arian')}</span>
          <span className="z-last">Shamsabadi</span>
        </h1>
        <span className="z-role" aria-hidden="true">{posterCopy.role}</span>
        <p className="z-quote">{posterCopy.quote}</p>
        <span className="z-persian" lang="fa" dir="rtl">{profile.persianName}</span>
      </div>
      <div className="z-stickers">
        <Sticker className="z-st-warning" rotate={-6}><strong>Warning:</strong> {posterCopy.warning}</Sticker>
        <Sticker className="z-st-a" rotate={9}>{posterCopy.stickers[0]}</Sticker>
        <Sticker className="z-st-b" rotate={-3}>{posterCopy.stickers[1]}</Sticker>
        <Sticker className="z-st-hint" rotate={4}>{posterCopy.stickers[2]}</Sticker>
      </div>
      <button type="button" className="z-stamp" onClick={() => scrollToId('z-thesis')} aria-label="Scroll on" data-cursor="scroll">
        <RingText text="SCROLL ✶ THE OTHER SIDE ✶ VOL. 26 ✶ " />
        <span aria-hidden="true">↓</span>
      </button>
    </section>
  )
}

type Segment = { text: string; style?: 'loud' | 'brush' }
const thesis: Segment[] = [
  { text: 'A medical catalogue in' },
  { text: 'Persian.', style: 'loud' },
  { text: 'A car dealership in three languages. An app that knows what’s in your' },
  { text: 'closet.', style: 'brush' },
  { text: 'Different problems. The same person designing and' },
  { text: 'building', style: 'loud' },
  { text: 'the answer.' }
]
const persianLines = ['ایده تا ساخته نشود، فقط یک فکر است', 'فکر کن، بساز، منتشر کن', 'آرین شمس‌آبادی', 'از صفر تا محصول', 'ساختن، نه فقط گفتن']
const disciplines: { icon: HandlingIcon; title: string; items: string }[] = [
  { icon: 'up', title: 'Product', items: 'Strategy, architecture, experience, launch.' },
  { icon: 'care', title: 'Technology', items: 'Applied AI, software systems, web and mobile.' },
  { icon: 'fragile', title: 'Brand', items: 'Positioning, visual direction, content and voice.' },
  { icon: 'dry', title: 'Media', items: 'The Reasonable Show. Conversations, interviews and posters.' }
]

function Thesis(): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)
  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.z-persian-line').forEach((line, i) => {
        gsap.to(line, { xPercent: i % 2 ? 18 : -18, ease: 'none', scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="z-thesis" id="z-thesis" ref={rootRef}>
      <div className="z-persian-field" aria-hidden="true" lang="fa" dir="rtl">
        {persianLines.map((line) => <span key={line} className="z-persian-line">{line}</span>)}
      </div>
      <p className="z-thesis-text">
        {thesis.map((segment, i) => (
          <span key={i} className={segment.style ? `z-seg-${segment.style}` : undefined}>
            {segment.text.split(' ').map((word, w) => <span key={w} className="z-word">{word} </span>)}
          </span>
        ))}
      </p>
      <div className="z-disciplines">
        {disciplines.map((item) => (
          <article key={item.title} className="z-discipline">
            <Handling icon={item.icon} />
            <h3>{item.title}</h3>
            <p>{item.items}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

const handlingIcons: HandlingIcon[] = ['up', 'care', 'fragile', 'dry']

function LabelCard({ label, index }: { label: ZLabel; index: number }): React.ReactElement {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    // Let a tall label scroll far enough to expose its footer before it stacks.
    const fit = (): void => {
      const top = Math.min(84 + index * 22, window.innerHeight - wrap.offsetHeight - 24)
      wrap.style.setProperty('--label-top', `${top}px`)
    }
    const observer = new ResizeObserver(fit)
    observer.observe(wrap)
    window.addEventListener('resize', fit)
    fit()
    return () => { observer.disconnect(); window.removeEventListener('resize', fit) }
  }, [index])
  return (
    <div className="z-label-wrap" ref={wrapRef} style={{ '--i': index } as React.CSSProperties}>
      <article className={`z-label z-label-${label.id}`} style={{ '--card-bg': label.bg, '--card-ink': label.ink, '--card-spot': label.spot } as React.CSSProperties}>
        <header className="z-label-strip">
          <span>No. {label.no}</span>
          <span>{label.kind}</span>
          <span>{label.status}</span>
        </header>
        <div className="z-label-body">
          <div className="z-label-copy">
            <h3 className="z-label-name">{label.name}</h3>
            <p className="z-label-statement">{label.statement}</p>
            <p className="z-label-text">{label.body}</p>
            <div className="z-nutrition">
              <div className="z-nutrition-head"><strong>Project notes</strong><span>{label.serving}</span></div>
              {label.ingredients.map(([name, detail]) => (
                <div className="z-nutrition-row" key={name}>
                  <span>{name}</span><b>{detail}</b>
                </div>
              ))}
            </div>
            <div className="z-label-foot">
              <ul className="z-handling">
                {label.handling.map((caption, i) => <li key={caption}><Handling icon={handlingIcons[i]} /><span>{caption}</span></li>)}
              </ul>
              <a className="z-label-cta" href={label.url} target="_blank" rel="noreferrer" data-cursor="open">{label.cta} ↗</a>
            </div>
          </div>
          {label.image ? (
            <div className="z-label-visual">
              <PrintImage src={label.image} alt={`${label.name} — ${label.statement}`} position={label.id === 'drip' ? '50% 20%' : '50% 50%'} />
            </div>
          ) : (
            <div className="z-label-visual z-label-type" aria-hidden="true">
              <span className="z-type-slash">/Real.</span>
              <RingText text="WE BUILD THE REAL THING ✶ EN / FA ✶ " className="z-type-ring" />
              <span className="z-type-fa" lang="fa" dir="rtl">ما چیز واقعی می‌سازیم</span>
            </div>
          )}
        </div>
        <span className="z-stamp-mark">{label.stamp}</span>
        <Barcode code={`AS-${label.no}-${label.id.toUpperCase().replace('-', '')}`} />
      </article>
    </div>
  )
}

function Catalogue(): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)
  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const media = gsap.matchMedia()
    const ctx = gsap.context(() => {
      const wraps = gsap.utils.toArray<HTMLElement>('.z-label-wrap')
      media.add('(min-width: 861px)', () => {
        wraps.forEach((wrap, i) => {
          const next = wraps[i + 1]
          if (!next) return
          gsap.fromTo(wrap.querySelector('.z-label'), { scale: 1, rotate: 0, filter: 'brightness(1)' }, {
            scale: 0.9, rotate: i % 2 ? 2.5 : -2.5, filter: 'brightness(0.6)', ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true }
          })
        })
      })
      gsap.from('.z-catalogue-title .z-char', {
        yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.04,
        scrollTrigger: { trigger: '.z-catalogue-title', start: 'top 85%' }
      })
    }, rootRef)
    return () => { media.revert(); ctx.revert() }
  }, [])

  return (
    <section className="z-catalogue" id="z-work" ref={rootRef}>
      <h2 className="z-catalogue-title" aria-label="The Catalogue">
        {'The Catalogue'.split('').map((char, i) => <span key={i} className="z-char" aria-hidden="true">{char === ' ' ? ' ' : char}</span>)}
      </h2>
      <div className="z-labels">
        {labels.map((label, i) => <LabelCard key={label.id} label={label} index={i} />)}
      </div>
    </section>
  )
}

// The live site, printed on the cover. Hover and it scrolls top to bottom inside the panel.
function Cover({ cover }: { cover: (typeof covers)[number] }): React.ReactElement {
  const ref = React.useRef<HTMLAnchorElement>(null)
  React.useEffect(() => {
    const root = ref.current
    if (!root || prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(max-width: 860px)', () => {
      gsap.fromTo(root.querySelector('img'), { objectPosition: '50% 0%' }, {
        objectPosition: '50% 45%', ease: 'none',
        scrollTrigger: { trigger: root.querySelector('.z-cover-art'), start: 'top 45%', end: 'bottom top+=160', scrub: 0.4 }
      })
    })
    return () => mm.revert()
  }, [])
  const onMove = (event: React.PointerEvent<HTMLAnchorElement>): void => {
    if (event.pointerType !== 'mouse' || !ref.current || prefersReducedMotion()) return
    const rect = ref.current.getBoundingClientRect()
    ref.current.style.setProperty('--rx', `${-((event.clientY - rect.top) / rect.height - 0.5) * 10}deg`)
    ref.current.style.setProperty('--ry', `${((event.clientX - rect.left) / rect.width - 0.5) * 12}deg`)
  }
  const onLeave = (): void => {
    ref.current?.style.setProperty('--rx', '0deg')
    ref.current?.style.setProperty('--ry', '0deg')
  }
  return (
    <a className="z-cover" href={cover.url} target="_blank" rel="noreferrer" ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} data-cursor="visit">
      <div className="z-cover-top">
        <span className="z-cover-issue"><small>Live</small>{cover.issue}</span>
        <h3 className="z-cover-title">{cover.title}</h3>
      </div>
      <div className="z-cover-art">
        <img src={cover.image} alt={`${cover.title} homepage`} loading="lazy" decoding="async" />
        <span className="z-cover-bubble">{cover.host}</span>
      </div>
      <p className="z-cover-blurb">{cover.blurb}</p>
      <div className="z-cover-bottom">
        <span className="z-cover-price"><b>2026</b><small>Real Co.</small></span>
        <span className="z-cover-tags">{cover.tags.map((tag) => <i key={tag}>{tag}</i>)}</span>
        <span className="z-cover-go">Visit ↗</span>
      </div>
    </a>
  )
}

function Builds(): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)
  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const phone = window.matchMedia('(max-width: 860px)').matches
      gsap.utils.toArray<HTMLElement>('.z-cover').forEach((cover, i) => gsap.from(cover, {
        y: phone ? 22 : 120, rotate: phone ? 0 : [-6, 4, -3][i % 3], opacity: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: cover, start: 'top 95%', once: true }
      }))
      gsap.from('.z-builds-title', { scale: phone ? 1 : 1.3, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.z-builds-title', start: 'top 90%' } })
    }, rootRef)
    return () => ctx.revert()
  }, [])
  return (
    <section className="z-builds" id="z-builds" ref={rootRef}>
      <h2 className="z-builds-title">Live builds</h2>
      <div className="z-covers">{covers.map((cover) => <Cover key={cover.id} cover={cover} />)}</div>
    </section>
  )
}

// The show as a screen-printed gig poster: two flat inks, big stacked type.
function GigPoster(): React.ReactElement {
  return (
    <section className="z-gig">
      <a className="z-gig-poster" href={show.url} target="_blank" rel="noreferrer" data-cursor="play">
        <div className="z-gig-photo"><img src={show.image} alt="Arian laughing on The Reasonable Show" loading="lazy" /></div>
        <div className="z-gig-type">
          <span className="z-gig-pre">Live on YouTube</span>
          <span className="z-gig-the">The</span>
          <span className="z-gig-name">Reasonable</span>
          <span className="z-gig-show">Show</span>
          <span className="z-gig-line">Ideas tested out loud · with Arian Shamsabadi · every episode · no script</span>
        </div>
        <span className="z-gig-admit">Admit one ▶</span>
      </a>
      <Sticker className="z-st-bubble" rotate={-8}>Me? Sarcastic? Never.</Sticker>
    </section>
  )
}

function Archive(): React.ReactElement {
  return (
    <section className="z-archive">
      <header className="z-archive-head">
        <h2>The designer years</h2>
        <p>Before the products, I made posters. This side of the site is built out of them.</p>
      </header>
      <Marquee className="z-archive-reel" speed={0.5}>
        {archive.map((poster, i) => (
          <a key={poster.id} className="z-archive-item" href={poster.image} target="_blank" rel="noreferrer" style={{ '--tilt': `${((i % 3) - 1) * 1.6}deg` } as React.CSSProperties} data-cursor="view">
            <img src={poster.image} alt={poster.title} loading="lazy" decoding="async" />
            <span>{poster.title}</span>
          </a>
        ))}
      </Marquee>
    </section>
  )
}

const channels = [
  { icon: 'up' as const, label: 'Email', href: `mailto:${profile.email}` },
  { icon: 'care' as const, label: 'Telegram', href: profile.telegram },
  { icon: 'fragile' as const, label: 'WhatsApp', href: profile.whatsapp },
  { icon: 'dry' as const, label: 'GitHub', href: profile.github }
]

function Contact({ onExit }: { onExit: () => void }): React.ReactElement {
  return (
    <section className="z-contact" id="z-contact">
      <h2 className="z-send-it">Send it.</h2>
      <article className="z-parcel">
        <div className="z-parcel-row">
          <span className="z-parcel-key">To:</span>
          <div>
            <p className="z-parcel-name">{profile.name}</p>
            <a className="z-parcel-address" href={`mailto:${profile.email}`} data-cursor="write">{profile.email.split('@')[0]}@<wbr />{profile.email.split('@')[1]}</a>
          </div>
        </div>
        <div className="z-parcel-row">
          <span className="z-parcel-key">From:</span>
          <p>Tell me what you’re working on and where you’re stuck. A website, an app, an internal tool, or something you haven’t quite worked out yet.</p>
        </div>
        <ul className="z-parcel-channels">
          {channels.map((channel) => (
            <li key={channel.label}>
              <a href={channel.href} target={channel.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer" data-cursor="send">
                <Handling icon={channel.icon} /><span>{channel.label}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="z-parcel-foot">
          <Barcode code="REAL-CO-2026-AS" />
          <span className="z-stamp-mark">Priority</span>
          <span className="z-parcel-warning">Designed and built in Istanbul.</span>
        </div>
      </article>
      <footer className="z-footer">
        <span>© 2026 {profile.name}</span>
        <span>Contents may vary in colour, shape and beliefs.</span>
        <button type="button" onClick={onExit}>Back to normal ↑</button>
      </footer>
    </section>
  )
}

export default function PosterMood({ onExit }: { onExit: () => void }): React.ReactElement {
  return (
    <div className="zine mood-poster">
      <Hero />
      <Thesis />
      <Catalogue />
      <Builds />
      <GigPoster />
      <Archive />
      <Contact onExit={onExit} />
    </div>
  )
}
