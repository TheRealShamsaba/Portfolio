import React from 'react'
import { useI18n } from '../i18n'

export default function OperatingPrinciples(): React.ReactElement {
  const { locale } = useI18n()
  const copy = locale === 'fa'
    ? {
        label: 'روش کار', title: 'اصولی که در کار دنبال می‌کنم.',
        items: [
          ['01', 'مالکیت کامل', 'برای خروجی مسئولم، نه فقط بخشی که به من واگذار شده.'],
          ['02', 'وضوح پیش از سرعت', 'مسئله درست و روایت روشن، سرعت واقعی را ایجاد می‌کنند.'],
          ['03', 'سیستم، نه نمایش', 'محصول خوب در سطح رابط، زیرساخت و عملیات با هم کار می‌کند.'],
          ['04', 'سلیقه همراه با شواهد', 'استاندارد بصری باید تصمیم‌گیری را بهتر کند، نه فقط ظاهر را.']
        ]
      }
    : {
        label: 'OPERATING PRINCIPLES', title: 'How I approach the work.',
        items: [
          ['01', 'Own the whole outcome', 'I take responsibility for what ships, not only the part assigned to me.'],
          ['02', 'Clarity creates speed', 'The right problem and a clear narrative remove more friction than urgency does.'],
          ['03', 'Build systems, not demos', 'A serious product works across interface, infrastructure, and operations.'],
          ['04', 'Taste needs evidence', 'Visual standards should improve decisions—not exist only for decoration.']
        ]
      }

  return (
    <section className="principles reveal">
      <div className="principles-head reveal-item">
        <p className="index-label mixed-text" dir="auto">{copy.label}</p>
        <h2 className="mixed-text" dir="auto">{copy.title}</h2>
      </div>
      <div className="principles-grid">
        {copy.items.map(([number, title, description]) => (
          <article key={number} className="reveal-item">
            <span className="latin-text">{number}</span>
            <h3 className="mixed-text" dir="auto">{title}</h3>
            <p className="mixed-text" dir="auto">{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
