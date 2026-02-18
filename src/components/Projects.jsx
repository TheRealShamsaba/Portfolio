import React from 'react'

const sampleProjects = [
  { id: 1, title: 'Sensor Hub', desc: 'Embedded systems project for data collection', link: '#', tags:['C','STM32','RTOS'] },
  { id: 2, title: 'Web App', desc: 'Full-stack web app demonstrating algorithms', link: '#', tags:['React','Node','DB'] }
]

export default function Projects() {
  return (
    <section id="projects" className="section">
      <div className="container">
        <h2>Coding Projects</h2>
        <p>Selected engineering projects — hardware, firmware, and web development.</p>
        <div className="grid">
          {sampleProjects.map((p, idx) => (
            <article key={p.id} className="card reveal-item">
              <h3>{p.title}</h3>
              <p className="meta">{p.desc}</p>
              <div className="tags">
                {p.tags.map(t => <span className="tag" key={t}>{t}</span>)}
              </div>
              <a className="button" href={p.link}>View</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
