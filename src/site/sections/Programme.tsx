import React from 'react'
import { gsap, prefersReducedMotion, scrollToId } from '../motion'
import { works } from '../data'

export const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']

// The running order, set like a printed programme or a tasting menu.
export default function Programme(): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.programme-card', {
        y: 120, rotate: -3, opacity: 0, duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: '.programme-card', start: 'top 88%' }
      })
      gsap.from('.programme-item', {
        y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.07,
        scrollTrigger: { trigger: '.programme-list', start: 'top 80%' }
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="programme" ref={rootRef} data-scene="#0c0c0c,#efebe3,#8d95f3" data-title="Programme">
      <div className="programme-card">
        <p className="programme-head">Selected work</p>
        <p className="programme-sub">Five pieces and an intermission · about four minutes</p>
        <ol className="programme-list">
          {works.map(({ id, title, kind, year }, index) => (
            <li key={id} className="programme-item">
              <a href={`#${id}`} onClick={(event) => { event.preventDefault(); scrollToId(id) }} data-cursor="go">
                <span className="programme-no">{roman[index]}</span>
                <span className="programme-title">{title}</span>
                <span className="programme-kind">{kind}</span>
                <span className="programme-year">{year}</span>
              </a>
            </li>
          ))}
        </ol>
        <p className="programme-foot">Then a note on working together, and some posters from before.</p>
      </div>
    </section>
  )
}
