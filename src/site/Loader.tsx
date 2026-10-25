import React from 'react'
import { gsap, prefersReducedMotion } from './motion'
import { RegMark } from './Print'

// Opening "print run": three ink plates slide into registration, then the sheet lifts away.
export default function Loader({ onDone }: { onDone: () => void }): React.ReactElement | null {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [gone, setGone] = React.useState(false)

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (prefersReducedMotion()) {
      setGone(true)
      onDone()
      return
    }
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        onComplete: () => {
          setGone(true)
        }
      })
      timeline
        .from('.loader-plate', { x: (i) => [-46, 38, 14][i], y: (i) => [18, -26, 30][i], rotate: (i) => [-4, 3, 2][i], duration: 0.55, ease: 'expo.out', stagger: 0.04 })
        .add(() => onDone(), '-=0.05')
        .to(root, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.55, ease: 'expo.inOut' })
    }, root)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null
  return (
    <div className="loader" ref={rootRef} aria-hidden="true">
      <RegMark className="loader-reg tl" />
      <RegMark className="loader-reg tr" />
      <RegMark className="loader-reg bl" />
      <RegMark className="loader-reg br" />
      <div className="loader-mark">
        <span className="loader-plate c">A.S.</span>
        <span className="loader-plate m">A.S.</span>
        <span className="loader-plate y">A.S.</span>
      </div>
      <div className="loader-meta">
        <span>Printing vol. 26</span>
        <span>Istanbul</span>
      </div>
      <div className="loader-swatches"><i /><i /><i /><i /></div>
    </div>
  )
}
