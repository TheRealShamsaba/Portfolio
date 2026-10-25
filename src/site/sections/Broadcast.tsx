import React from 'react'
import { gsap, prefersReducedMotion } from '../motion'
import { show } from '../data'

function Timecode(): React.ReactElement {
  const ref = React.useRef<HTMLSpanElement>(null)
  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const start = performance.now()
    let frame = 0
    const pad = (n: number): string => String(Math.floor(n)).padStart(2, '0')
    const loop = (now: number): void => {
      frame = requestAnimationFrame(loop)
      const t = (now - start) / 1000 + 1834
      if (ref.current) ref.current.textContent = `${pad(t / 3600)}:${pad((t / 60) % 60)}:${pad(t % 60)}:${pad((t * 25) % 25)}`
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [])
  return <span ref={ref}>00:30:34:00</span>
}

// Static that clears when the channel tunes in.
function Static({ className }: { className: string }): React.ReactElement {
  const ref = React.useRef<HTMLCanvasElement>(null)
  React.useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || prefersReducedMotion()) return
    canvas.width = 240
    canvas.height = 135
    const image = ctx.createImageData(canvas.width, canvas.height)
    let frame = 0
    let visible = false
    const loop = (): void => {
      if (!visible) { frame = 0; return }
      frame = requestAnimationFrame(loop)
      for (let i = 0; i < image.data.length; i += 4) {
        const v = Math.random() * 255
        image.data[i] = v
        image.data[i + 1] = v
        image.data[i + 2] = v
        image.data[i + 3] = 255
      }
      ctx.putImageData(image, 0, 0)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame) frame = requestAnimationFrame(loop)
    })
    observer.observe(canvas)
    return () => { observer.disconnect(); cancelAnimationFrame(frame) }
  }, [])
  return <canvas ref={ref} className={className} aria-hidden="true" />
}

export default function Broadcast(): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)

  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.timeline({ scrollTrigger: { trigger: '.tv', start: 'top 70%' } })
        .fromTo('.tv-static', { opacity: 1 }, { opacity: 0, duration: 0.9, ease: 'steps(6)' })
        .from('.tv-picture', { scaleY: 0.01, scaleX: 1.2, duration: 0.45, ease: 'expo.out' }, 0.1)
        .from('.lower-third > *', { xPercent: -110, duration: 0.9, ease: 'expo.out', stagger: 0.12 }, 0.7)
        .from('.tv-bug', { opacity: 0, duration: 0.4 }, 0.9)
      gsap.fromTo('.tv-picture img', { scale: 1.15 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: true }
      })
      gsap.from('.broadcast-copy > *', {
        y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: '.broadcast-copy', start: 'top 85%' }
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="broadcast" id="show" ref={rootRef} data-scene="#0a0a0a,#f2ede3,#f3b224" data-title="Intermission">
      <p className="broadcast-kicker">Intermission</p>
      <a className="tv" href={show.url} target="_blank" rel="noreferrer" data-cursor="play">
        <div className="tv-picture"><img src={show.image} alt="Arian laughing on The Reasonable Show" loading="lazy" /></div>
        <Static className="tv-static" />
        <div className="tv-lines" aria-hidden="true" />
        <div className="tv-bug" aria-hidden="true"><span className="tv-rec"><i />Rec</span><Timecode /><span>CH 03</span></div>
        <div className="lower-third" aria-hidden="true">
          <span className="lt-name">The Reasonable Show</span>
          <span className="lt-line">Ideas tested out loud · with Arian Shamsabadi</span>
        </div>
      </a>
      <div className="broadcast-copy">
        <p>{show.text}</p>
        <a href={show.url} target="_blank" rel="noreferrer">Watch an episode ↗</a>
      </div>
    </section>
  )
}
