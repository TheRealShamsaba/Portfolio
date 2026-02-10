import React from 'react'
import { useI18n } from '../i18n'

export default function Projects(): React.ReactElement {
  const { content, t } = useI18n()
  const projects = content.projects

  return (
    <section id="projects" className="deck-section reveal home-section">
      <div className="section-shell">
        <div className="reveal-item mb-10">
          <p className="section-kicker">{t.projectsKicker}</p>
          <h2>{t.projectsTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {projects.map(p => (
            <article key={p.id} className="reveal-item lift-card">
              <h3 className="mb-2">{p.title}</h3>
              <p className="mb-4">{p.desc}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {p.tags.map(t => (
                  <span key={t} className="badge">
                    {t}
                  </span>
                ))}
              </div>
              <a href={p.link} className="btn btn-primary text-sm inline-block">
                {t.viewProject}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
