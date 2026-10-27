import { posters } from '../posters'

export const profile = {
  name: 'Arian Shamsabadi',
  persianName: 'آرین شمس‌آبادی',
  email: 'arianshamsabadi@gmail.com',
  telegram: 'https://t.me/Therealshamsaba',
  whatsapp: 'https://wa.me/message/Z6P4QVVV2MIOC1',
  github: 'https://github.com/TheRealShamsaba',
  studio: 'https://realcompanys.com/',
  portrait: '/profile.webp'
}

// Each chapter repaints the whole page in its own colours as it scrolls into view.
export type Scene = { bg: string; fg: string; accent: string }

export type Chapter = {
  id: string
  title: string
  place: string
  line: string
  story: string
  facts: string
  url: string
  host: string
  image: string
  scene: Scene
}

export const clients: Chapter[] = [
  {
    id: 'dgm',
    title: 'Darman Gostar Miad',
    place: 'Tehran · Medical equipment',
    line: 'Find the laser by the surgery, not the brochure.',
    story: 'DGM supplies urology lasers and endoscopy systems to hospitals across Iran. The people buying are surgeons and procurement teams, and neither has time to dig through brochures. I built the site around the clinical question first. Pick a specialty or a procedure and the right device comes to you, with every figure taken from the manufacturer’s official documents.',
    facts: 'Persian & English · Product catalogue · Training academy · Service requests',
    url: 'https://darmangostarmiad.ir/',
    host: 'darmangostarmiad.ir',
    image: '/projects/sites/dgm-long.jpg',
    scene: { bg: '#06141a', fg: '#e6efe9', accent: '#9be15d' }
  },
  {
    id: 'delux',
    title: 'Delux Grup',
    place: 'Istanbul · Car dealership',
    line: 'Three languages, one codebase. Every deal closes on WhatsApp.',
    story: 'Delux sells cars in Istanbul, mostly to Iranians who moved there and don’t read Turkish yet. The site runs in Persian, Turkish and English from one codebase, right-to-left and left-to-right, with an admin where staff manage listings, leads and translations. Every car ends in a WhatsApp conversation, because that is where these deals actually close.',
    facts: 'Three languages · Inventory & financing · Lead admin · Local SEO',
    url: 'https://deluxgrup.com.tr/',
    host: 'deluxgrup.com.tr',
    image: '/projects/sites/delux-long.jpg',
    scene: { bg: '#0c0c0b', fg: '#f4efe4', accent: '#ffc915' }
  },
  {
    id: 'realco',
    title: 'Real Co.',
    place: 'Istanbul · My studio',
    line: 'Design it, build it, look after it. One team.',
    story: 'Real Co. is the studio I run. We take on a small number of projects and do all of it in-house: the product thinking, the design, the engineering, and the work after launch that most agencies hand off to someone else. Its own site had to say that plainly, in English and Persian, and make starting a project a single step.',
    facts: 'English & Persian · Positioning · Design system · Project intake',
    url: 'https://realcompanys.com/',
    host: 'realcompanys.com',
    image: '/projects/sites/realco-long.jpg',
    scene: { bg: '#0f1013', fg: '#ecebe6', accent: '#5b78ff' }
  }
]

// Drip, the app, told like a launch film: one question, one answer, then four short chapters.
export const dripApp = {
  wordmark: '/projects/drip-app/wordmark.webp',
  url: 'https://dressrightinpublic.com/',
  scene: { bg: '#f2efe9', fg: '#121212', accent: '#e5482f' },
  question: 'Does this work?',
  answer: 'Ask Drip.',
  chapters: [
    {
      label: 'The problem',
      title: 'Nobody to ask at the door.',
      text: 'Every morning ends with the same question. Your friends are asleep, the mirror is too kind, and every fashion app wants to sell you something new.',
      screen: '/projects/drip-app/screens/camera.webp'
    },
    {
      label: 'What Drip does',
      title: 'One photo. One honest word.',
      text: 'Drip finds every piece, cap to shoes, accessories included, and answers straight: Clean. Bold. Nah. Every piece gets its own tag, and every swap comes from clothes you already own.',
      screen: '/projects/drip-app/screens/verdict.webp'
    },
    {
      label: 'How it’s designed',
      title: 'Made like the things you get dressed with.',
      text: 'Hang tags you flip for the reason, a closet on paper shelves, a receipt that prints your fit. Paper and ink, colour only from your clothes, and nothing that slams or pops up.',
      screen: '/projects/drip-app/screens/closet.webp'
    },
    {
      label: 'How it’s built',
      title: 'Mine, end to end.',
      text: 'I design and build all of it: the native iOS app, a Fastify and Postgres API, the model pipeline that reads an outfit, and the web around it. Private beta now.',
      screen: '/projects/drip-app/screens/receipt.webp'
    }
  ]
}

export const knightvision: Chapter = {
  id: 'knightvision',
  title: 'KnightVision',
  place: 'Research · Applied AI',
  line: 'A chess engine that learns by playing itself.',
  story: 'BakerDmo and I built KnightVision, a chess engine that learns by playing. It starts with nothing but the rules, plays against itself game after game, and keeps what works. Under the hood, a policy network proposes moves, a value network judges positions, and Stockfish acts as the referee. It is where I learned how much engineering sits behind the word AI.',
  facts: 'Python · PyTorch · Self-play reinforcement learning · Stockfish evaluation',
  url: 'https://github.com/TheRealShamsaba/KnightVision',
  host: 'github.com/TheRealShamsaba/KnightVision',
  image: '',
  scene: { bg: '#c9452f', fg: '#fff3e6', accent: '#141414' }
}

export const show = {
  title: 'The Reasonable Show',
  url: 'https://youtu.be/9iLwSkk9k6U?si=rIaMDLzxdY-eHTSO',
  image: '/posters/media-reasonable-show-portrait.webp',
  text: 'Away from the keyboard, I host The Reasonable Show: long conversations with guests about technology, culture and business, with enough humour to keep everyone honest. Building things is half the job. Explaining them to people is the other half, and this is where I practise.'
}

const hiddenPosters = new Set(['satire-handle-with-care'])

export const archive = posters.filter((poster) => !poster.explicit && !hiddenPosters.has(poster.id))
