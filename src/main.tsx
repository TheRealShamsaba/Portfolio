import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

function initReveal(): void {
  const els = document.querySelectorAll('.reveal, .reveal-item')
  if (!els.length) return
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        (entry.target as HTMLElement).classList.add('is-visible')
        obs.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })

  els.forEach(el => observer.observe(el))
}

function initSectionScrollSnap(): void {
  if (window.location.pathname.startsWith('/showcase')) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  if (window.innerWidth < 900) return

  const sections = Array.from(document.querySelectorAll<HTMLElement>('main.home-main section.home-section'))
  if (!sections.length) return
  const header = document.querySelector<HTMLElement>('.site-header')
  const getHeaderOffset = (): number => (header?.offsetHeight ?? 76) + 6

  let locked = false
  let wheelBuffer = 0
  const lockFor = (ms: number): void => {
    locked = true
    window.setTimeout(() => { locked = false }, ms)
  }

  const getSectionTops = (): number[] => {
    const offset = getHeaderOffset()
    return sections.map((section) => {
      const top = section.getBoundingClientRect().top + window.scrollY - offset
      return Math.max(0, Math.round(top))
    })
  }

  const getCurrentIndex = (): number => {
    const currentY = window.scrollY
    const tops = getSectionTops()
    let bestIndex = 0
    let bestDistance = Number.POSITIVE_INFINITY

    tops.forEach((top, index) => {
      const distance = Math.abs(top - currentY)
      if (distance < bestDistance) {
        bestDistance = distance
        bestIndex = index
      }
    })

    return bestIndex
  }

  const onWheel = (event: WheelEvent): void => {
    if (locked) return
    wheelBuffer += event.deltaY
    if (Math.abs(wheelBuffer) < 42) return

    const current = getCurrentIndex()
    const direction = wheelBuffer > 0 ? 1 : -1
    wheelBuffer = 0
    const next = Math.max(0, Math.min(sections.length - 1, current + direction))
    if (next === current) return

    const tops = getSectionTops()
    event.preventDefault()
    window.scrollTo({ top: tops[next], behavior: 'smooth' })
    lockFor(700)
  }

  window.addEventListener('wheel', onWheel, { passive: false })
}

if (typeof window !== 'undefined') {
  setTimeout(initReveal, 120)
  setTimeout(initSectionScrollSnap, 140)
}
