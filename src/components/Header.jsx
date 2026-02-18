import React from 'react'

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner reveal">
        <div className="brand">
          <img className="avatar" src="/src/assets/placeholder.jpg" alt="avatar" />
          <h1 className="logo">Your Name</h1>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          <nav>
            <a href="#about">About</a>
            <a href="#posters">Posters</a>
            <a href="#projects">Projects</a>
            <a href="#podcast">Podcast</a>
            <a href="#contact">Contact</a>
          </nav>
          <a className="cta" href="#contact">Contact</a>
        </div>
      </div>
    </header>
  )
}
