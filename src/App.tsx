import React from 'react'

type CatalogueItem = {
  id: string
  name: string
  type: string
  status: string
  year: string
  headline: string
  description: string
  role: string
  tags: string[]
  stage: string
  ink: string
  accent: string
  image?: string
  url?: string
  urlLabel?: string
  visual: 'drip' | 'real' | 'site' | 'chess' | 'show' | 'posters'
}

const catalogue: CatalogueItem[] = [
  {
    id: 'drip', name: 'Drip', type: 'Product / AI', status: 'Private beta', year: '2026',
    headline: 'A wardrobe with a memory.',
    description: 'An AI-powered wardrobe assistant built around what you own, what you wear, and what the moment actually calls for.',
    role: 'Founder — product, architecture, identity',
    tags: ['iOS', 'Fastify', 'PostgreSQL', 'Recommendation logic'],
    stage: '#e7bc4f', ink: '#141414', accent: '#191919',
    url: 'https://dressrightinpublic.com/', urlLabel: 'Enter the brand world', visual: 'drip'
  },
  {
    id: 'real-co', name: 'Real Co.', type: 'Company', status: 'In formation', year: '2026',
    headline: 'The company behind what comes next.',
    description: 'A home for products, experiments, and selected collaborations shaped by strong identity and hands-on execution.',
    role: 'Founder — direction and operating model',
    tags: ['Venture building', 'Product direction', 'Creative technology'],
    stage: '#d8d2c7', ink: '#171717', accent: '#2447d8', visual: 'real'
  },
  {
    id: 'dress-right', name: 'Dress Right in Public', type: 'Brand / Web', status: 'Live', year: '2026',
    headline: 'Fashion presented as a point of view.',
    description: 'A fashion-focused public experience built to feel like an editorial brand world rather than a conventional storefront.',
    role: 'Frontend, visual direction, deployment',
    tags: ['Brand experience', 'Responsive UI', 'Vercel'],
    stage: '#beb9ff', ink: '#111111', accent: '#5239e8',
    image: '/projects/dressrightinpublic.png', url: 'https://dressrightinpublic.com/', urlLabel: 'Visit live site', visual: 'site'
  },
  {
    id: 'delux', name: 'Delux Grup', type: 'Platform / Client', status: 'Live', year: '2026',
    headline: 'One vehicle platform. Three languages.',
    description: 'Inventory, financing, sales leads, admin workflows, and location discovery across Persian, Turkish, and English.',
    role: 'Product structure, frontend, multilingual flows',
    tags: ['Automotive', 'Admin system', 'Multilingual'],
    stage: '#b8d1df', ink: '#101820', accent: '#24536f',
    image: '/projects/deluxgrup.png', url: 'https://deluxgrup.com.tr/', urlLabel: 'Visit live site', visual: 'site'
  },
  {
    id: 'knightvision', name: 'KnightVision', type: 'Applied AI', status: 'Research build', year: '2026',
    headline: 'Teaching a machine to think in moves.',
    description: 'A custom reinforcement-learning chess engine with policy/value heads, self-play, PGN pipelines, and Stockfish evaluation.',
    role: 'System architecture, model training, evaluation',
    tags: ['Python', 'PyTorch', 'Reinforcement learning'],
    stage: '#d64d38', ink: '#fff8eb', accent: '#fff8eb',
    url: 'https://github.com/TheRealShamsaba/KnightVision', urlLabel: 'Open repository', visual: 'chess'
  },
  {
    id: 'reasonable', name: 'The Reasonable Show', type: 'Independent media', status: 'Publishing', year: '2026',
    headline: 'Ideas tested out loud.',
    description: 'Conversations, commentary, and uncomfortable questions translated through direct language, comedy, and sarcasm.',
    role: 'Creator, host, writer, visual direction',
    tags: ['Podcast', 'YouTube', 'Editorial'],
    stage: '#efe4cd', ink: '#1a1815', accent: '#ae2c28',
    image: '/posters/media-reasonable-show-cover-01.webp', url: 'https://youtu.be/9iLwSkk9k6U?si=rIaMDLzxdY-eHTSO', urlLabel: 'Watch latest episode', visual: 'show'
  },
  {
    id: 'visuals', name: 'Visual Studies', type: 'Archive', status: 'Ongoing', year: '2024–26',
    headline: 'Thinking through images.',
    description: 'Posters and visual experiments about identity, perspective, culture, decisions, and the occasional absurdity of being alive.',
    role: 'Concept, art direction, image making',
    tags: ['Posters', 'Identity', 'Culture'],
    stage: '#181818', ink: '#f4efe5', accent: '#ec6b45', visual: 'posters'
  }
]

function StageVisual({ item }: { item: CatalogueItem }): React.ReactElement {
  if (item.visual === 'drip') {
    return (
      <div className="visual-drip">
        <div className="drip-wordmark"><span>DRIP</span><small>ACTUAL PRODUCT / IOS BUILD</small></div>
        <div className="drip-screens" aria-label="Screens from the Drip iOS application">
          <figure><img src="/projects/drip/studio.png" alt="Current Drip Dress Me Studio" /><figcaption>STUDIO / AUG 06</figcaption></figure>
          <figure><img src="/projects/drip/profile.png" alt="Current Drip style profile" /><figcaption>STYLE / AUG 06</figcaption></figure>
          <figure><img src="/projects/drip/result.png" alt="Current Drip outfit-check result" /><figcaption>RESULT / AUG 06</figcaption></figure>
        </div>
        <div className="drip-orbit"><span>closet memory</span><span>context engine</span><span>private style</span></div>
      </div>
    )
  }

  if (item.visual === 'real') {
    return (
      <div className="visual-real">
        <span>REAL</span><span>COMPANY</span>
        <div><i>PRODUCTS</i><i>EXPERIMENTS</i><i>PARTNERSHIPS</i></div>
      </div>
    )
  }

  if (item.visual === 'site') {
    return (
      <div className="visual-site">
        <div className="browser-chrome"><i /><i /><i /><span>{item.url?.replace('https://', '')}</span></div>
        <img src={item.image} alt={`${item.name} website`} />
      </div>
    )
  }

  if (item.visual === 'chess') {
    const pieces = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜', '♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙', '♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
    return (
      <div className="visual-chess">
        <div className="chess-board">{pieces.map((piece, index) => <span key={index}>{piece}</span>)}</div>
        <pre>policy_head → 4,672 moves{`\n`}value_head  → [-1, 1]{`\n`}self_play   → active</pre>
      </div>
    )
  }

  if (item.visual === 'show') {
    return (
      <div className="visual-show">
        <img src={item.image} alt="The Reasonable Show artwork" />
        <div><span>THE</span><strong>REASONABLE</strong><span>SHOW</span></div>
      </div>
    )
  }

  const posters = [
    '/posters/concept-greatness-and-honor.webp',
    '/posters/concept-impermanence.webp',
    '/posters/identity-rooted-in-adventure.jpg.png',
    '/posters/concept-perspective.webp'
  ]
  return <div className="visual-posters">{posters.map((poster, index) => <img key={poster} src={poster} alt={`Visual study ${index + 1}`} />)}</div>
}

function ProfileHome({ onEnterWork }: { onEnterWork: () => void }): React.ReactElement {
  return (
    <main className="profile-home">
      <section className="profile-hero">
        <div className="profile-home-copy">
          <div className="profile-eyebrow"><span>PROFILE / 2026</span><span>ISTANBUL · WORKING GLOBALLY</span></div>
          <h1>I turn unclear ideas into <em>working systems.</em></h1>
          <div className="profile-home-intro">
            <p>I’m Arian Shamsabadi—a founder and product builder working across applied AI, software, identity, and media.</p>
            <p>My best work happens where product, technology, and story need to become one coherent thing.</p>
          </div>
          <div className="profile-home-actions">
            <button type="button" onClick={onEnterWork}>Explore selected work <span>↗</span></button>
            <a href="mailto:arianshamsabadi@gmail.com">Start a conversation <span>↗</span></a>
          </div>
        </div>

        <div className="profile-portrait-wrap">
          <div className="profile-portrait-card">
            <img src="/profile.webp" alt="Arian Shamsabadi" />
            <span className="portrait-index">AS / 01</span>
            <span className="portrait-note">Founder<br />Product builder<br />Creative technologist</span>
          </div>
          <div className="profile-stamp" aria-hidden="true"><span>BUILDING</span><strong>REAL</strong><span>THINGS</span></div>
        </div>
      </section>

      <section className="profile-ledger" aria-label="Current profile details">
        <div><span>01 / CURRENTLY</span><strong>Building Drip<br />Shaping Real Co.</strong></div>
        <div><span>02 / RANGE</span><strong>Product · AI<br />Identity · Media</strong></div>
        <div><span>03 / LANGUAGES</span><strong>English · Persian<br />Turkish</strong></div>
        <button type="button" onClick={onEnterWork}><span>04 / SELECTED WORK</span><strong>Open the catalogue</strong><i>→</i></button>
      </section>
    </main>
  )
}

export default function App(): React.ReactElement {
  const [activeIndex, setActiveIndex] = React.useState(0)
  const [view, setView] = React.useState<'profile' | 'work'>('profile')
  const appRef = React.useRef<HTMLDivElement>(null)
  const active = catalogue[activeIndex]

  const move = React.useCallback((direction: number) => {
    setActiveIndex((current) => (current + direction + catalogue.length) % catalogue.length)
  }, [])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (view === 'work' && (event.key === 'ArrowDown' || event.key === 'ArrowRight')) move(1)
      if (view === 'work' && (event.key === 'ArrowUp' || event.key === 'ArrowLeft')) move(-1)
      if (event.key === 'Escape') setView('profile')
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [move, view])

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>): void => {
    const x = (event.clientX / window.innerWidth - 0.5) * 12
    const y = (event.clientY / window.innerHeight - 0.5) * 12
    appRef.current?.style.setProperty('--pointer-x', `${x}px`)
    appRef.current?.style.setProperty('--pointer-y', `${y}px`)
  }

  return (
    <div className={`catalogue-app view-${view}`} ref={appRef} onPointerMove={onPointerMove}>
      <header className="catalogue-header">
        <button type="button" className="catalogue-brand" onClick={() => setView('profile')}>
          <span>AS</span><strong>Arian Shamsabadi</strong>
        </button>
        <div className="catalogue-header-meta"><span>Founder / Product Builder</span><span>Istanbul · 41.0082° N</span></div>
        <div className="catalogue-header-actions">
          <button type="button" className={view === 'profile' ? 'is-current' : ''} onClick={() => setView('profile')}>Profile</button>
          <button type="button" className={view === 'work' ? 'is-current' : ''} onClick={() => setView('work')}>Work</button>
          <a href="mailto:arianshamsabadi@gmail.com">Contact ↗</a>
        </div>
      </header>

      {view === 'profile' ? <div key="profile" className="view-transition"><ProfileHome onEnterWork={() => setView('work')} /></div> : (
      <div key="work" className="view-transition"><main className="catalogue-layout">
        <aside className="catalogue-index">
          <div className="catalogue-intro">
            <span>SELECTED SYSTEMS / 2026</span>
            <h1>Built across<br /><em>product, code,</em><br />and culture.</h1>
            <p>A live catalogue of companies, products, technical systems, and independent media.</p>
          </div>

          <ol className="catalogue-list">
            {catalogue.map((item, index) => (
              <li key={item.id}>
                <button type="button" className={index === activeIndex ? 'is-active' : ''} onClick={() => setActiveIndex(index)}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{item.name}</strong>
                  <small>{item.type}</small>
                  <i>↗</i>
                </button>
              </li>
            ))}
          </ol>

          <div className="catalogue-controls">
            <span>{String(activeIndex + 1).padStart(2, '0')} / {String(catalogue.length).padStart(2, '0')}</span>
            <div><button type="button" onClick={() => move(-1)} aria-label="Previous item">←</button><button type="button" onClick={() => move(1)} aria-label="Next item">→</button></div>
          </div>
        </aside>

        <article
          className={`catalogue-stage catalogue-stage-${active.visual}`}
          style={{ '--stage': active.stage, '--stage-ink': active.ink, '--stage-accent': active.accent } as React.CSSProperties}
        >
          <div key={active.id} className="catalogue-stage-inner">
            <div className="stage-meta"><span>{active.type}</span><span>{active.status}</span><span>{active.year}</span></div>
            <div className="stage-visual"><StageVisual item={active} /></div>
            <div className="stage-copy">
              <div>
                <span className="stage-number">{String(activeIndex + 1).padStart(2, '0')}</span>
                <h2>{active.headline}</h2>
              </div>
              <div className="stage-description">
                <p>{active.description}</p>
                <span>{active.role}</span>
                <div>{active.tags.map((tag) => <i key={tag}>{tag}</i>)}</div>
                {active.url ? <a href={active.url} target="_blank" rel="noreferrer">{active.urlLabel}<b>↗</b></a> : null}
              </div>
            </div>
          </div>
        </article>
      </main></div>
      )}
    </div>
  )
}
