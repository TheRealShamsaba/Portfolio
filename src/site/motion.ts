import React from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const getLenis = (): Lenis | null => lenis

// Replacing a view can remove thousands of pixels of pinned content. Measure the
// new page before resetting Lenis so its old scroll position cannot carry over.
export function resetScroll(): void {
  ScrollTrigger.clearScrollMemory()
  ScrollTrigger.sort()
  ScrollTrigger.refresh()
  lenis?.resize()
  lenis?.scrollTo(0, { immediate: true, force: true })
  window.scrollTo({ top: 0, behavior: 'instant' })
  ScrollTrigger.update()
}

export function useSmoothScroll(): void {
  React.useEffect(() => {
    if (prefersReducedMotion()) return
    const instance = new Lenis({ lerp: 0.085 })
    lenis = instance
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number): void => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      lenis = null
    }
  }, [])
}

export function scrollToId(id: string): void {
  const target = id === 'top' ? 0 : document.getElementById(id)
  if (target === null) return
  if (lenis) {
    const anchor = target !== 0 && target.parentElement?.classList.contains('pin-spacer') ? target.parentElement : target
    const top = anchor === 0 ? 0 : anchor.getBoundingClientRect().top + window.scrollY
    lenis.resize()
    // Keyboard focus and native anchor scrolling can move the browser between
    // Lenis frames. Synchronise before calculating a new smooth journey.
    lenis.scrollTo(window.scrollY, { immediate: true, force: true })
    lenis.scrollTo(top, { duration: 1.1 })
  }
  else if (target === 0) window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'instant' : 'smooth' })
  else target.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth' })
}

export { gsap, ScrollTrigger }
