import React from 'react'
import { useI18n } from '../i18n'

export default function Contact(): React.ReactElement {
  const { content, t } = useI18n()
  const { email, telegram, whatsapp } = content.profile

  return (
    <section id="contact" className="deck-section reveal home-section">
      <div className="section-shell">
        <p className="section-kicker reveal-item">{t.contactKicker}</p>
        <h2 className="reveal-item mb-4">{t.contactTitle}</h2>
        <p className="reveal-item text-lg mb-10 max-w-2xl">
          {t.contactDesc}
        </p>

        <div className="reveal-item flex flex-col sm:flex-row gap-4">
          <a href={`mailto:${email}`} className="btn btn-primary">
            {t.sendEmail}
          </a>
          <a href={telegram} target="_blank" rel="noreferrer" className="btn btn-secondary">
            Telegram
          </a>
          <a href={whatsapp} target="_blank" rel="noreferrer" className="btn btn-secondary">
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
