import React from 'react'
import { gsap, prefersReducedMotion } from '../motion'
import ChessBoard from '../ChessBoard'
import { works, type Chapter } from '../data'

// One project, played as a short scene: the name fills the screen, the work rises
// over it, then steps aside so the story can be read next to it.
export default function ChapterScene({ chapter, number, kind, year }: { chapter: Chapter; number: string; kind: string; year: string }): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)
  const { bg, fg, accent } = chapter.scene

  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const media = gsap.matchMedia()
    const root = rootRef.current
    if (!root) return

    media.add('(min-width: 900px)', () => {
      const image = root.querySelector('img')
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root, start: 'top top', end: '+=170%', pin: true, scrub: 0.5, invalidateOnRefresh: true, refreshPriority: 100 - works.findIndex((work) => work.id === chapter.id) }
      })
      timeline
        .fromTo(root.querySelector('.chapter-name'), { scale: 1.1, opacity: 1 }, { scale: 0.92, opacity: 0, duration: 1 })
        .fromTo(root.querySelector('.chapter-media'), { y: () => window.innerHeight * 0.65, scale: 0.82 }, { y: 0, scale: 1, duration: 1 }, 0)
        .to(root.querySelector('.chapter-media'), { x: () => window.innerWidth * 0.19, scale: 0.84, duration: 0.8 }, 1.05)
        .fromTo(root.querySelectorAll('.chapter-copy > *'), { x: -18, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, stagger: 0.06 }, 1.85)
        .to({}, { duration: 0.3 })
      // The chess chapter has no image; only website screenshots get this pan.
      if (image) {
        timeline.fromTo(image, { scale: 1.25 }, { scale: 1, duration: 1.6 }, 0)
        timeline.fromTo(image, { objectPosition: '50% 0%' }, { objectPosition: '50% 100%', duration: 1.4, ease: 'power1.inOut' }, 1.2)
      }
    })

    media.add('(max-width: 899px)', () => {
      const stage = root.querySelector('.chapter-stage')
      const image = root.querySelector('.chapter-media img')
      const scrub = { trigger: stage, start: 'top top+=80', end: 'bottom top+=160', scrub: 0.6 }
      // Arrive upright before the visitor reaches the image; only its contents pan.
      gsap.from(root.querySelector('.chapter-media'), {
        y: 16, opacity: 0, duration: 0.55, ease: 'power2.out',
        scrollTrigger: { trigger: root.querySelector('.chapter-media'), start: 'top 95%', once: true }
      })
      if (image) gsap.fromTo(image, { objectPosition: '50% 0%' }, {
        objectPosition: '50% 65%', ease: 'none', scrollTrigger: { ...scrub }
      })
      gsap.from(root.querySelectorAll('.chapter-copy > *'), {
        y: 22, opacity: 0, duration: 0.7, ease: 'power2.out', stagger: 0.08,
        scrollTrigger: { trigger: root.querySelector('.chapter-copy'), start: 'top 88%', once: true }
      })
    })
    return () => media.revert()
  }, [])

  return (
    <section
      id={chapter.id}
      className={`chapter chapter-${chapter.id}`}
      ref={rootRef}
      data-scene={`${bg},${fg},${accent}`}
      data-title={chapter.title}
    >
      <div className="chapter-stage">
        <h2 className="chapter-name"><span className="chapter-number">{number}<span className="chapter-edition"> / SELECTED WORK</span></span>{chapter.title}</h2>
        {chapter.id === 'knightvision' ? (
          <div className="chapter-media chapter-media-board"><ChessBoard /></div>
        ) : (
          <a className="chapter-media" href={chapter.url} target="_blank" rel="noreferrer" data-cursor="visit" aria-label={`Visit ${chapter.host}`}>
            <span className="chapter-windowbar" aria-hidden="true"><span>{chapter.host}</span><span>↗</span></span>
            <img src={chapter.image} alt={chapter.title} loading="lazy" decoding="async" />
          </a>
        )}
        <p className="chapter-caption" aria-hidden="true"><span>{kind}</span><span>{year}</span></p>
      </div>
      <div className="chapter-copy">
        <p className="chapter-place">{chapter.place}</p>
        <p className="chapter-story">{chapter.story}</p>
        <div className="placard">
          <p><em>{chapter.title}</em>, {year}</p>
          <p>{kind}</p>
          <p>{chapter.facts}</p>
          <a href={chapter.url} target="_blank" rel="noreferrer">{chapter.host} ↗</a>
        </div>
      </div>
    </section>
  )
}
