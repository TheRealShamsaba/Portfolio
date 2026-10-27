// The display fonts, loaded only by the full versions of the site; the light version
// sticks to the fonts already on the device.
const FONTS = 'https://fonts.googleapis.com/css2?family=Anton&family=Bangers&family=Comic+Neue:wght@700&family=Special+Elite&family=Luckiest+Guy&family=Jost:ital,wght@0,700;0,800;1,800;1,900&family=Sedgwick+Ave+Display&family=Big+Shoulders+Stencil+Display:wght@800&family=Caveat:wght@400;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,400&family=Aref+Ruqaa:wght@700&family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&family=Vazirmatn:wght@400;600&family=Permanent+Marker&family=Space+Mono:wght@400;700&family=Uncial+Antiqua&family=UnifrakturMaguntia&display=swap'

export function loadFonts(): void {
  if (document.querySelector('link[data-fonts]')) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = FONTS
  link.dataset.fonts = ''
  document.head.appendChild(link)
}
