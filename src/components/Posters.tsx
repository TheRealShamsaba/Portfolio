import React from 'react'
import { useI18n } from '../i18n'

function hexToRgba(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '')
  const safe = normalized.length === 3
    ? normalized.split('').map((c) => c + c).join('')
    : normalized

  const int = Number.parseInt(safe, 16)
  if (Number.isNaN(int) || safe.length !== 6) return `rgba(17, 24, 39, ${alpha})`

  const r = (int >> 16) & 255
  const g = (int >> 8) & 255
  const b = int & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const categoryTheme = {
  concept: { bgFrom: '#1b2431', bgTo: '#2e3f5a', glow: '#7aa4ff' },
  identity: { bgFrom: '#2d1f1d', bgTo: '#5b352f', glow: '#ffb38a' },
  media: { bgFrom: '#182b2b', bgTo: '#2e5552', glow: '#7ee8c6' },
  satire: { bgFrom: '#2a1e31', bgTo: '#4f3564', glow: '#c89bff' }
} as const

type PosterCategory = keyof typeof categoryTheme
type PosterFilter = PosterCategory | 'all'

const categoryOrder: PosterCategory[] = ['concept', 'identity', 'media', 'satire']

function parseCategoryFromQuery(): PosterFilter {
  if (typeof window === 'undefined') return 'all'

  const cat = new URLSearchParams(window.location.search).get('cat')
  if (!cat) return 'all'
  if (categoryOrder.includes(cat as PosterCategory)) return cat as PosterCategory
  return 'all'
}

export default function Posters(): React.ReactElement {
  const { content, t, localizedCategoryMeta } = useI18n()
  const posters = content.posters
  const [activeCategory, setActiveCategory] = React.useState<PosterFilter>(() => parseCategoryFromQuery())
  const [activePosterId, setActivePosterId] = React.useState<string | null>(null)

  const groups = [
    {
      key: 'concept' as const,
      title: t.categoryLabel.concept,
      subtitle: localizedCategoryMeta.concept.desc,
      display: t.categoryLabel.concept
    },
    {
      key: 'identity' as const,
      title: t.categoryLabel.identity,
      subtitle: localizedCategoryMeta.identity.desc,
      display: t.categoryLabel.identity
    },
    {
      key: 'media' as const,
      title: t.categoryLabel.media,
      subtitle: localizedCategoryMeta.media.desc,
      display: t.categoryLabel.media
    },
    {
      key: 'satire' as const,
      title: t.categoryLabel.satire,
      subtitle: localizedCategoryMeta.satire.desc,
      display: t.categoryLabel.satire
    }
  ]

  const filteredPosters = React.useMemo(
    () => (activeCategory === 'all' ? posters : posters.filter((p) => p.category === activeCategory)),
    [activeCategory, posters]
  )

  const activeIndex = filteredPosters.findIndex((p) => p.id === activePosterId)
  const activePoster = activeIndex >= 0 ? filteredPosters[activeIndex] : null

  const showPrev = React.useCallback(() => {
    if (!filteredPosters.length || activeIndex < 0) return
    const prev = (activeIndex - 1 + filteredPosters.length) % filteredPosters.length
    setActivePosterId(filteredPosters[prev].id)
  }, [activeIndex, filteredPosters])

  const showNext = React.useCallback(() => {
    if (!filteredPosters.length || activeIndex < 0) return
    const next = (activeIndex + 1) % filteredPosters.length
    setActivePosterId(filteredPosters[next].id)
  }, [activeIndex, filteredPosters])

  React.useEffect(() => {
    const onPopState = (): void => {
      setActiveCategory(parseCategoryFromQuery())
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (activeCategory === 'all') {
      params.delete('cat')
    } else {
      params.set('cat', activeCategory)
    }

    const nextSearch = params.toString()
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`
    window.history.replaceState({}, '', nextUrl)
  }, [activeCategory])

  React.useEffect(() => {
    if (!activePosterId) return
    if (!filteredPosters.some((poster) => poster.id === activePosterId)) {
      setActivePosterId(null)
    }
  }, [activePosterId, filteredPosters])

  React.useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.poster-deck-section .reveal-item')
    items.forEach((item) => item.classList.add('is-visible'))
  }, [activeCategory])

  React.useEffect(() => {
    if (!activePoster) return

    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setActivePosterId(null)
      if (event.key === 'ArrowLeft') showPrev()
      if (event.key === 'ArrowRight') showNext()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [activePoster, showNext, showPrev])

  return (
    <section id="posters" className="deck-section poster-deck-section reveal">
      <div className="section-shell poster-shell">
        <div className="poster-motion" aria-hidden="true">
          <span className="poster-orb poster-orb-a" />
          <span className="poster-orb poster-orb-b" />
          <span className="poster-orb poster-orb-c" />
          <span className="poster-grain" />
        </div>

        <div className="reveal-item mb-10">
          <p className="section-kicker">{t.postersKicker}</p>
          <h2>{t.postersTitle}</h2>
          <p className="max-w-2xl mt-3">
            {t.postersDesc}
          </p>
          <div className="poster-filter-bar mt-6">
            <button
              type="button"
              className={`poster-filter-btn ${activeCategory === 'all' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              {t.postersAll}
            </button>
            {categoryOrder.map((category) => {
              const label = t.categoryLabel[category]
              return (
                <button
                  key={category}
                  type="button"
                  className={`poster-filter-btn ${activeCategory === category ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(category)}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {groups.map((group) => {
          const groupItems = filteredPosters.filter((p) => p.category === group.key)
          if (!groupItems.length) return null

          return (
            <section key={group.key} className="poster-group reveal-item">
              <div className="poster-group-head mb-5">
                <div>
                  <p className="poster-group-display">{group.display}</p>
                  <h3 className="text-2xl text-gray-900">{group.title}</h3>
                  <p className="text-sm mt-1">{group.subtitle}</p>
                </div>
                <p className="poster-lane-hint">{t.postersScrollHint}</p>
              </div>

              <div className="poster-track">
                {groupItems.map((poster, index) => {
                  const theme = categoryTheme[poster.category as PosterCategory]
                  return (
                    <article
                      key={poster.id}
                      className="reveal-item poster-panel"
                      style={{
                        background: `radial-gradient(circle at 90% 8%, ${hexToRgba(theme.glow, 0.26)} 0%, transparent 40%), linear-gradient(145deg, ${hexToRgba(theme.bgFrom, 0.22)}, ${hexToRgba(theme.bgTo, 0.14)})`
                      }}
                    >
                      <span className="poster-panel-beam" aria-hidden="true" />
                      <div className="poster-panel-inner">
                        <button
                          type="button"
                          className="poster-frame poster-open-btn"
                          onClick={() => setActivePosterId(poster.id)}
                          aria-label={`Open ${poster.title}`}
                        >
                          <span
                            className="poster-stage-glow"
                            aria-hidden="true"
                            style={{ background: `radial-gradient(circle, ${hexToRgba(theme.glow, 0.5)} 0%, transparent 70%)` }}
                          />
                          <img
                            className="poster-image"
                            src={encodeURI(poster.image)}
                            alt={poster.title}
                            loading="lazy"
                            decoding="async"
                          />
                        </button>

                        <div className="poster-caption">
                          <p className="poster-index">{group.title} {String(index + 1).padStart(2, '0')}</p>
                          <h3 className="mb-2 text-gray-900">{poster.title}</h3>
                          <p className="text-sm text-gray-700 mb-4">{poster.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {poster.tags.map((tag) => (
                              <span key={tag} className="poster-chip">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {activePoster && (
        <div className="poster-lightbox" role="dialog" aria-modal="true" aria-label={activePoster.title}>
          <button
            type="button"
            className="poster-lightbox-close"
            onClick={() => setActivePosterId(null)}
            aria-label={t.closeViewer}
          >
            ×
          </button>

          <button
            type="button"
            className="poster-lightbox-nav poster-lightbox-prev"
            onClick={showPrev}
            aria-label={t.previousPoster}
          >
            ‹
          </button>

          <div className="poster-lightbox-stage">
            <img
              className="poster-lightbox-image"
              src={encodeURI(activePoster.image)}
              alt={activePoster.title}
            />
          </div>

          <aside className="poster-lightbox-meta">
            <p className="section-kicker mb-2">{t.categoryLabel[activePoster.category]}</p>
            <h3 className="text-2xl text-gray-900 mb-3">{activePoster.title}</h3>
            <p className="text-sm mb-4">{activePoster.description}</p>
            <p className="text-sm mb-4">{localizedCategoryMeta[activePoster.category].desc}</p>
            <div className="flex flex-wrap gap-2">
              {activePoster.tags.map((tag) => (
                <span key={tag} className="poster-chip">
                  {tag}
                </span>
              ))}
            </div>
          </aside>

          <button
            type="button"
            className="poster-lightbox-nav poster-lightbox-next"
            onClick={showNext}
            aria-label={t.nextPoster}
          >
            ›
          </button>

          <button
            type="button"
            className="poster-lightbox-backdrop"
            onClick={() => setActivePosterId(null)}
            aria-label={t.closeBackdrop}
          />
        </div>
      )}
    </section>
  )
}
