import React from 'react'

export default function Podcast() {
  return (
    <section id="podcast" className="section">
      <div className="container">
        <h2>Podcast</h2>
        <p>
          I host a podcast where I talk about engineering, design, and creativity. Listen on your favorite platform.
        </p>
        <div className="card podcast-card reveal-item">
          <div className="play">▶</div>
          <div>
            <h3>Featured episode: Getting started with embedded systems</h3>
            <p className="meta">A short intro to embedded systems — hardware, toolchains, and practical tips.</p>
            <p style={{marginTop:8}}>
              <a href="#" className="button">Listen</a>
              <span style={{marginLeft:10,color:'var(--muted)'}}>• Spotify • Apple Podcasts • YouTube</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
