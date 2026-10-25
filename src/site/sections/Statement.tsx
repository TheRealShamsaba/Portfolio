import React from 'react'
import { gsap, prefersReducedMotion } from '../motion'

type Segment = { text: string; style?: 'serif' | 'black' }

const statement: Segment[] = [
  { text: 'Companies come to me with a' },
  { text: 'problem,', style: 'serif' },
  { text: 'rarely a spec. A dealer losing buyers who can’t read Turkish. A medical supplier whose product data lives in brochures. I work out what actually needs to exist, then I build it' },
  { text: 'properly:', style: 'black' },
  { text: 'the interface people see, the system underneath, and the admin your team uses every day.' }
]

export default function Statement(): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.statement-text', {
        y: 24, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.statement-text', start: 'top 90%', once: true }
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="statement" ref={rootRef} data-scene="#0c0c0c,#efebe3,#8d95f3" data-title="What I do">
      <p className="statement-text">
        {statement.map((segment, segmentIndex) => (
          <span key={segmentIndex} className={segment.style ? `seg-${segment.style}` : undefined}>
            {segment.text.split(' ').map((word, wordIndex) => (
              <span key={wordIndex} className="word">{word} </span>
            ))}
          </span>
        ))}
      </p>
      <p className="statement-next">What follows is some of that work, in the order I’d show it to you in person.</p>
    </section>
  )
}
