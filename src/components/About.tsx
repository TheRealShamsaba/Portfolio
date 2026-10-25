import React from 'react'
import { useI18n } from '../i18n'

export default function About(): React.ReactElement {
  const { content, locale } = useI18n()
  const { about, avatar, role, name, email } = content.profile
  const copy = locale === 'fa'
    ? {
        label: 'معرفی / ۲۰۲۶',
        lineOne: 'محصول را می‌سازم،',
        lineTwo: 'سیستم پشت آن را،',
        lineThree: 'و داستان پیرامونش را.',
        intro: 'بنیان‌گذار و سازنده محصول مستقر در استانبول. کار من از معماری نرم‌افزار و هوش مصنوعی تا هویت، رسانه و عرضه عمومی امتداد دارد.',
        current: 'در حال حاضر',
        currentValue: 'ساخت Drip و شکل‌دادن Real Co.',
        practice: 'حوزه کار',
        practiceValue: 'محصول، مهندسی، برند و رسانه',
        base: 'موقعیت',
        baseValue: 'استانبول، همکاری جهانی',
        explore: 'دیدن کارهای فعلی',
        email: 'ارسال ایمیل'
      }
    : {
        label: 'PROFILE / 2026',
        lineOne: 'I build the product,',
        lineTwo: 'the system behind it,',
        lineThree: 'and the story around it.',
        intro: 'Founder and product builder based in Istanbul. My work moves from software architecture and applied AI to identity, media, and public launch.',
        current: 'Currently',
        currentValue: 'Building Drip and shaping Real Co.',
        practice: 'Practice',
        practiceValue: 'Product, engineering, brand, and media',
        base: 'Based',
        baseValue: 'Istanbul, working globally',
        explore: 'See current work',
        email: 'Email me'
      }

  return (
    <section id="about" className="index-hero reveal">
      <div className="index-hero-main reveal-item">
        <p className="index-label mixed-text" dir="auto">{copy.label}</p>
        <h1 className="index-statement mixed-text" dir="auto">
          <span>{copy.lineOne}</span>
          <span>{copy.lineTwo}</span>
          <span className="index-statement-accent">{copy.lineThree}</span>
        </h1>
        <p className="index-intro mixed-text" dir="auto">{copy.intro}</p>

        <dl className="index-facts">
          <div><dt>{copy.current}</dt><dd>{copy.currentValue}</dd></div>
          <div><dt>{copy.practice}</dt><dd>{copy.practiceValue}</dd></div>
          <div><dt>{copy.base}</dt><dd>{copy.baseValue}</dd></div>
        </dl>

        <div className="index-actions">
          <a href="#ventures">{copy.explore}<span>↓</span></a>
          <a href={`mailto:${email}`}>{copy.email}<span>↗</span></a>
        </div>
      </div>

      <aside className="index-portrait reveal-item">
        <div className="index-portrait-meta">
          <span className="latin-text">AS / IST</span>
          <span className="latin-text">41.0082° N</span>
        </div>
        <img src={avatar} alt={`${name}, ${role}`} />
        <div className="index-portrait-caption">
          <strong className="latin-text">{name}</strong>
          <span className="mixed-text" dir="auto">{role}</span>
        </div>
      </aside>
    </section>
  )
}
