import type { Mood } from './next/mood'

// The display fonts, loaded only by the full version of the site; the light version
// sticks to a couple of its own. Every mood shares the base set, and fetches its own
// lettering only when it is the one on screen.
const CSS = 'https://fonts.googleapis.com/css2?'

const BASE = 'family=Anton&family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=UnifrakturMaguntia'

const BY_MOOD: Record<Mood, string> = {
  studio: 'family=Permanent+Marker',
  posters: 'family=Permanent+Marker&family=Uncial+Antiqua',
  hiphop: 'family=Jost:ital,wght@0,700;0,800;1,800;1,900&family=Permanent+Marker&family=Sedgwick+Ave+Display',
  sketch: 'family=Bangers&family=Caveat:wght@400;600;700&family=Comic+Neue:wght@700&family=Luckiest+Guy&family=Special+Elite'
}

// What has to be on hand before a mood is shown, so nothing swaps in after the reveal.
const FACES: Record<Mood | 'base', string[]> = {
  base: ['1em UnifrakturMaguntia', '1em "Inter Tight"', '600 1em "Inter Tight"', '1em Anton', '1em "Instrument Serif"', 'italic 1em "Instrument Serif"', '1em "Space Mono"'],
  studio: ['1em "Permanent Marker"'],
  posters: ['1em "Permanent Marker"', '1em "Uncial Antiqua"'],
  hiphop: ['italic 900 1em Jost', '1em "Sedgwick Ave Display"'],
  sketch: ['1em Bangers', '700 1em Caveat', '700 1em "Comic Neue"', '1em "Special Elite"', '1em "Luckiest Guy"']
}

function link(key: string, query: string): Promise<void> {
  const existing = document.querySelector<HTMLLinkElement>(`link[data-fonts="${key}"]`)
  if (existing) return Promise.resolve()
  return new Promise((resolve) => {
    const tag = document.createElement('link')
    tag.rel = 'stylesheet'
    tag.href = `${CSS}${query}&display=swap`
    tag.dataset.fonts = key
    tag.onload = () => resolve()
    tag.onerror = () => resolve()
    document.head.appendChild(tag)
  })
}

// Resolves once the base faces and the mood's own are downloaded, or after a few
// seconds regardless: a slow font host should never hold the site back.
export function loadFonts(mood: Mood): Promise<void> {
  const ready = Promise.all([link('base', BASE), link(mood, BY_MOOD[mood])])
    .then(() => Promise.all([...FACES.base, ...FACES[mood]].map((face) => document.fonts.load(face).catch(() => undefined))))
    .then(() => undefined)
  return Promise.race([ready, new Promise<void>((resolve) => window.setTimeout(resolve, 6000))])
}
