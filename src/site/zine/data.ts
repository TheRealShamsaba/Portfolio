import { clients } from '../data'

export type Mood = 'poster' | 'magazine' | 'sketch'

export const moods: { id: Mood; label: string }[] = [
  { id: 'poster', label: 'Posters' },
  { id: 'magazine', label: 'Hip-hop' },
  { id: 'sketch', label: 'Sketchbook' }
]

export const posterCopy = {
  role: 'founder',
  quote: 'Software, websites and the occasional poster. Made in Istanbul.',
  warning: 'there is always another side project.',
  stickers: ['Tehran → Istanbul', 'Built at Real Co.', 'drag us around ↘']
}

export type ZLabel = {
  id: string
  no: string
  name: string
  kind: string
  status: string
  statement: string
  body: string
  serving: string
  ingredients: [string, string][]
  handling: [string, string, string, string]
  stamp: string
  url: string
  cta: string
  bg: string
  ink: string
  spot: string
  image?: string
  focus?: [number, number]
}

export const labels: ZLabel[] = [
  {
    id: 'drip',
    no: '01',
    name: 'Drip',
    kind: 'Fashion intelligence',
    status: 'Private beta',
    statement: 'Check your fit before you leave the house.',
    body: 'Take a photo of your fit. Drip tells you straight: wear it, fix one thing, or swap it. It remembers what you own, so the advice is about your closet, not a catalogue.',
    serving: 'Outfit checks & closet',
    ingredients: [['Platform', 'iOS + web'], ['Input', 'One outfit photo'], ['Suggestions', 'From your own clothes'], ['My role', 'Design + engineering']],
    handling: ['iOS app', 'Web', 'AI engine', 'EN / FA'],
    stamp: 'Private beta',
    url: 'https://dressrightinpublic.com/',
    cta: 'Join the waitlist',
    bg: '#f3eee4',
    ink: '#141414',
    spot: '#f08a24',
    image: '/projects/drip-app/screens/verdict.webp',
    focus: [0.5, 0.3]
  },
  {
    id: 'real-co',
    no: '02',
    name: 'Real Co.',
    kind: 'Design & software studio',
    status: 'Taking projects',
    statement: 'We build the real thing.',
    body: 'Websites, apps, products and internal tools. One team designs them, builds them and looks after them once they are live, in English or Persian.',
    serving: 'The studio',
    ingredients: [['Based in', 'Istanbul'], ['Work', 'Websites, apps, tools'], ['Languages', 'English + Persian'], ['Process', 'Design, build, maintain']],
    handling: ['Websites', 'Apps', 'Internal tools', 'EN / FA'],
    stamp: 'Open for work',
    url: 'https://realcompanys.com/',
    cta: 'Start a project',
    bg: '#121212',
    ink: '#efeae0',
    spot: '#3a5bff'
  },
  {
    id: 'knightvision',
    no: '03',
    name: 'KnightVision',
    kind: 'Applied AI research',
    status: 'Research build',
    statement: 'Teaching a machine to think in moves.',
    body: 'A reinforcement-learning chess engine with policy and value heads, self-play, PGN pipelines and Stockfish evaluation.',
    serving: 'Self-play chess research',
    ingredients: [['Language', 'Python'], ['Framework', 'PyTorch'], ['Training', 'Self-play'], ['Evaluation', 'Stockfish']],
    handling: ['Python', 'PyTorch', 'Self-play', 'RL'],
    stamp: 'R & D',
    url: 'https://github.com/TheRealShamsaba/KnightVision',
    cta: 'Open repository',
    bg: '#d64d38',
    ink: '#fff4e6',
    spot: '#141414',
    image: '/posters/concept-think-think.webp',
    focus: [0.5, 0.5]
  }
]

// Client sites, printed as comic-book covers.
const blurbs: Record<string, string> = {
  dgm: 'Urology lasers and endoscopy for Iranian hospitals, found by clinical question in two languages.',
  delux: 'Car sales in Istanbul in Persian, Turkish and English, with the admin and the leads behind it.',
  realco: 'The studio’s own site: dark, bilingual and built to turn visitors into projects.'
}
const tags: Record<string, string[]> = {
  dgm: ['Medical', 'FA / EN'],
  delux: ['Automotive', 'FA / TR / EN'],
  realco: ['Studio', 'EN / FA']
}

export const covers = clients.map((client, i) => ({
  id: client.id,
  issue: String(i + 1),
  title: client.title,
  host: client.host,
  url: client.url,
  image: client.image,
  blurb: blurbs[client.id] ?? client.story,
  tags: tags[client.id] ?? []
}))
