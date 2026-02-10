import React from 'react'
import { useI18n } from '../i18n'

export default function About(): React.ReactElement {
  const { content, t } = useI18n()
  const { about, avatar, role, intro, name } = content.profile
  const skills = content.skills

  return (
    <section id="about" className="deck-section reveal home-section">
      <div className="section-shell">
        <div className="soft-grid">
          <div className="col-span-12 lg:col-span-7 reveal-item">
            <p className="section-kicker">{t.introKicker}</p>
            <h1 className="mb-4">{name}</h1>
            <p className="text-xl text-gray-700 mb-6">{role}</p>
            <p className="text-lg max-w-2xl mb-8">{about}</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.title} className="badge">
                  {skill.title}
                </span>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 reveal-item">
            <div className="lift-card">
              <img
                className="w-full h-72 object-cover rounded-2xl"
                src={avatar}
                alt="profile"
              />
              <p className="text-sm mt-4">{intro}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
