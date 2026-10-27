import React from 'react'

// True while the element is on (or near) the screen; lets 3D scenes stop drawing when they're not.
export default function useInView(ref: React.RefObject<Element | null>, margin = '0px'): boolean {
  const [inView, setInView] = React.useState(false)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: margin })
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, margin])
  return inView
}
