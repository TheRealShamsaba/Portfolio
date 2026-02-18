import React from 'react'
import { useI18n } from '../i18n'

export default function HomePostersPreview(): React.ReactElement {
  const { content, t, locale } = useI18n()
  const featured = React.useMemo(
    () => [...content.posters].reverse().slice(0, 6),
    [content.posters]
  )
  const langQuery = locale === 'fa' ? '?lang=fa' : ''

  return (
    <section id="posters-preview" className="deck-section reveal home-section">
      <div className="section-shell">
        <div className="reveal-item mb-8 home-preview-head">
          <div>
            <p className="section-kicker">{t.posterPreviewKicker}</p>
            <h2>{t.posterPreviewTitle}</h2>
            <p className="mt-3 max-w-2xl">
              {t.posterPreviewDesc}
            </p>
          </div>
          <a href={`/showcase${langQuery}`} className="btn btn-primary text-sm">{t.seeAllPosters}</a>
        </div>

        <div className="home-posters-grid">
          {featured.map((poster) => (
            <article key={poster.id} className="reveal-item home-poster-tile">
              <img
                className="home-poster-image"
                src={encodeURI(poster.image)}
                alt={poster.title}
                loading="lazy"
                decoding="async"
              />
              <div className="home-poster-copy">
                <p className="text-xs uppercase tracking-[0.14em] text-gray-500">{t.categoryLabel[poster.category]}</p>
                <h3 className="text-lg mt-1">{poster.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
