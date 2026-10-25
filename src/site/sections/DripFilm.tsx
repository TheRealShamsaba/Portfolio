import React from 'react'
import { ScrollTrigger, gsap, prefersReducedMotion } from '../motion'
import { dripApp } from '../data'

// Drip, told like a launch film. A question, an answer, then the phone arrives and
// four short chapters play beside it, each with one real screen.
const INTRO = 1.6
const PHONE_INTRO = 1
const compactCopy = [
  'At the door, one question: does this outfit work?',
  'One photo. Every piece tagged. A straight answer: Clean, Bold or Nah.',
  'Your own closet. Paper tags, shelves and a receipt for every fit.',
  'Designed and built by me, from the iOS app to the models behind it. Now in private beta.'
]

export default function DripFilm(): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)
  const [chapter, setChapter] = React.useState(-1)
  const [interactive, setInteractive] = React.useState(() => !prefersReducedMotion())
  const [phone, setPhone] = React.useState(() => window.matchMedia('(max-width: 899px) and (min-height: 520px)').matches)
  const { bg, fg, accent } = dripApp.scene
  const count = dripApp.chapters.length

  React.useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return
    const media = gsap.matchMedia()

    media.add('(min-width: 900px)', () => {
      setInteractive(true)
      setPhone(false)
      const q = gsap.utils.selector(root)
      const total = INTRO + count + 0.5
      const timeline = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: `+=${total * 90}%`,
          pin: true,
          scrub: 0.7,
          refreshPriority: 97,
          onUpdate: (self) => {
            const t = self.progress * total
            setChapter(t < INTRO ? -1 : Math.min(count - 1, Math.floor(t - INTRO)))
          }
        }
      })

      timeline
        // The question sets in word by word, then makes way for the answer.
        .fromTo(q('.df-question .word'), { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.3, stagger: 0.1, ease: 'power3.out' }, 0)
        .to(q('.df-question'), { yPercent: -40, opacity: 0, duration: 0.3 }, 0.6)
        .fromTo(q('.df-answer'), { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out' }, 0.75)
        .to(q('.df-answer'), { scale: 1.1, opacity: 0, duration: 0.3 }, 1.15)
        // The phone rises into place.
        .fromTo(q('.df-phone'), { yPercent: 70, opacity: 0, rotate: 6 }, { yPercent: 0, opacity: 1, rotate: 0, duration: 0.45, ease: 'power3.out' }, 1.15)

      // Each chapter brings its own screen up inside the phone.
      dripApp.chapters.forEach((_, i) => {
        if (i === 0) return
        timeline.fromTo(q(`.df-screen:nth-child(${i + 1})`), { yPercent: 8, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.3 }, INTRO + i - 0.15)
      })
      timeline.to({}, { duration: 0.5 }, INTRO + count)
    })

    media.add({ phone: '(max-width: 899px)', landscape: '(orientation: landscape)' }, (context) => {
      if (!context.conditions?.phone) return
      // Choose the compact fallback on entry/rotation, not as browser chrome
      // expands during a swipe and briefly changes the visible height.
      if (window.innerHeight < 520) { setInteractive(false); setPhone(false); return }
      setInteractive(true)
      setPhone(true)
      const q = gsap.utils.selector(root)
      const total = PHONE_INTRO + count + 0.5
      const timeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          // CSS keeps the stage in view; the document keeps its native inertia.
          // Stable svh sizing also avoids a jump when Safari's toolbar retracts.
          trigger: root, start: 'top top',
          end: () => `+=${root.offsetHeight - root.querySelector<HTMLElement>('.df-stage')!.offsetHeight}`,
          scrub: true, refreshPriority: 97,
          onUpdate: (self) => {
            const t = self.progress * total
            setChapter(t < PHONE_INTRO ? -1 : Math.min(count - 1, Math.floor(t - PHONE_INTRO)))
          }
        }
      })
      timeline
        .from(q('.df-question .word'), { y: 16, duration: 0.2, stagger: 0.05 }, 0)
        .to(q('.df-question'), { y: -20, opacity: 0, duration: 0.2 }, 0.35)
        .fromTo(q('.df-answer'), { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.2 }, 0.5)
        .to(q('.df-answer'), { opacity: 0, duration: 0.15 }, 0.78)
        .fromTo(q('.df-phone'), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 0.78)
      dripApp.chapters.forEach((_, i) => {
        if (i) timeline.fromTo(q(`.df-screen:nth-child(${i + 1})`), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.25 }, PHONE_INTRO + i - 0.1)
      })
      timeline.to({}, { duration: 0.5 }, PHONE_INTRO + count)
    })
    return () => media.revert()
  }, [count])

  React.useEffect(() => { ScrollTrigger.refresh() }, [interactive, phone])

  return (
    <section
      className={`drip-film ${interactive ? '' : 'is-static'} ${phone ? 'is-phone-film' : ''} ${chapter >= 0 ? 'is-playing' : ''}`}
      id="drip"
      ref={rootRef}
      data-scene={`${bg},${fg},${accent}`}
      data-title="Drip"
    >
      <div className="df-stage">
      <header className="df-head">
        <span className="df-number">IV</span>
        <img className="df-wordmark" src={dripApp.wordmark} alt="Drip" />
        <p>My own product. An iOS app, in private beta.</p>
      </header>

      <h2 className="df-question" aria-label={dripApp.question}>
        {dripApp.question.split(' ').map((word) => (
          <span className="df-mask" key={word}><span className="word">{word}</span></span>
        ))}
      </h2>
      <p className="df-answer"><img src={dripApp.wordmark} alt="" /><span>{dripApp.answer}</span></p>

      <ol className="df-chapters">
        {dripApp.chapters.map((item, i) => (
          <li key={item.label} id={`drip-story-${i}`} className={`df-chapter ${i === chapter ? 'is-active' : ''}`}>
            <p className="df-label"><span>0{i + 1}</span>{item.label}</p>
            <h3>{item.title}</h3>
            <p className="df-text"><span className="df-full-copy">{item.text}</span><span className="df-compact-copy">{compactCopy[i]}</span></p>
            {i === count - 1 ? <a className="df-cta" href={dripApp.url} target="_blank" rel="noreferrer" data-cursor="join" tabIndex={interactive && chapter !== i ? -1 : 0}>Join the waitlist ↗</a> : null}
            <img className="df-static-screen" src={item.screen} alt="" loading="lazy" />
          </li>
        ))}
      </ol>

      <div className="df-phone" aria-hidden="true">
        {dripApp.chapters.map((item) => <img key={item.screen} className="df-screen" src={item.screen} alt="" />)}
      </div>

      <div className="df-progress" aria-hidden="true">
        {dripApp.chapters.map((item, i) => <i key={item.label} className={i <= chapter ? 'is-on' : ''} />)}
        <span className="df-scroll-cue">{chapter < 0 ? 'SCROLL TO PLAY' : `${String(chapter + 1).padStart(2, '0')} / 04 · KEEP SCROLLING ↓`}</span>
      </div>
      </div>
    </section>
  )
}
