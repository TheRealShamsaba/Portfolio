import React from 'react'
import { portfolioContent } from '../content'

export default function HomePostersPreview(): React.ReactElement {
  const featured = portfolioContent.posters.slice(0, 6)

  return (
    <section id="posters-preview" className="deck-section reveal home-section">
      <div className="section-shell">
        <div className="reveal-item mb-8 home-preview-head">
          <div>
            <p className="section-kicker">POSTER PREVIEW</p>
            <h2>A few selected pieces</h2>
            <p className="mt-3 max-w-2xl">
              A quick sample from my full poster archive. For the full categorized showcase, open the posters page.
            </p>
          </div>
          <a href="/showcase" className="btn btn-primary text-sm">See All Posters</a>
        </div>

        <div className="home-posters-grid">
          {featured.map((poster) => (
            <article key={poster.id} className="reveal-item home-poster-tile">
              <img className="home-poster-image" src={encodeURI(poster.image)} alt={poster.title} />
              <div className="home-poster-copy">
                <p className="text-xs uppercase tracking-[0.14em] text-gray-500">{poster.category}</p>
                <h3 className="text-lg mt-1">{poster.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
