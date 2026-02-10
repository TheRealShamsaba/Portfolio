import React from 'react'
import { portfolioContent } from '../content'

export default function Contact(): React.ReactElement {
  const { email, telegram, whatsapp } = portfolioContent.profile

  return (
    <section id="contact" className="deck-section reveal home-section">
      <div className="section-shell">
        <p className="section-kicker reveal-item">CONTACT</p>
        <h2 className="reveal-item mb-4">Let’s Build Something Good</h2>
        <p className="reveal-item text-lg mb-10 max-w-2xl">
          If you think my style fits your team or project, message me. I’m always open to real work and good collaborations.
        </p>

        <div className="reveal-item flex flex-col sm:flex-row gap-4">
          <a href={`mailto:${email}`} className="btn btn-primary">
            Send Me an Email
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
