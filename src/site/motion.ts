import React from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
// A phone's address bar changes the visual viewport during a swipe. Rebuilding
// the scenes on each small height change interrupts native momentum scrolling.
ScrollTrigger.config({ ignoreMobileResize: true })

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
  window.scrollTo(0, 0)
  ScrollTrigger.update()
}

export function useSmoothScroll(): void {
  React.useEffect(() => {
    const desktop = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    let dispose = (): void => undefined
    const update = (): void => {
      dispose()
      dispose = () => undefined
      if (!desktop.matches) return
      const instance = new Lenis({ lerp: 0.085 })
      lenis = instance
      if (document.documentElement.classList.contains('is-loading')) instance.stop()
      instance.on('scroll', ScrollTrigger.update)
      const tick = (time: number): void => instance.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      dispose = () => {
        gsap.ticker.remove(tick)
        instance.destroy()
        if (lenis === instance) lenis = null
      }
    }
    update()
    desktop.addEventListener('change', update)
    return () => { desktop.removeEventListener('change', update); dispose() }
  }, [])
}

export function scrollToId(id: string, offset = 0): void {
  const target = id === 'top' ? 0 : document.getElementById(id)
  if (target === null) return
  if (lenis) {
    const anchor = target !== 0 && target.parentElement?.classList.contains('pin-spacer') ? target.parentElement : target
    const top = anchor === 0 ? 0 : anchor.getBoundingClientRect().top + window.scrollY
    lenis.resize()
    // Keyboard focus and native anchor scrolling can move the browser between
    // Lenis frames. Synchronise before calculating a new smooth journey.
    lenis.scrollTo(window.scrollY, { immediate: true, force: true })
    lenis.scrollTo(Math.max(0, top - offset), { duration: 1.1 })
  }
  else if (target === 0) window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'instant' : 'smooth' })
  else window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset), behavior: prefersReducedMotion() ? 'instant' : 'smooth' })
}

export { gsap, ScrollTrigger }
