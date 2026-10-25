import React from 'react'
import { gsap, prefersReducedMotion } from '../motion'
import { letter } from '../data'

export default function Letter(): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.letter-body p, .letter-sign').forEach((line) => {
        gsap.from(line, {
          y: 40, opacity: 0, duration: 1.2, ease: 'expo.out',
          scrollTrigger: { trigger: line, start: 'top 88%' }
        })
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="letter" id="working-together" ref={rootRef} data-scene="#f2eee6,#141414,#3a5bff" data-title="Working together">
      <div className="letter-sheet">
        <p className="letter-head">If we work together</p>
        <div className="letter-body">
          {letter.map((line) => <p key={line}>{line}</p>)}
        </div>
        <div className="letter-sign">
          <span className="letter-signature">Arian</span>
          <span>Istanbul, 2026</span>
        </div>
      </div>
    </section>
  )
}
