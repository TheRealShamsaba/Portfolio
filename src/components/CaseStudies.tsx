import React from 'react'
import { portfolioContent } from '../content'

export default function CaseStudies(): React.ReactElement {
  const caseStudies = portfolioContent.caseStudies

  return (
    <section id="case-studies" className="deck-section reveal home-section">
      <div className="section-shell">
        <div className="reveal-item mb-10">
          <p className="section-kicker">CASE STUDIES</p>
          <h2>How I Build</h2>
          <p className="mt-3 max-w-2xl">
            Two focused examples that show my process from problem to shipped implementation.
          </p>
        </div>

        <div className="case-grid">
          {caseStudies.map((item) => (
            <article key={item.id} className="reveal-item case-card">
              <p className="case-label">{String(item.id).padStart(2, '0')}</p>
              <h3 className="mb-5">{item.title}</h3>

              <div className="case-row">
                <p className="case-row-title">Problem</p>
                <p>{item.problem}</p>
              </div>

              <div className="case-row">
                <p className="case-row-title">Built</p>
                <p>{item.built}</p>
              </div>

              <div className="case-row">
                <p className="case-row-title">Stack</p>
                <div className="flex flex-wrap gap-2">
                  {item.stack.map((tech) => (
                    <span key={tech} className="badge">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="case-row mb-6">
                <p className="case-row-title">Result</p>
                <p>{item.result}</p>
              </div>

              <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-primary text-sm inline-block">
                Open Repository
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
