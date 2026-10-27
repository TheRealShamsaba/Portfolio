import React from 'react'
import { createPortal } from 'react-dom'

// Under the hood, as a case study: five chapters per project, from who it's for down
// to what ships. Each chapter is a drawn diagram that animates in, never a screenshot.
// Everything stated here comes from the project stories; nothing is padded.

type Node = { label: string; sub?: string }

type Diagram =
  | { kind: 'people'; people: { who: string; need: string }[] }
  | { kind: 'before-after'; before: Node[]; after: Node[]; beforeLabel: string; afterLabel: string }
  | { kind: 'mirror'; left: string; right: string; note: string }
  | { kind: 'funnel'; steps: Node[] }
  | { kind: 'loop'; steps: Node[]; centre: string }
  | { kind: 'source'; from: string; to: string; tag: string }
  | { kind: 'modules'; modules: Node[]; hub: string }

export type Chapter = { name: string; title: string; text: string; diagram: Diagram }

export const CASES: Record<string, Chapter[]> = {
  dgm: [
    {
      name: 'The people', title: 'Two buyers, no time.',
      text: 'DGM sells urology lasers and endoscopy systems to hospitals across Iran. The people deciding are surgeons and procurement teams, and neither has time to dig through brochures.',
      diagram: { kind: 'people', people: [{ who: 'Surgeon', need: 'Which device fits this procedure?' }, { who: 'Procurement', need: 'What exactly are we buying?' }] }
    },
    {
      name: 'The problem', title: 'Catalogues start from the product.',
      text: 'A normal catalogue makes you know the product name first. A surgeon starts from the operation they need to do.',
      diagram: { kind: 'before-after', beforeLabel: 'How catalogues work', before: [{ label: 'Product list' }, { label: 'Brochure' }, { label: 'Specs' }, { label: 'Maybe it fits' }], afterLabel: 'How surgeons think', after: [{ label: 'Specialty' }, { label: 'Procedure' }, { label: 'The right device' }] }
    },
    {
      name: 'The design', title: 'Start from the clinical question.',
      text: 'So the site is built around the clinical question. Pick a specialty or a procedure and the right device comes to you.',
      diagram: { kind: 'funnel', steps: [{ label: 'Specialty', sub: 'Urology, endoscopy…' }, { label: 'Procedure', sub: 'What are you doing?' }, { label: 'Device', sub: 'The one that fits' }] }
    },
    {
      name: 'The trust', title: 'Every number from the source.',
      text: 'Hospitals buy on specifications. Every figure on the site is taken from the manufacturer’s official documents, so what a buyer reads is what they get.',
      diagram: { kind: 'source', from: 'Manufacturer’s official documents', to: 'Device page', tag: 'From the source' }
    },
    {
      name: 'What ships', title: 'One site, four jobs, two languages.',
      text: 'Persian and English, with a product catalogue, a training academy and service requests in the same place.',
      diagram: { kind: 'modules', hub: 'DGM', modules: [{ label: 'Catalogue' }, { label: 'Academy' }, { label: 'Service requests' }, { label: 'فارسی + English' }] }
    }
  ],
  delux: [
    {
      name: 'The people', title: 'New in the city.',
      text: 'Delux sells cars in Istanbul, mostly to Iranians who moved there and don’t read Turkish yet.',
      diagram: { kind: 'people', people: [{ who: 'New in Istanbul', need: 'I want a car, but I can’t read the ads.' }, { who: 'Delux staff', need: 'We need one place for cars and leads.' }] }
    },
    {
      name: 'The language', title: 'Three languages, two directions.',
      text: 'Persian reads right to left; Turkish and English read left to right. The site runs all three from one codebase, so a change happens once, everywhere.',
      diagram: { kind: 'mirror', left: 'Türkçe · English', right: 'فارسی', note: 'One codebase · mirrored layout' }
    },
    {
      name: 'The design', title: 'End where deals actually close.',
      text: 'Every car ends in a WhatsApp conversation, because that is where these deals actually close. The site’s job is to get you there with the right car.',
      diagram: { kind: 'funnel', steps: [{ label: 'Browse', sub: 'In your language' }, { label: 'The car', sub: 'Price, financing' }, { label: 'WhatsApp', sub: 'Talk to a person' }] }
    },
    {
      name: 'Behind it', title: 'An admin the staff actually use.',
      text: 'Staff manage listings, leads and translations themselves, without calling a developer.',
      diagram: { kind: 'modules', hub: 'Admin', modules: [{ label: 'Listings' }, { label: 'Leads' }, { label: 'Translations' }, { label: 'Financing' }] }
    },
    {
      name: 'What ships', title: 'Inventory, financing, leads, search.',
      text: 'Three languages, inventory and financing, a lead admin, and local SEO so the right people find it.',
      diagram: { kind: 'before-after', beforeLabel: 'Before', before: [{ label: 'Ad in Turkish' }, { label: 'Translate it' }, { label: 'Call and hope' }], afterLabel: 'Now', after: [{ label: 'Read it in Persian' }, { label: 'Pick the car' }, { label: 'Chat on WhatsApp' }] }
    }
  ],
  realco: [
    {
      name: 'The people', title: 'Founders who want one team.',
      text: 'Real Co. is the studio I run. It takes on a small number of projects, so the site speaks to people who want the whole thing handled.',
      diagram: { kind: 'people', people: [{ who: 'A founder', need: 'Who builds this, and who looks after it?' }, { who: 'A business owner', need: 'How do I even start?' }] }
    },
    {
      name: 'The idea', title: 'All of it, in-house.',
      text: 'Product thinking, design, engineering, and the work after launch that most agencies hand off to someone else. One team keeps the loop closed.',
      diagram: { kind: 'loop', centre: 'One team', steps: [{ label: 'Think' }, { label: 'Design' }, { label: 'Build' }, { label: 'Look after it' }] }
    },
    {
      name: 'The words', title: 'Say it plainly.',
      text: 'The site had to say that plainly, in English and Persian. No jargon between the visitor and the point.',
      diagram: { kind: 'mirror', left: 'English', right: 'فارسی', note: 'Same message, both directions' }
    },
    {
      name: 'The design', title: 'Starting is one step.',
      text: 'Make starting a project a single step: from reading to talking, with nothing in between.',
      diagram: { kind: 'funnel', steps: [{ label: 'Read', sub: 'What we do' }, { label: 'One step', sub: 'Tell us the problem' }, { label: 'Talk', sub: 'A real reply' }] }
    },
    {
      name: 'What ships', title: 'Positioning, system, intake.',
      text: 'Positioning, a design system, and project intake, in English and Persian.',
      diagram: { kind: 'modules', hub: 'Real Co.', modules: [{ label: 'Positioning' }, { label: 'Design system' }, { label: 'Project intake' }, { label: 'EN + فا' }] }
    }
  ]
}

// ───────────── Diagrams (SVG, 640 × 400, drawn in the project's colours) ─────────────

function Box({ x, y, w, h, label, sub, delay, accent }: { x: number; y: number; w: number; h: number; label: string; sub?: string; delay: number; accent?: boolean }): React.ReactElement {
  return (
    <g className="cs-in" style={{ animationDelay: `${delay}s` }}>
      <rect x={x} y={y} width={w} height={h} rx={14} className={accent ? 'cs-box is-accent' : 'cs-box'} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -4 : 6)} textAnchor="middle" className="cs-label">{label}</text>
      {sub ? <text x={x + w / 2} y={y + h / 2 + 18} textAnchor="middle" className="cs-sub">{sub}</text> : null}
    </g>
  )
}

function Arrow({ x1, y1, x2, y2, delay, dashed }: { x1: number; y1: number; x2: number; y2: number; delay: number; dashed?: boolean }): React.ReactElement {
  const length = Math.hypot(x2 - x1, y2 - y1)
  return (
    <g className="cs-draw" style={{ '--len': length, animationDelay: `${delay}s` } as React.CSSProperties}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} className={dashed ? 'cs-line is-dashed' : 'cs-line'} markerEnd="url(#cs-head)" />
    </g>
  )
}

export function DiagramView({ diagram }: { diagram: Diagram }): React.ReactElement {
  const defs = (
    <defs>
      <marker id="cs-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" className="cs-head" />
      </marker>
    </defs>
  )

  if (diagram.kind === 'people') {
    return (
      <svg viewBox="0 0 640 400" className="cs-svg">
        {defs}
        {diagram.people.map((person, i) => {
          const cx = 170 + i * 300
          return (
            <g key={person.who} className="cs-in" style={{ animationDelay: `${0.15 + i * 0.25}s` }}>
              <circle cx={cx} cy={120} r={40} className="cs-box is-accent" />
              <circle cx={cx} cy={108} r={14} className="cs-face" />
              <path d={`M${cx - 24} ${148} Q${cx} ${120} ${cx + 24} ${148}`} className="cs-face" />
              <text x={cx} y={196} textAnchor="middle" className="cs-label">{person.who}</text>
              <rect x={cx - 130} y={222} width={260} height={92} rx={16} className="cs-box" />
              <path d={`M${cx - 10} 222 L${cx} 206 L${cx + 10} 222`} className="cs-box" />
              <foreignObject x={cx - 118} y={232} width={236} height={76}>
                <p className="cs-quote">“{person.need}”</p>
              </foreignObject>
            </g>
          )
        })}
      </svg>
    )
  }

  if (diagram.kind === 'before-after') {
    const row = (nodes: Node[], y: number, base: number, accent: boolean): React.ReactElement[] => {
      const w = 130
      const gap = (560 - nodes.length * w) / Math.max(1, nodes.length - 1)
      return nodes.flatMap((node, i) => {
        const x = 40 + i * (w + gap)
        const parts = [<Box key={`b${y}${i}`} x={x} y={y} w={w} h={64} label={node.label} delay={base + i * 0.18} accent={accent && i === nodes.length - 1} />]
        if (i < nodes.length - 1) parts.push(<Arrow key={`a${y}${i}`} x1={x + w + 4} y1={y + 32} x2={x + w + gap - 6} y2={y + 32} delay={base + i * 0.18 + 0.1} dashed={!accent} />)
        return parts
      })
    }
    return (
      <svg viewBox="0 0 640 400" className="cs-svg">
        {defs}
        <text x={40} y={60} className="cs-kicker cs-in">{diagram.beforeLabel}</text>
        <g className="cs-muted">{row(diagram.before, 80, 0.1, false)}</g>
        <text x={40} y={238} className="cs-kicker is-accent cs-in" style={{ animationDelay: '0.8s' }}>{diagram.afterLabel}</text>
        {row(diagram.after, 258, 0.9, true)}
      </svg>
    )
  }

  if (diagram.kind === 'mirror') {
    const page = (x: number, rtl: boolean, label: string, delay: number): React.ReactElement => {
      const bars = [0.9, 0.6, 0.75, 0.45]
      return (
        <g className="cs-in" style={{ animationDelay: `${delay}s` }}>
          <rect x={x} y={70} width={240} height={250} rx={16} className="cs-box" />
          <rect x={rtl ? x + 150 : x + 20} y={90} width={70} height={14} rx={7} className="cs-fill is-accent" />
          {bars.map((b, i) => (
            <rect key={i} x={rtl ? x + 220 - 200 * b : x + 20} y={124 + i * 26} width={200 * b} height={10} rx={5} className="cs-fill" />
          ))}
          <rect x={rtl ? x + 20 : x + 120} y={238} width={100} height={60} rx={10} className="cs-fill is-soft" />
          <text x={x + 120} y={352} textAnchor="middle" className="cs-label">{label}</text>
          <text x={x + 120} y={58} textAnchor="middle" className="cs-sub">{rtl ? '← right to left' : 'left to right →'}</text>
        </g>
      )
    }
    return (
      <svg viewBox="0 0 640 400" className="cs-svg">
        {defs}
        {page(30, false, diagram.left, 0.1)}
        {page(370, true, diagram.right, 0.35)}
        <g className="cs-in" style={{ animationDelay: '0.7s' }}>
          <line x1={320} y1={80} x2={320} y2={310} className="cs-line is-dashed" />
          <rect x={250} y={180} width={140} height={34} rx={17} className="cs-box is-accent" />
          <text x={320} y={202} textAnchor="middle" className="cs-sub is-strong">{diagram.note}</text>
        </g>
      </svg>
    )
  }

  if (diagram.kind === 'funnel') {
    return (
      <svg viewBox="0 0 640 400" className="cs-svg">
        {defs}
        {diagram.steps.map((step, i) => {
          const w = 400 - i * 90
          const x = 320 - w / 2
          const y = 40 + i * 118
          return (
            <React.Fragment key={step.label}>
              <Box x={x} y={y} w={w} h={78} label={step.label} sub={step.sub} delay={0.15 + i * 0.3} accent={i === diagram.steps.length - 1} />
              {i < diagram.steps.length - 1 ? <Arrow x1={320} y1={y + 82} x2={320} y2={y + 114} delay={0.3 + i * 0.3} /> : null}
            </React.Fragment>
          )
        })}
      </svg>
    )
  }

  if (diagram.kind === 'loop') {
    const n = diagram.steps.length
    const r = 135
    const points = diagram.steps.map((_, i) => {
      const a = -Math.PI / 2 + (i / n) * Math.PI * 2
      return [320 + Math.cos(a) * r * 1.35, 200 + Math.sin(a) * r] as [number, number]
    })
    return (
      <svg viewBox="0 0 640 400" className="cs-svg">
        {defs}
        <g className="cs-draw" style={{ '--len': 1100, animationDelay: '0.2s' } as React.CSSProperties}>
          <ellipse cx={320} cy={200} rx={r * 1.35} ry={r} className="cs-line is-dashed" />
        </g>
        <g className="cs-in" style={{ animationDelay: '0.1s' }}>
          <circle cx={320} cy={200} r={54} className="cs-box is-accent" />
          <text x={320} y={206} textAnchor="middle" className="cs-label">{diagram.centre}</text>
        </g>
        {diagram.steps.map((step, i) => (
          <Box key={step.label} x={points[i][0] - 70} y={points[i][1] - 26} w={140} h={52} label={step.label} delay={0.4 + i * 0.22} />
        ))}
      </svg>
    )
  }

  if (diagram.kind === 'source') {
    return (
      <svg viewBox="0 0 640 400" className="cs-svg">
        {defs}
        <g className="cs-in" style={{ animationDelay: '0.1s' }}>
          {[0, 1, 2].map((i) => <rect key={i} x={50 + i * 10} y={70 + i * 10} width={190} height={240} rx={10} className="cs-box" />)}
          {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={90} y={130 + i * 24} width={i % 2 ? 110 : 150} height={9} rx={4} className="cs-fill" />)}
          <text x={165} y={348} textAnchor="middle" className="cs-sub">{diagram.from}</text>
        </g>
        <Arrow x1={270} y1={200} x2={380} y2={200} delay={0.5} />
        <g className="cs-in" style={{ animationDelay: '0.8s' }}>
          <rect x={395} y={80} width={200} height={230} rx={16} className="cs-box" />
          <rect x={415} y={100} width={160} height={70} rx={10} className="cs-fill is-soft" />
          {[0, 1, 2].map((i) => (
            <React.Fragment key={i}>
              <rect x={415} y={188 + i * 30} width={70} height={9} rx={4} className="cs-fill" />
              <rect x={505} y={188 + i * 30} width={70} height={9} rx={4} className="cs-fill is-accent" />
            </React.Fragment>
          ))}
          <rect x={430} y={280} width={130} height={26} rx={13} className="cs-box is-accent" />
          <text x={495} y={298} textAnchor="middle" className="cs-sub is-strong">✓ {diagram.tag}</text>
          <text x={495} y={348} textAnchor="middle" className="cs-sub">{diagram.to}</text>
        </g>
      </svg>
    )
  }

  // modules: a hub with the pieces that ship around it.
  const spots: [number, number][] = [[110, 90], [530, 90], [110, 310], [530, 310]]
  return (
    <svg viewBox="0 0 640 400" className="cs-svg">
      {defs}
      {diagram.modules.map((module, i) => (
        <React.Fragment key={module.label}>
          <Arrow x1={320} y1={200} x2={spots[i][0] + (spots[i][0] < 320 ? 80 : -80)} y2={spots[i][1] + (spots[i][1] < 200 ? 28 : -28)} delay={0.35 + i * 0.15} />
          <Box x={spots[i][0] - 85} y={spots[i][1] - 28} w={170} h={56} label={module.label} delay={0.5 + i * 0.15} />
        </React.Fragment>
      ))}
      <g className="cs-in" style={{ animationDelay: '0.1s' }}>
        <circle cx={320} cy={200} r={62} className="cs-box is-accent" />
        <text x={320} y={207} textAnchor="middle" className="cs-label">{diagram.hub}</text>
      </g>
    </svg>
  )
}

// The full-screen reader: one chapter at a time, with its diagram drawing itself in.
// Rendered at the page root: the work cards are transformed while they stack, which
// would otherwise trap a fixed overlay inside the card.
export function CaseReader({ id, title, start, colours, onClose }: { id: string; title: string; start: number; colours: { bg: string; fg: string; accent: string }; onClose: () => void }): React.ReactElement {
  const chapters = CASES[id]
  const [index, setIndex] = React.useState(start)
  const chapter = chapters[index]
  const go = React.useCallback((by: number) => setIndex((value) => Math.min(chapters.length - 1, Math.max(0, value + by))), [chapters.length])

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    let startX = 0
    const onStart = (event: TouchEvent): void => { startX = event.touches[0].clientX }
    const onEnd = (event: TouchEvent): void => {
      const dx = event.changedTouches[0].clientX - startX
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    document.documentElement.classList.add('nx-locked')
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
      document.documentElement.classList.remove('nx-locked')
    }
  }, [go, onClose])

  return createPortal(
    <div className="cs" role="dialog" aria-modal="true" aria-label={`${title}: case study`} style={{ '--c-bg': colours.bg, '--c-fg': colours.fg, '--c-accent': colours.accent } as React.CSSProperties}>
      <header className="cs-top">
        <p><b>{title}</b> · Case study</p>
        <button type="button" onClick={onClose}>Close ×</button>
      </header>
      <ol className="cs-steps">
        {chapters.map((item, i) => (
          <li key={item.name}>
            <button type="button" className={i === index ? 'is-on' : i < index ? 'is-done' : ''} onClick={() => setIndex(i)}><span>0{i + 1}</span>{item.name}</button>
          </li>
        ))}
      </ol>
      <div className="cs-body" key={index}>
        <div className="cs-copy">
          <p className="cs-chapter">0{index + 1} · {chapter.name}</p>
          <h3>{chapter.title}</h3>
          <p>{chapter.text}</p>
        </div>
        <div className="cs-figure"><DiagramView diagram={chapter.diagram} /></div>
      </div>
      <footer className="cs-nav">
        <button type="button" onClick={() => go(-1)} disabled={index === 0}>← Back</button>
        <span>{index + 1} / {chapters.length}</span>
        <button type="button" onClick={() => (index === chapters.length - 1 ? onClose() : go(1))}>{index === chapters.length - 1 ? 'Done ✓' : 'Next →'}</button>
      </footer>
    </div>,
    document.body
  )
}
