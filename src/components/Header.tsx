import React from 'react'
import { useI18n } from '../i18n'

interface HeaderProps {
  isPostersPage?: boolean
}

export default function Header({ isPostersPage = false }: HeaderProps): React.ReactElement {
  const { locale, setLocale, content } = useI18n()
  const homePrefix = isPostersPage ? '/' : ''
  const langQuery = locale === 'fa' ? '?lang=fa' : ''
  const label = locale === 'fa'
    ? { map: 'نقشه فعالیت', work: 'مدارک', voice: 'رسانه', contact: 'تماس', current: 'اکنون' }
    : { map: 'Working map', work: 'Evidence', voice: 'Notes & voice', contact: 'Contact', current: 'Current focus' }

  return (
    <header className={`site-header exec-header ${isPostersPage ? 'is-showcase' : ''}`}>
      <div className="exec-nav-shell">
        <a href="/" className="exec-brand" aria-label="Arian Shamsabadi home">
          <span className="exec-brand-mark latin-text">AS</span>
          <span className="exec-brand-copy">
            <strong className="latin-text">Arian Shamsabadi</strong>
            <small className="mixed-text" dir="auto">Founder &amp; product builder</small>
          </span>
        </a>

        <nav className="exec-nav-links" aria-label="Primary navigation">
          <a href={`${homePrefix}#about`}><span>01</span>{label.map}</a>
          <a href={`${homePrefix}#projects`}><span>02</span>{label.work}</a>
          <a href={`${homePrefix}#podcast`}><span>03</span>{label.voice}</a>
          <a href={`/showcase${langQuery}`}><span>04</span>Visual archive</a>
        </nav>

        <div className="exec-rail-status">
          <span className="mixed-text" dir="auto">{label.current}</span>
          <strong className="latin-text">Drip / Real Co.</strong>
          <small className="latin-text">Istanbul, Türkiye</small>
        </div>

        <div className="exec-nav-actions">
          <button type="button" className="exec-lang" onClick={() => setLocale(locale === 'en' ? 'fa' : 'en')}>
            {locale === 'en' ? 'FA' : 'EN'}
          </button>
          <a href={`${homePrefix}#contact`} className="exec-contact-link">
            {label.contact}<span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </header>
  )
}
