import React from 'react'
import { useI18n } from '../i18n'

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${parsed.pathname.replace('/', '')}`
    if (parsed.hostname.includes('youtube.com')) return `https://www.youtube.com/embed/${parsed.searchParams.get('v')}`
    if (parsed.hostname.includes('spotify.com')) {
      const parts = parsed.pathname.split('/').filter(Boolean)
      return `https://open.spotify.com/embed/${parts[0]}/${parts[1]}`
    }
  } catch { return null }
  return null
}

export default function Podcast(): React.ReactElement {
  const { content, locale } = useI18n()
  const podcast = content.podcast
  const episodeUrl = podcast.latestEpisodeUrl ?? podcast.listenLink
  const embedUrl = getEmbedUrl(episodeUrl)
  const copy = locale === 'fa'
    ? { kicker: 'صدا و دیدگاه', title: 'فقط محصول نمی‌سازم. ایده‌ها را هم منتشر می‌کنم.', watch: 'دیدن آخرین قسمت', note: 'استقلال فکری بخشی از کار است.' }
    : { kicker: 'VOICE & POINT OF VIEW', title: 'I don’t only build products. I publish ideas.', watch: 'Watch the latest episode', note: 'Independent thinking is part of the work.' }

  return (
    <section id="podcast" className="exec-section exec-voice reveal">
      <div className="voice-copy reveal-item">
        <p className="exec-kicker mixed-text" dir="auto">{copy.kicker}</p>
        <h2 className="mixed-text" dir="auto">{copy.title}</h2>
        <p className="voice-description mixed-text" dir="auto">{podcast.desc}</p>
        <blockquote className="mixed-text" dir="auto">“{copy.note}”</blockquote>
        <a href={episodeUrl} target="_blank" rel="noreferrer" className="exec-button exec-button-light">
          {copy.watch}<span>↗</span>
        </a>
      </div>
      <div className="voice-media reveal-item">
        <div className="voice-label">
          <span className="latin-text">THE REASONABLE SHOW</span>
          <span className="latin-text">EST. ISTANBUL</span>
        </div>
        {embedUrl ? (
          <iframe title={podcast.latestEpisodeTitle} src={embedUrl} allow="autoplay; encrypted-media; fullscreen; picture-in-picture" loading="lazy" />
        ) : null}
      </div>
    </section>
  )
}
