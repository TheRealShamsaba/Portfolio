import React from 'react'
import { useI18n } from '../i18n'

export default function Contact(): React.ReactElement {
  const { content, locale } = useI18n()
  const { email, telegram, whatsapp, socialLink } = content.profile
  const copy = locale === 'fa'
    ? {
        kicker: 'گفتگوی بعدی', titleA: 'اگر آینده‌ای را می‌بینی', titleB: 'که ارزش ساختن دارد،', titleC: 'بیا درباره‌اش حرف بزنیم.',
        note: 'برای گفتگو با بنیان‌گذاران، مدیران و تیم‌هایی که محصولات بلندپروازانه می‌سازند.', email: 'ارسال ایمیل', direct: 'راه‌های مستقیم', location: 'استانبول / آماده برای همکاری جهانی'
      }
    : {
        kicker: 'THE NEXT CONVERSATION', titleA: 'If you see a future', titleB: 'worth building,', titleC: 'let’s talk about it.',
        note: 'Open to conversations with founders, operators, and teams building ambitious products.', email: 'Send an email', direct: 'Direct channels', location: 'Istanbul / working globally'
      }

  return (
    <section id="contact" className="exec-contact reveal">
      <div className="contact-marquee" aria-hidden="true">
        <span>BUILD WITH INTENT • BUILD WITH INTENT • BUILD WITH INTENT •</span>
      </div>
      <div className="exec-contact-shell">
        <div className="exec-contact-copy reveal-item">
          <p className="exec-kicker mixed-text" dir="auto">{copy.kicker}</p>
          <h2 className="mixed-text" dir="auto">
            <span>{copy.titleA}</span><span className="exec-outline-light">{copy.titleB}</span><span>{copy.titleC}</span>
          </h2>
          <p className="mixed-text" dir="auto">{copy.note}</p>
        </div>
        <div className="exec-contact-panel reveal-item">
          <span className="contact-panel-label mixed-text" dir="auto">{copy.direct}</span>
          <a className="contact-email latin-text" href={`mailto:${email}`}>{email}<span>↗</span></a>
          <div className="contact-socials">
            <a href={socialLink} target="_blank" rel="noreferrer">GitHub ↗</a>
            <a href={telegram} target="_blank" rel="noreferrer">Telegram ↗</a>
            <a href={whatsapp} target="_blank" rel="noreferrer">WhatsApp ↗</a>
          </div>
          <div className="contact-location"><i /><span className="mixed-text" dir="auto">{copy.location}</span></div>
        </div>
      </div>
    </section>
  )
}
