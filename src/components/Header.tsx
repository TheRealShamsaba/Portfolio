import React from 'react'
import { useI18n } from '../i18n'

interface HeaderProps {
  isPostersPage?: boolean
}

export default function Header({ isPostersPage = false }: HeaderProps): React.ReactElement {
  const { locale, setLocale, t, content } = useI18n()
  const { name, avatar } = content.profile
  const homePrefix = isPostersPage ? '/' : ''
  const langQuery = locale === 'fa' ? '?lang=fa' : ''
  const showcaseHref = `/showcase${langQuery}`

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
            <p className="text-sm uppercase tracking-[0.18em] text-gray-500">{t.brand}</p>
            <p className="text-base font-semibold text-gray-900 leading-none">{name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-7">
          <nav className="hidden md:flex gap-5">
            <a href={`${homePrefix}#about`} className="nav-link">
              {t.navAbout}
            </a>
            <a href={showcaseHref} className="nav-link">
              {t.navPosters}
            </a>
            <a href={`${homePrefix}#case-studies`} className="nav-link">
              {t.navWork}
            </a>
            <a href={`${homePrefix}#podcast`} className="nav-link">
              {t.navPodcast}
            </a>
          </nav>
          <button
            type="button"
            className="btn btn-secondary text-sm"
            onClick={() => setLocale(locale === 'en' ? 'fa' : 'en')}
          >
            {t.langToggle}
          </button>
          <a
            href={`${homePrefix}#contact`}
            className="btn btn-secondary text-sm"
          >
            {t.navContact}
          </a>
        </div>
      </div>
    </header>
  )
}
