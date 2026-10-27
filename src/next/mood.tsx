import React from 'react'

// Moods: the same site, re-dressed. Each one changes the type and texture of every
// section, how the 3D is rendered, and what the hero objects are made of.

export type Mood = 'studio' | 'posters' | 'hiphop' | 'sketch'

export const MOODS: { id: Mood; label: string; line: string }[] = [
  { id: 'studio', label: 'Studio', line: 'The everyday version' },
  { id: 'posters', label: 'Posters', line: 'Covers with type you can push around' },
  { id: 'hiphop', label: 'Hip-hop', line: 'A cypher: my projects pass the mic' },
  { id: 'sketch', label: 'Sketchbook', line: 'Six projects, six universes' }
]

const KEY = 'nx-mood'

export function readMood(): Mood {
  try {
    const saved = localStorage.getItem(KEY) as Mood | null
    if (saved && MOODS.some((mood) => mood.id === saved)) return saved
  } catch {
    // Private mode: start in the studio.
  }
  return 'studio'
}

export function saveMood(mood: Mood): void {
  try { localStorage.setItem(KEY, mood) } catch { /* Lasts until reload. */ }
  // Overlays (the case study, the chess board) render outside the page, so the mood
  // also lives on <html> for them.
  document.documentElement.dataset.mood = mood
}

export const MoodContext = React.createContext<Mood>('studio')
export const useMood = (): Mood => React.useContext(MoodContext)
