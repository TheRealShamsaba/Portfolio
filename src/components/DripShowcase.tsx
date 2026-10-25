import React from 'react'
import { useI18n } from '../i18n'

export default function DripShowcase(): React.ReactElement {
  const { content, locale } = useI18n()
  const copy = locale === 'fa'
    ? {
        index: 'فهرست کسب‌وکارها',
        title: 'کارهای جاری',
        note: 'سه مسیر متصل؛ محصول، شرکت و رسانه. همه در مراحل متفاوت، همه با مشارکت مستقیم من در ساخت.',
        scope: 'حوزه', status: 'وضعیت', open: 'باز کردن'
      }
    : {
        index: 'VENTURE INDEX',
        title: 'Current work',
        note: 'Three connected tracks: product, company, and media. Different stages, with direct hands-on involvement in each.',
        scope: 'Scope', status: 'Status', open: 'Open'
      }

  return (
    <section id="ventures" className="venture-index reveal">
      <header className="venture-index-head reveal-item">
        <div>
          <p className="index-label mixed-text" dir="auto">{copy.index}</p>
          <h2 className="mixed-text" dir="auto">{copy.title}</h2>
        </div>
        <p className="mixed-text" dir="auto">{copy.note}</p>
      </header>

      <div className="venture-ledger">
        {content.ventures.map((venture, index) => (
          <article key={venture.id} className="venture-ledger-row reveal-item">
            <span className="venture-ledger-number latin-text">{String(index + 1).padStart(2, '0')}</span>
            <div className="venture-ledger-title">
              {venture.id === 'drip' ? <img src={content.drip.logo} alt="" /> : null}
              <h3 className="latin-text">{venture.name}</h3>
              <span className="mixed-text" dir="auto">{venture.statement}</span>
            </div>
            <p className="mixed-text" dir="auto">{venture.description}</p>
            <dl>
              <div><dt>{copy.status}</dt><dd>{venture.status}</dd></div>
              <div><dt>{copy.scope}</dt><dd>{venture.focus.slice(0, 2).join(' / ')}</dd></div>
            </dl>
            {venture.link ? (
              <a href={venture.link} target="_blank" rel="noreferrer" aria-label={`${copy.open} ${venture.name}`}>↗</a>
            ) : <span className="venture-ledger-null">—</span>}
          </article>
        ))}
      </div>
    </section>
  )
}
