import React from 'react'
import { useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'

// Where each scene settled, so a monitor that's unmounted while a scene rests picks up
// from there instead of starting sharp again.
const settled = new Map<string, number>()

// Starts sharp and gives up pixels only if this device can't hold the frame rate, so a
// fast phone keeps the detail and a slow one stays smooth instead of stuttering. Mount
// it only while the scene renders continuously: it reads sparse frames as slowness.
export function Quality({ id, max, min = 1 }: { id: string; max: number; min?: number }): React.ReactElement {
  const setDpr = useThree((state) => state.setDpr)
  const top = Math.min(max, window.devicePixelRatio || 1)
  const floor = Math.min(min, top)
  const apply = (factor: number): void => {
    settled.set(id, factor)
    setDpr(Math.round((floor + (top - floor) * factor) * 20) / 20)
  }
  return (
    <PerformanceMonitor
      factor={settled.get(id) ?? 1}
      flipflops={3}
      onChange={({ factor }) => apply(factor)}
      onFallback={() => apply(0)}
    />
  )
}
