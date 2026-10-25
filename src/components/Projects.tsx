import React from 'react'
import { useI18n } from '../i18n'

const proofMeta = [
  { number: '01', result: 'Live brand experience', detail: 'Fashion / product / web' },
  { number: '02', result: 'Multilingual platform', detail: 'Automotive / operations / web' }
]

export default function Projects(): React.ReactElement {
  const { content, locale } = useI18n()
  const sites = content.featuredSites
  const projects = content.projects.filter((project) => project.id !== 5).slice(0, 4)
  const copy = locale === 'fa'
    ? {
        kicker: 'شواهد اجرا', title: 'کارهایی که ایده را واقعی کردند.',
        lead: 'محصولات زنده، سیستم‌های فنی، و خروجی‌هایی که نشان می‌دهند می‌توانم بین استراتژی و اجرا حرکت کنم.',
        open: 'باز کردن سایت', lab: 'آزمایشگاه فنی', labTitle: 'عمق فنی پشت کار.', labLead: 'هوش مصنوعی کاربردی، سیستم‌ها و پروژه‌هایی برای فهم مسئله‌های سخت از داخل.', view: 'مشاهده پروژه'
      }
    : {
        kicker: 'PROOF OF EXECUTION', title: 'Work that made the idea real.',
        lead: 'Live products, technical systems, and public outcomes that show I can move between strategy and the details required to ship.',
        open: 'Open live site', lab: 'THE TECHNICAL LAB', labTitle: 'Technical depth behind the work.', labLead: 'Applied AI, systems, and experiments built to understand difficult problems from the inside.', view: 'View project'
      }

  return (
    <section id="projects" className="exec-section exec-work reveal">
      <div className="exec-section-head reveal-item">
        <div>
          <p className="exec-kicker mixed-text" dir="auto">{copy.kicker}</p>
          <h2 className="mixed-text" dir="auto">{copy.title}</h2>
        </div>
        <p className="mixed-text" dir="auto">{copy.lead}</p>
      </div>

      <div className="proof-list">
        {sites.map((site, index) => (
          <article key={site.id} className="proof-card reveal-item">
            <a href={site.liveUrl} target="_blank" rel="noreferrer" className="proof-image-wrap">
              <img src={site.image} alt={`${site.title} website`} loading="lazy" />
              <span className="proof-open">{copy.open} ↗</span>
            </a>
            <div className="proof-copy">
              <div className="proof-number latin-text">{proofMeta[index]?.number ?? `0${index + 1}`}</div>
              <div className="proof-meta">
                <span className="latin-text">{site.year}</span>
                <span className="mixed-text" dir="auto">{site.role}</span>
              </div>
              <h3 className="latin-text">{site.title}</h3>
              <p className="mixed-text" dir="auto">{site.summary}</p>
              <ul>
                {site.highlights.slice(0, 3).map((item) => <li key={item} className="mixed-text" dir="auto">{item}</li>)}
              </ul>
              <div className="proof-outcome">
                <span>{proofMeta[index]?.result}</span>
                <strong>{proofMeta[index]?.detail}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="technical-lab reveal-item">
        <div className="technical-head">
          <p className="exec-kicker">{copy.lab}</p>
          <h3 className="mixed-text" dir="auto">{copy.labTitle}</h3>
          <p className="mixed-text" dir="auto">{copy.labLead}</p>
        </div>
        <div className="technical-grid">
          {projects.map((project, index) => (
            <a key={project.id} href={project.link} target="_blank" rel="noreferrer" className="technical-card">
              <span className="technical-index latin-text">{String(index + 1).padStart(2, '0')}</span>
              <h4 className="mixed-text" dir="auto">{project.title}</h4>
              <p className="mixed-text" dir="auto">{project.desc}</p>
              <div>{project.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
              <strong>{copy.view} ↗</strong>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
