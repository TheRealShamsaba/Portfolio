import React from 'react'
import { useI18n } from '../i18n'

export default function HomePostersPreview(): React.ReactElement {
  const { content, t, locale } = useI18n()
  const featured = React.useMemo(
    () => {
      const byId = new Map(content.posters.map((poster) => [poster.id, poster]))
      return (content.homePosterIds ?? [])
        .map((id) => byId.get(id))
        .filter((poster): poster is NonNullable<typeof poster> => Boolean(poster))
    },
    [content.homePosterIds, content.posters]
  )
  const langQuery = locale === 'fa' ? '?lang=fa' : ''

  return (
    <section id="posters-preview" className="deck-section reveal home-section visual-section">
      <div className="visual-shell">
        <div className="reveal-item mb-8 home-preview-head">
          <div>
            <p className="section-kicker mixed-text" dir="auto">{t.posterPreviewKicker}</p>
            <h2 className="mixed-text" dir="auto">{t.posterPreviewTitle}</h2>
            <p className="mt-3 max-w-2xl mixed-text" dir="auto">
              {t.posterPreviewDesc}
            </p>
          </div>
          <a href={`/showcase${langQuery}`} className="btn btn-primary text-sm">
            <span className="mixed-text" dir="auto">{t.seeAllPosters}</span>
          </a>
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
                <p className="text-xs uppercase tracking-[0.14em] text-gray-500 mixed-text" dir="auto">{t.categoryLabel[poster.category]}</p>
                <h3 className="text-lg mt-1 mixed-text" dir="auto">{poster.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
