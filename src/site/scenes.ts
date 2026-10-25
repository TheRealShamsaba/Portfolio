import { gsap, prefersReducedMotion } from './motion'

export type SceneColours = { bg: string; fg: string; accent: string }

export const parseScene = (value: string): SceneColours => {
  const [bg, fg, accent] = value.split(',')
  return { bg, fg, accent }
}

/** Ease the whole page into a room's colours and tell the header which room you're in. */
export function applyScene(scene: SceneColours, title: string, instant = false): void {
  gsap.to(document.documentElement, {
    '--bg': scene.bg,
    '--fg': scene.fg,
    '--accent': scene.accent,
    duration: instant || prefersReducedMotion() ? 0 : 0.9,
    ease: 'power2.inOut',
    overwrite: true
  })
  window.dispatchEvent(new CustomEvent('roomtitle', { detail: title }))
}
