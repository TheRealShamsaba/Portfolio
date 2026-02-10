import React from 'react'
import { portfolioContent } from '../content'

function getEmbedUrl(url: string): string | null {
  if (!url || url === '#') return null

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace('www.', '')

    if (host === 'open.spotify.com') {
      const parts = parsed.pathname.split('/').filter(Boolean)
      if (parts.length >= 2 && (parts[0] === 'episode' || parts[0] === 'show')) {
        return `https://open.spotify.com/embed/${parts[0]}/${parts[1]}`
      }
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const videoId = parsed.searchParams.get('v')
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.replace('/', '')
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
    }
  } catch {
    return null
  }

  return null
}

export default function Podcast(): React.ReactElement {
  const podcast = portfolioContent.podcast
  const latestEpisodeUrl = podcast.latestEpisodeUrl ?? podcast.listenLink
  const embedUrl = getEmbedUrl(latestEpisodeUrl)

  return (
    <section id="podcast" className="deck-section reveal home-section">
      <div className="section-shell">
        <div className="reveal-item mb-10">
          <p className="section-kicker">VOICE</p>
          <h2>Podcast</h2>
        </div>

        <div className="reveal-item lift-card podcast-card">
          <h3 className="mb-2">{podcast.title}</h3>
          <p className="mb-5 podcast-copy">{podcast.desc}</p>

          {embedUrl ? (
            <div className="mb-5 podcast-player-wrap">
              <iframe
                title={podcast.latestEpisodeTitle ?? 'Latest episode player'}
                src={embedUrl}
                className="podcast-player"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="mb-5 rounded-xl border border-dashed border-gray-300 bg-white/60 p-4">
              <p className="text-sm">
                Add `latestEpisodeUrl` in `src/content.ts` to show the embedded latest episode player.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-4 items-center podcast-actions">
            <a href={latestEpisodeUrl} className="btn btn-primary text-sm">
              Listen to Latest Episode
            </a>
            <span className="text-sm">{podcast.platforms}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
