import React from 'react'
import Header from './components/Header'
import About from './components/About'
import HomePostersPreview from './components/HomePostersPreview'
import CaseStudies from './components/CaseStudies'
import Projects from './components/Projects'
import Podcast from './components/Podcast'
import Contact from './components/Contact'
import { I18nProvider, useI18n } from './i18n'

const Posters = React.lazy(async () => import('./components/Posters'))

export default function App(): React.ReactElement {
  return (
    <I18nProvider>
      <AppShell />
    </I18nProvider>
  )
}

function AppShell(): React.ReactElement {
  const { content, t } = useI18n()
  const { name } = content.profile
  const isPostersPage = typeof window !== 'undefined' && window.location.pathname.startsWith('/showcase')

  return (
    <div className="min-h-screen font-poppins app-root">
      <Header isPostersPage={isPostersPage} />
      {isPostersPage ? (
        <main className="deck">
          <React.Suspense
            fallback={(
              <section className="deck-section">
                <div className="section-shell">
                  <p className="section-kicker">{t.loading}</p>
                  <h2>{t.loadingPosters}</h2>
                </div>
              </section>
            )}
          >
            <Posters />
          </React.Suspense>
        </main>
      ) : (
        <main className="deck home-main">
          <div className="home-ambient" aria-hidden="true">
            <span className="home-orb home-orb-a" />
            <span className="home-orb home-orb-b" />
            <span className="home-orb home-orb-c" />
            <span className="home-grid" />
          </div>
          <About />
          <HomePostersPreview />
          <CaseStudies />
          <Projects />
          <Podcast />
          <Contact />
        </main>
      )}
      <footer className="py-8 px-4 text-center text-sm footer-note">
        © {new Date().getFullYear()} {name} - {t.footerBuiltWith}
      </footer>
    </div>
  )
}
