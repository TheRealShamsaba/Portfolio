// Which version of the site to show: the full one, or the light one for slow
// connections, Data Saver, low-memory phones and browsers without 3D.

export type View = 'full' | 'lite'
export type Choice = { view: View; auto: boolean; reason?: string }

const KEY = 'view'

type Connection = { saveData?: boolean; effectiveType?: string }

function noWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return true
  }
}

export function chooseView(): Choice {
  const params = new URLSearchParams(window.location.search)
  if (params.has('lite')) return { view: 'lite', auto: false }
  if (params.has('full')) return { view: 'full', auto: false }
  try {
    const saved = localStorage.getItem(KEY)
    if (saved === 'lite' || saved === 'full') return { view: saved, auto: false }
  } catch {
    // Private mode: decide fresh each visit.
  }
  const connection = (navigator as Navigator & { connection?: Connection }).connection
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
  if (connection?.saveData) return { view: 'lite', auto: true, reason: 'Data Saver is on' }
  if (connection?.effectiveType && ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) return { view: 'lite', auto: true, reason: 'your connection looks slow' }
  if (memory !== undefined && memory <= 2) return { view: 'lite', auto: true, reason: 'this device is short on memory' }
  if (noWebGL()) return { view: 'lite', auto: true, reason: 'this browser can’t show 3D' }
  return { view: 'full', auto: false }
}

// Switch, remember it, and reload into that version.
export function switchView(view: View): void {
  try { localStorage.setItem(KEY, view) } catch { /* Remembered for this load only. */ }
  const url = new URL(window.location.href)
  url.searchParams.delete('lite')
  url.searchParams.delete('full')
  url.searchParams.set(view, '')
  window.location.href = url.toString().replace(/=(&|$)/g, '$1')
}
