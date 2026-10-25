import React from 'react'
import { scrollToId } from './motion'

// Minimal chrome: the mark, the name of the room you're in, and a way to write.
export default function Header({ title, onDark }: { title: string; onDark: () => void }): React.ReactElement {
  const go = (id: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    scrollToId(id)
  }

  return (
    <header className="site-header">
      <a href="#top" className="site-mark" onClick={go('top')} data-cursor="top">A.S.</a>
      <span className="site-room" aria-live="polite">
        <span key={title}>{title}</span>
      </span>
      <span className="site-end">
        {/* The way to the other side: a halo that grows horns when you hover it. */}
        <button type="button" className="side-toggle" onClick={onDark} aria-label="Go to the other side" data-cursor="moods">
          <svg viewBox="0 0 40 24" aria-hidden="true">
            <ellipse className="halo" cx="20" cy="8" rx="15" ry="4.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
            <path className="horns" d="M9 22c-3-6-2-13 3-18-1 6 1 10 5 13zM31 22c3-6 2-13-3-18 1 6-1 10-5 13z" fill="currentColor" />
          </svg>
          <span className="side-label">Other side</span>
        </button>
        <a href="#contact" className="site-write" onClick={go('contact')}>Write to me</a>
      </span>
    </header>
  )
}
