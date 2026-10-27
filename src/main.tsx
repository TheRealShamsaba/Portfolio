import React from 'react'
import { createRoot } from 'react-dom/client'
import { chooseView } from './view'

// Each version of the site loads only its own code, styles and fonts: the full site,
// or the light one for slow connections (see view.ts).
const Next = React.lazy(() => import('./next/Next'))
const Lite = React.lazy(() => import('./lite/Lite'))

const choice = chooseView()

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <React.Suspense fallback={null}>
      {choice.view === 'lite' ? <Lite choice={choice} /> : <Next />}
    </React.Suspense>
  </React.StrictMode>
)
