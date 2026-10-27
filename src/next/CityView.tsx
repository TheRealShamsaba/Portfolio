import React from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'

// Istanbul at night, through the studio window: a real photograph of the Süleymaniye
// Mosque across the Golden Horn, with Beyazıt Tower lit blue on the left (CC0, by
// Afurkanakin on Wikimedia Commons). It hangs 8 m behind the glass, so it shifts
// against the window frame as you walk past, the way a real view does.

const PHOTO = '/studio/istanbul-night.webp'
// 2048 × 1536. Framed so the door sees just over half of it (the mosque, the tower and
// the lit hillside, near one photo pixel per screen pixel) and the window seat sees
// nearly all of it. Its side edges fade into this sky, which carries on behind it.
const WIDTH = 12.5
const HEIGHT = 9.375
const SKY = '#2a2c34'

export default function CityView(): React.ReactElement {
  const photo = useTexture(PHOTO)
  React.useMemo(() => {
    photo.colorSpace = THREE.SRGBColorSpace
    photo.anisotropy = 8
  }, [photo])

  // The window opening runs x 0–2.6, y 0.85–2.4 in the back wall at z = -2.6. Seen from
  // the door (0, 1.55, 2.05), the window's centre lands on the photo's centre.
  return (
    <group>
      <mesh position={[3.54, 1.7, -10.6]}>
        <planeGeometry args={[WIDTH, HEIGHT]} />
        <meshBasicMaterial map={photo} toneMapped={false} fog={false} />
      </mesh>
      <mesh position={[3.54, 6, -10.7]}>
        <planeGeometry args={[80, 40]} />
        <meshBasicMaterial color={SKY} toneMapped={false} fog={false} />
      </mesh>
      {/* The glass: a faint cool tint, so the view reads as through a pane, not a hole. */}
      <mesh position={[1.3, 1.625, -2.57]}>
        <planeGeometry args={[2.6, 1.55]} />
        <meshBasicMaterial color="#9fb2ff" transparent opacity={0.06} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  )
}

useTexture.preload(PHOTO)
