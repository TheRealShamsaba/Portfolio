import React from 'react'
import { useI18n } from '../i18n'

export default function FounderMap(): React.ReactElement {
  const { content, locale } = useI18n()
  const [activeId, setActiveId] = React.useState(content.ventures[0].id)
  const active = content.ventures.find((venture) => venture.id === activeId) ?? content.ventures[0]
  const copy = locale === 'fa'
    ? {
        index: 'نقشه فعالیت / ۲۰۲۶',
        instruction: 'برای دیدن جزئیات، یک مسیر را انتخاب کنید.',
        center: 'بنیان‌گذار و سازنده محصول',
        dossier: 'پرونده فعال',
        status: 'وضعیت',
        scope: 'دامنه',
        open: 'باز کردن پروژه',
        principles: ['مالکیت کامل', 'وضوح پیش از سرعت', 'سیستم به‌جای نمایش', 'سلیقه همراه با شواهد']
      }
    : {
        index: 'WORKING MAP / 2026',
        instruction: 'Select a track to inspect the work.',
        center: 'Founder & product builder',
        dossier: 'Active dossier',
        status: 'Status',
        scope: 'Scope',
        open: 'Open project',
        principles: ['Own the outcome', 'Clarity creates speed', 'Systems over demos', 'Taste needs evidence']
      }

  return (
    <section id="about" className="founder-map reveal">
      <header className="founder-map-head reveal-item">
        <p className="index-label mixed-text" dir="auto">{copy.index}</p>
        <p className="mixed-text" dir="auto">{copy.instruction}</p>
        <span className="latin-text">41.0082° N / 28.9784° E</span>
      </header>

      <div className="founder-map-stage">
        <svg className="founder-map-lines" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
          <path d="M500 348 L190 142" />
          <path d="M500 348 L820 148" />
          <path d="M500 348 L170 560" />
          <path d="M500 348 L815 565" />
          <circle cx="500" cy="348" r="118" />
          <circle cx="500" cy="348" r="184" />
        </svg>

        <div className="founder-core reveal-item">
          <div className="founder-core-image">
            <img src={content.profile.avatar} alt={content.profile.name} />
          </div>
          <p className="latin-text">{content.profile.name}</p>
          <span className="mixed-text" dir="auto">{copy.center}</span>
        </div>

        {content.ventures.map((venture, index) => (
          <button
            key={venture.id}
            type="button"
            className={`founder-map-node founder-map-node-${index + 1} ${active.id === venture.id ? 'is-active' : ''}`}
            onClick={() => setActiveId(venture.id)}
            aria-pressed={active.id === venture.id}
          >
            <span className="latin-text">0{index + 1}</span>
            <strong className="latin-text">{venture.name}</strong>
            <small className="mixed-text" dir="auto">{venture.status}</small>
          </button>
        ))}

        <button
          type="button"
          className="founder-map-node founder-map-node-4 founder-map-node-lab"
          onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <span className="latin-text">04</span>
          <strong className="latin-text">Technical Lab</strong>
          <small className="latin-text">AI / systems / experiments</small>
        </button>

        <aside className="founder-dossier reveal-item" aria-live="polite">
          <div className="founder-dossier-head">
            <span className="mixed-text" dir="auto">{copy.dossier}</span>
            <strong className="latin-text">{active.name}</strong>
          </div>
          <h1 className="mixed-text" dir="auto">{active.statement}</h1>
          <p className="mixed-text" dir="auto">{active.description}</p>
          <dl>
            <div><dt>{copy.status}</dt><dd>{active.status}</dd></div>
            <div><dt>{copy.scope}</dt><dd>{active.focus.join(' / ')}</dd></div>
          </dl>
          {active.link ? (
            <a href={active.link} target="_blank" rel="noreferrer">{copy.open}<span>↗</span></a>
          ) : <span className="founder-dossier-private">Positioning in progress</span>}
        </aside>
      </div>

      <div className="founder-map-principles reveal-item">
        <span className="index-label">OPERATING CODE</span>
        {copy.principles.map((principle, index) => (
          <span key={principle} className="mixed-text" dir="auto"><i>0{index + 1}</i>{principle}</span>
        ))}
      </div>
    </section>
  )
}
