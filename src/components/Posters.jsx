import React from 'react'

const samplePosters = [
  { id: 1, title: 'Poster One', desc: 'Event poster design', img: '/src/assets/placeholder.jpg', tags:['Event','Print'] },
  { id: 2, title: 'Poster Two', desc: 'Movie poster concept', img: '/src/assets/placeholder.jpg', tags:['Concept','Studio'] }
]

export default function Posters() {
  return (
    <section id="posters" className="section">
      <div className="container">
        <h2>Posters</h2>
        <p>Poster designs and visual work — a selection of print and digital pieces.</p>
        <div className="grid">
          {samplePosters.map((p, idx) => (
            <article key={p.id} className="card reveal-item">
              <div className="thumb" style={{backgroundImage:`url(${p.img})`}} />
              <h3>{p.title}</h3>
              <p className="meta">{p.desc}</p>
              <div className="tags">
                {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
