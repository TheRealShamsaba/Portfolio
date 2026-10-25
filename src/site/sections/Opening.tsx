import React from 'react'
import { gsap, prefersReducedMotion } from '../motion'
import { profile } from '../data'

export default function Opening({ ready }: { ready: boolean }): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (!ready || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.opening-photo', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut' })
        .from('.opening-photo img', { scale: 1.35, duration: 2.2 }, 0)
        .from('.opening-name > span > span', { yPercent: 110, duration: 1.4, stagger: 0.12 }, 0.35)
        .from('.opening-intro, .opening-place, .opening-cue', { y: 20, opacity: 0, duration: 1.2, stagger: 0.1 }, 0.8)

      const phone = window.matchMedia('(max-width: 899px)').matches
      const scrub = { trigger: rootRef.current, start: 'top top', end: 'bottom top', scrub: true }
      gsap.to('.opening-photo img', { yPercent: phone ? 7 : 12, scale: 1.08, ease: 'none', scrollTrigger: scrub })
    }, rootRef)
    return () => ctx.revert()
  }, [ready])

  return (
    <section className="opening" id="top" ref={rootRef} data-scene="#0c0c0c,#efebe3,#8d95f3" data-title="Arian Shamsabadi">
      <div className="opening-copy">
        <p className="opening-place">Istanbul</p>
        <h1 className="opening-name">
          <span><span>Arian</span></span>
          <span><span>Shamsabadi</span></span>
        </h1>
        <p className="opening-intro">
          Engineer and founder of Real Co. I design and build software for companies in Turkey and Iran, and a few products of my own.
        </p>
        <p className="opening-cue" aria-hidden="true">Scroll</p>
      </div>
      <figure className="opening-photo">
        <img src={profile.portrait} alt="Arian Shamsabadi in Cappadocia" />
      </figure>
    </section>
  )
}
