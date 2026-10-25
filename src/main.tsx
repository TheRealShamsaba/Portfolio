import React from 'react'
import { createRoot } from 'react-dom/client'
import Site from './site/Site'
import 'lenis/dist/lenis.css'
import './site/site.css'
import './site/zine/zine.css'
import './site/zine/magazine.css'
import './site/zine/sketch.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><Site /></React.StrictMode>
)
