import React from 'react'
import { useI18n } from '../i18n'

export default function CaseStudies(): React.ReactElement {
  const { content, t } = useI18n()
  const caseStudies = content.caseStudies

  return (
    <section id="case-studies" className="deck-section reveal home-section">
      <div className="section-shell">
        <div className="reveal-item mb-10">
          <p className="section-kicker">{t.caseStudiesKicker}</p>
          <h2>{t.caseStudiesTitle}</h2>
          <p className="mt-3 max-w-2xl">
            {t.caseStudiesDesc}
          </p>
        </div>

        <div className="case-grid">
          {caseStudies.map((item) => (
            <article key={item.id} className="reveal-item case-card">
              <p className="case-label">{String(item.id).padStart(2, '0')}</p>
              <h3 className="mb-5">{item.title}</h3>

              <div className="case-row">
                <p className="case-row-title">{t.caseProblem}</p>
                <p>{item.problem}</p>
              </div>

              <div className="case-row">
                <p className="case-row-title">{t.caseBuilt}</p>
                <p>{item.built}</p>
              </div>

              <div className="case-row">
                <p className="case-row-title">{t.caseStack}</p>
                <div className="flex flex-wrap gap-2">
                  {item.stack.map((tech) => (
                    <span key={tech} className="badge">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="case-row mb-6">
                <p className="case-row-title">{t.caseResult}</p>
                <p>{item.result}</p>
              </div>

              <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-primary text-sm inline-block">
                {t.openRepo}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
