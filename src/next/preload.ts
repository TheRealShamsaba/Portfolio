import { loadFonts } from '../fonts'
import { clients, medium, profile, show } from '../site/data'
import type { Mood } from './mood'

// Everything a mood needs before it is shown: its code, its 3D models, the first
// images and its fonts. Downloading it all behind the loader means the site is
// smooth from the first frame, instead of stuttering while pieces arrive mid-scroll.

type Task = { label: string; weight: number; run: (report: (fraction: number) => void) => Promise<unknown> }

// Reads a file as it streams in, so big downloads move the bar steadily. The bytes
// land in the browser cache, where the 3D loaders find them a moment later.
async function download(url: string, report: (fraction: number) => void): Promise<void> {
  const response = await fetch(url)
  const total = Number(response.headers.get('content-length')) || 0
  if (!response.body || !total) { await response.arrayBuffer(); return }
  const reader = response.body.getReader()
  let received = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    received += value.length
    report(Math.min(1, received / total))
  }
}

// Decoded ahead of time, so they don't flash in when they first scroll past.
function image(src: string): Promise<void> {
  const img = new Image()
  img.decoding = 'async'
  img.src = src
  return img.decode().catch(() => undefined)
}

const images = (label: string, srcs: string[], weight: number): Task => ({
  label, weight,
  run: (report) => {
    let done = 0
    return Promise.all(srcs.map((src) => image(medium(src)).then(() => report(++done / srcs.length))))
  }
})

// Sizes in kilobytes, to share the bar out fairly between the files.
const MODELS: [string, number][] = [
  ['chess_set', 1000], ['potted_plant_02', 870], ['desk_lamp_arm_01', 490], ['gaming_console', 470], ['modern_wooden_cabinet', 420],
  ['modern_arm_chair_01', 310], ['mid_century_lounge_chair', 290], ['steel_frame_shelves_02', 185], ['modern_ceiling_lamp_01', 155], ['television_02', 150]
]

const shots = clients.map((client) => client.image)

function tasks(mood: Mood): Task[] {
  const fonts: Task = { label: 'Setting the type', weight: 300, run: () => loadFonts(mood) }
  switch (mood) {
    case 'posters':
      return [fonts, { label: 'Inking the covers', weight: 400, run: () => import('./Covers') }, images('Printing the photos', [profile.portrait, ...shots], 900)]
    case 'hiphop':
      return [
        fonts,
        { label: 'Wiring the speakers', weight: 1800, run: () => Promise.all([import('./Cypher'), import('./CypherScene')]) },
        images('Loading the screens', [...shots, show.image, '/projects/drip-app/screens/verdict.webp'], 900)
      ]
    case 'sketch':
      return [
        fonts,
        { label: 'Sharpening the pencils', weight: 300, run: () => import('./Sketch') },
        images('Taping in the pictures', [...shots, '/posters/concept-teamwork.webp', '/projects/drip-app/screens/closet.webp'], 900)
      ]
    default:
      return [
        fonts,
        { label: 'Unpacking the shelf', weight: 2000, run: () => import('./Cluster') },
        { label: 'Building the studio', weight: 1000, run: () => import('./Room') },
        ...MODELS.map(([name, size]): Task => ({ label: 'Moving the furniture in', weight: size, run: (report) => download(`/studio/${name}.glb`, report) })),
        images('Hanging the posters', [
          '/studio/istanbul-night.webp', profile.portrait,
          '/posters/satire-maximum-effort.webp', '/posters/concept-greatness-and-honor.webp', '/posters/identity-be-the-man-you-want.webp',
          '/posters/concept-impermanence.webp', '/posters/concept-perspective.webp'
        ], 600)
      ]
  }
}

export type Progress = { fraction: number; label: string }

// Runs a mood's downloads side by side and reports the weighted total. A file that
// fails is counted as done: the site loads it again itself when it needs it.
export function preload(mood: Mood, onProgress: (progress: Progress) => void): Promise<void> {
  const list = tasks(mood)
  const total = list.reduce((sum, task) => sum + task.weight, 0)
  const parts = list.map(() => 0)
  const update = (): void => {
    const done = list.reduce((sum, task, i) => sum + task.weight * parts[i], 0)
    const pending = list.find((_, i) => parts[i] < 1)
    onProgress({ fraction: done / total, label: pending?.label ?? 'Opening the doors' })
  }
  update()
  return Promise.all(list.map((task, i) => task
    .run((fraction) => { parts[i] = Math.max(parts[i], fraction); update() })
    .catch(() => undefined)
    .then(() => { parts[i] = 1; update() })
  )).then(() => undefined)
}

// Once a visitor is in, the other moods download quietly while the browser is idle,
// so switching to one is instant.
export function prefetchOtherMoods(current: Mood): void {
  // Not on metered or slow connections: there it waits until someone asks for a mood.
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  if (connection?.saveData || (connection?.effectiveType && connection.effectiveType !== '4g')) return
  const idle = (callback: () => void): void => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, options?: { timeout: number }) => number }
    if (w.requestIdleCallback) w.requestIdleCallback(callback, { timeout: 4000 })
    else window.setTimeout(callback, 2500)
  }
  const chunks: Record<Mood, () => Promise<unknown>> = {
    studio: () => Promise.all([import('./Cluster'), import('./Room')]),
    posters: () => import('./Covers'),
    hiphop: () => Promise.all([import('./Cypher'), import('./CypherScene')]),
    sketch: () => import('./Sketch')
  }
  const rest = (Object.keys(chunks) as Mood[]).filter((mood) => mood !== current)
  const next = (): void => {
    const mood = rest.shift()
    if (!mood) return
    idle(() => { void chunks[mood]().catch(() => undefined).then(next) })
  }
  window.setTimeout(next, 3000)
}
