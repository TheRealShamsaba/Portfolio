import React from 'react'

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="hero reveal">
          <div className="profile card reveal-item">
            <img className="big-avatar" src="/src/assets/placeholder.jpg" alt="profile" />
          </div>
          <div className="intro reveal-item">
            <h2>Hi — I'm Your Name</h2>
            <p>
              I'm a computer engineering student who loves building things that people use.
              I design posters, develop embedded and web projects, and host a podcast about
              engineering and creativity.
            </p>
            <div className="chips">
              <span className="chip">Embedded Systems</span>
              <span className="chip">Web Dev</span>
              <span className="chip">Graphic Design</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
