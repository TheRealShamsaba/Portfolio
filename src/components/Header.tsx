import React from 'react'
import { portfolioContent } from '../content'

interface HeaderProps {
  isPostersPage?: boolean
}

export default function Header({ isPostersPage = false }: HeaderProps): React.ReactElement {
  const { name, avatar } = portfolioContent.profile
  const homePrefix = isPostersPage ? '/' : ''

  return (
    <header className="sticky top-0 z-50 site-header">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            className="w-10 h-10 rounded-full border border-gray-300"
            src={avatar}
            alt={`${name} avatar`}
          />
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-gray-500">Portfolio</p>
            <p className="text-base font-semibold text-gray-900 leading-none">{name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-7">
          <nav className="hidden md:flex gap-5">
            <a href={`${homePrefix}#about`} className="nav-link">
              About
            </a>
            <a href="/showcase" className="nav-link">
              Posters
            </a>
            <a href={`${homePrefix}#case-studies`} className="nav-link">
              Work
            </a>
            <a href={`${homePrefix}#podcast`} className="nav-link">
              Podcast
            </a>
          </nav>
          <a
            href={`${homePrefix}#contact`}
            className="btn btn-secondary text-sm"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  )
}
