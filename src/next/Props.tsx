import React from 'react'
import * as THREE from 'three'
import { Outlines, RoundedBox } from '@react-three/drei'

// Personal objects, built in code: basketball, iPod, toy cars, sneaker boxes, mic,
// phone, mug. In the room they're painted; in the hero (`clay`) each is sculpted in
// one matte colour, like a clay maquette of the same thing.

type Clay = { clay?: string }

// A texture drawn on a canvas once, at the size given.
export function useCanvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void, deps: React.DependencyList = []): THREE.CanvasTexture {
  return React.useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    draw(canvas.getContext('2d')!)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    return texture
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

// What the clay versions are made of, set by the mood: matte clay, flat print ink,
// polished gold and chrome, or an inked drawing.
export type ClayFinish = 'matte' | 'print' | 'metal' | 'ink'
export const ClayFinishContext = React.createContext<ClayFinish>('matte')

const printRamp = (() => {
  const data = new Uint8Array([70, 255])
  const texture = new THREE.DataTexture(data, 2, 1, THREE.RedFormat)
  texture.minFilter = texture.magFilter = THREE.NearestFilter
  texture.needsUpdate = true
  return texture
})()
const inkRamp = (() => {
  const data = new Uint8Array([120, 200, 255])
  const texture = new THREE.DataTexture(data, 3, 1, THREE.RedFormat)
  texture.minFilter = texture.magFilter = THREE.NearestFilter
  texture.needsUpdate = true
  return texture
})()

function Mat({ clay, color, roughness = 0.5, metalness = 0, map }: Clay & { color: string; roughness?: number; metalness?: number; map?: THREE.Texture }): React.ReactElement {
  const finish = React.useContext(ClayFinishContext)
  if (!clay) return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} map={map ?? null} />
  if (finish === 'print') return <meshToonMaterial color={clay} gradientMap={printRamp} />
  if (finish === 'metal') return <meshStandardMaterial color={clay} roughness={0.16} metalness={1} envMapIntensity={1.4} />
  if (finish === 'ink') {
    return (
      <>
        <meshToonMaterial color={clay} gradientMap={inkRamp} />
        <Outlines thickness={0.0035} color="#15132b" />
      </>
    )
  }
  return <meshStandardMaterial color={clay} roughness={0.62} metalness={0} />
}

// ───────────── Basketball ─────────────
export function Basketball({ clay, radius = 0.12 }: Clay & { radius?: number }): React.ReactElement {
  const texture = useCanvasTexture(1024, 512, (ctx) => {
    ctx.fillStyle = '#d4621f'
    ctx.fillRect(0, 0, 1024, 512)
    // Pebbled leather.
    for (let i = 0; i < 9000; i++) {
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '255,180,120' : '80,30,10'},0.12)`
      ctx.fillRect(Math.random() * 1024, Math.random() * 512, 2, 2)
    }
    ctx.strokeStyle = '#1a0d06'
    ctx.lineWidth = 9
    // Seams: the equator, one meridian, and the two curved panel lines.
    ctx.beginPath(); ctx.moveTo(0, 256); ctx.lineTo(1024, 256); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(256, 0); ctx.lineTo(256, 512); ctx.moveTo(768, 0); ctx.lineTo(768, 512); ctx.stroke()
    for (const cx of [0, 512, 1024]) {
      ctx.beginPath()
      for (let y = 0; y <= 512; y += 4) {
        const x = cx + Math.sin((y / 512) * Math.PI) * 150 * (cx === 512 ? 1 : -1) * (cx === 1024 ? 1 : 1)
        if (y === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  })
  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[radius, 48, 32]} />
      {clay ? <Mat clay={clay} color="" /> : <meshStandardMaterial map={texture} roughness={0.75} />}
    </mesh>
  )
}

// ───────────── iPod classic ─────────────
export function IPod({ clay, nowPlaying = 'Hustleholic' }: Clay & { nowPlaying?: string }): React.ReactElement {
  const screen = useCanvasTexture(256, 192, (ctx) => {
    ctx.fillStyle = '#e9eef5'
    ctx.fillRect(0, 0, 256, 192)
    ctx.fillStyle = '#2b5fd9'
    ctx.fillRect(0, 0, 256, 26)
    ctx.fillStyle = '#fff'
    ctx.font = '600 16px Helvetica, Arial'
    ctx.fillText('Now Playing', 82, 19)
    ctx.fillStyle = '#111'
    ctx.font = '700 22px Helvetica, Arial'
    ctx.fillText(nowPlaying, 20, 80)
    ctx.font = '400 16px Helvetica, Arial'
    ctx.fillStyle = '#555'
    ctx.fillText('Playlist · Arian', 20, 108)
    ctx.fillStyle = '#c9d2df'
    ctx.fillRect(20, 150, 216, 8)
    ctx.fillStyle = '#2b5fd9'
    ctx.fillRect(20, 150, 92, 8)
  }, [nowPlaying])
  const w = 0.062
  const h = 0.104
  return (
    <group>
      <RoundedBox args={[w, h, 0.013]} radius={0.006} smoothness={4} castShadow>
        {clay ? <Mat clay={clay} color="" /> : <meshStandardMaterial color="#f4f4f2" roughness={0.18} />}
      </RoundedBox>
      <mesh position={[0, h * 0.2, 0.0066]}>
        <planeGeometry args={[w * 0.82, w * 0.62]} />
        {clay ? <Mat clay={clay} color="" /> : <meshBasicMaterial map={screen} toneMapped={false} />}
      </mesh>
      <mesh position={[0, -h * 0.22, 0.0067]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[w * 0.34, w * 0.34, 0.001, 48]} />
        <Mat clay={clay} color="#dcdcdc" roughness={0.4} />
      </mesh>
      <mesh position={[0, -h * 0.22, 0.0072]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[w * 0.12, w * 0.12, 0.001, 32]} />
        <Mat clay={clay} color="#f4f4f2" roughness={0.25} />
      </mesh>
    </group>
  )
}

// ───────────── Toy F1 car ─────────────
export function F1Car({ clay }: Clay): React.ReactElement {
  const red = <Mat clay={clay} color="#c8102e" roughness={0.3} metalness={0.2} />
  const black = <Mat clay={clay} color="#141414" roughness={0.6} />
  const white = <Mat clay={clay} color="#f2f2f2" roughness={0.35} />
  const wheel = (x: number, z: number, r: number, wdt: number): React.ReactElement => (
    <mesh key={`${x}${z}`} castShadow position={[x, r, z]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[r, r, wdt, 24]} />{black}
    </mesh>
  )
  return (
    <group>
      {/* Tub and nose. */}
      <mesh castShadow position={[0, 0.035, 0]}><boxGeometry args={[0.07, 0.035, 0.2]} />{red}</mesh>
      <mesh castShadow position={[0, 0.03, 0.14]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.012, 0.03, 0.1, 16]} />{red}</mesh>
      {/* Sidepods and engine cover. */}
      <mesh castShadow position={[0, 0.04, -0.05]}><boxGeometry args={[0.12, 0.03, 0.11]} />{red}</mesh>
      <mesh castShadow position={[0, 0.065, -0.06]} rotation={[-0.25, 0, 0]}><boxGeometry args={[0.03, 0.03, 0.12]} />{red}</mesh>
      {/* Cockpit and halo. */}
      <mesh position={[0, 0.056, 0.02]}><boxGeometry args={[0.04, 0.012, 0.05]} />{black}</mesh>
      <mesh position={[0, 0.07, 0.02]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.022, 0.003, 8, 24, Math.PI]} />{black}</mesh>
      {/* Wings. */}
      <mesh castShadow position={[0, 0.012, 0.19]}><boxGeometry args={[0.16, 0.006, 0.03]} />{white}</mesh>
      <mesh castShadow position={[0, 0.085, -0.12]}><boxGeometry args={[0.13, 0.006, 0.035]} />{red}</mesh>
      <mesh position={[0.063, 0.065, -0.12]}><boxGeometry args={[0.004, 0.045, 0.04]} />{black}</mesh>
      <mesh position={[-0.063, 0.065, -0.12]}><boxGeometry args={[0.004, 0.045, 0.04]} />{black}</mesh>
      {wheel(0.07, 0.11, 0.024, 0.026)}{wheel(-0.07, 0.11, 0.024, 0.026)}
      {wheel(0.075, -0.09, 0.028, 0.034)}{wheel(-0.075, -0.09, 0.028, 0.034)}
    </group>
  )
}

// ───────────── Toy sports car ─────────────
export function SportsCar({ clay, color = '#c8102e' }: Clay & { color?: string }): React.ReactElement {
  const body = <Mat clay={clay} color={color} roughness={0.22} metalness={0.35} />
  const glass = <Mat clay={clay} color="#1a2230" roughness={0.1} metalness={0.4} />
  const tyre = <Mat clay={clay} color="#121212" roughness={0.7} />
  return (
    <group>
      <RoundedBox args={[0.09, 0.03, 0.2]} radius={0.012} smoothness={4} position={[0, 0.03, 0]} castShadow>{body}</RoundedBox>
      <RoundedBox args={[0.072, 0.026, 0.09]} radius={0.012} smoothness={4} position={[0, 0.054, -0.015]} castShadow>{glass}</RoundedBox>
      {[[0.045, 0.065], [-0.045, 0.065], [0.045, -0.065], [-0.045, -0.065]].map(([x, z]) => (
        <mesh key={`${x}${z}`} castShadow position={[x, 0.018, z]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.018, 0.018, 0.016, 20]} />{tyre}</mesh>
      ))}
    </group>
  )
}

// ───────────── Sneaker box ─────────────
// Colourways only, no brand marks: a Chicago-style red/white/black and a classic suede black.
export function SneakerBox({ clay, kind }: Clay & { kind: 'ones' | 'suede' }): React.ReactElement {
  const label = useCanvasTexture(512, 160, (ctx) => {
    ctx.fillStyle = kind === 'ones' ? '#c8102e' : '#141414'
    ctx.fillRect(0, 0, 512, 160)
    ctx.fillStyle = kind === 'ones' ? '#111' : '#f2f2f2'
    ctx.fillRect(0, 118, 512, 42)
    ctx.fillStyle = '#ffffff'
    ctx.font = kind === 'ones' ? '400 96px Anton, Impact' : 'italic 700 74px Georgia'
    ctx.fillText(kind === 'ones' ? '1s' : 'Suede', 30, 100)
    ctx.font = '700 22px "Space Mono", monospace'
    ctx.fillStyle = kind === 'ones' ? '#fff' : '#141414'
    ctx.fillText(kind === 'ones' ? 'HIGH · CHICAGO' : 'CLASSIC · BLACK/WHITE', 30, 146)
  }, [kind])
  const base = kind === 'ones' ? '#c8102e' : '#1a1a1a'
  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 0.055, 0]}><boxGeometry args={[0.34, 0.11, 0.22]} /><Mat clay={clay} color={base} roughness={0.7} /></mesh>
      <mesh castShadow position={[0, 0.113, 0]}><boxGeometry args={[0.345, 0.014, 0.225]} /><Mat clay={clay} color={kind === 'ones' ? '#141414' : '#f2f2f2'} roughness={0.7} /></mesh>
      {!clay ? (
        <mesh position={[0, 0.055, 0.1105]}><planeGeometry args={[0.34, 0.106]} /><meshStandardMaterial map={label} roughness={0.7} /></mesh>
      ) : null}
    </group>
  )
}

// ───────────── Podcast mic ─────────────
export function PodcastMic({ clay }: Clay): React.ReactElement {
  return (
    <group>
      <mesh castShadow position={[0, 0.09, 0]}><capsuleGeometry args={[0.032, 0.09, 8, 24]} /><Mat clay={clay} color="#2a2a2c" roughness={0.35} metalness={0.6} /></mesh>
      <mesh castShadow position={[0, 0.14, 0]}><sphereGeometry args={[0.034, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><Mat clay={clay} color="#9aa0a6" roughness={0.3} metalness={0.8} /></mesh>
      <mesh castShadow position={[0, 0.018, 0]}><cylinderGeometry args={[0.012, 0.016, 0.04, 16]} /><Mat clay={clay} color="#1c1c1e" roughness={0.5} /></mesh>
    </group>
  )
}

// ───────────── Phone ─────────────
export function Phone({ clay }: Clay): React.ReactElement {
  return (
    <group>
      <RoundedBox args={[0.072, 0.15, 0.008]} radius={0.004} smoothness={4} castShadow><Mat clay={clay} color="#1d1d1f" roughness={0.3} metalness={0.4} /></RoundedBox>
      <mesh position={[0, 0, 0.0042]}><planeGeometry args={[0.066, 0.143]} /><Mat clay={clay} color="#e5482f" roughness={0.3} /></mesh>
    </group>
  )
}

// ───────────── Mug ─────────────
export function Mug({ clay }: Clay): React.ReactElement {
  return (
    <group>
      <mesh castShadow position={[0, 0.045, 0]}><cylinderGeometry args={[0.04, 0.036, 0.09, 32]} /><Mat clay={clay} color="#f4f1ea" roughness={0.3} /></mesh>
      <mesh castShadow position={[0.045, 0.048, 0]}><torusGeometry args={[0.022, 0.006, 10, 24]} /><Mat clay={clay} color="#f4f1ea" roughness={0.3} /></mesh>
    </group>
  )
}

// ───────────── Books ─────────────
export function Books({ count = 7, seed = 1 }: { count?: number; seed?: number }): React.ReactElement {
  const books = React.useMemo(() => {
    let s = seed
    const rand = (): number => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
    const colours = ['#1f3a5f', '#8a2a1f', '#d9c7a0', '#111', '#4a5a3a', '#c8102e', '#efe9de']
    let x = 0
    return Array.from({ length: count }, (_, i) => {
      const w = 0.025 + rand() * 0.02
      const h = 0.19 + rand() * 0.06
      const book = { x: x + w / 2, w, h, d: 0.14 + rand() * 0.03, color: colours[Math.floor(rand() * colours.length)], tilt: i === count - 1 ? -0.25 : 0 }
      x += w + 0.002
      return book
    })
  }, [count, seed])
  return (
    <group>
      {books.map((book, i) => (
        <mesh key={i} castShadow position={[book.x, book.h / 2, 0]} rotation={[0, 0, book.tilt]}>
          <boxGeometry args={[book.w, book.h, book.d]} />
          <meshStandardMaterial color={book.color} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// ───────────── Chess knight ─────────────
export function Knight({ clay, color = '#f4f1ea' }: Clay & { color?: string }): React.ReactElement {
  const base = React.useMemo(() => new THREE.LatheGeometry([
    new THREE.Vector2(0, 0), new THREE.Vector2(0.05, 0), new THREE.Vector2(0.05, 0.012), new THREE.Vector2(0.04, 0.02),
    new THREE.Vector2(0.042, 0.03), new THREE.Vector2(0.032, 0.04), new THREE.Vector2(0.028, 0.05), new THREE.Vector2(0, 0.05)
  ], 40), [])
  // The head: a horse's profile, extruded.
  const head = React.useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.028, 0)
    s.lineTo(0.03, 0)
    s.bezierCurveTo(0.034, 0.03, 0.02, 0.05, 0.034, 0.068)
    s.lineTo(0.052, 0.08)
    s.bezierCurveTo(0.058, 0.09, 0.05, 0.1, 0.04, 0.1)
    s.lineTo(0.02, 0.112)
    s.lineTo(0.012, 0.13)
    s.lineTo(0.002, 0.114)
    s.bezierCurveTo(-0.03, 0.11, -0.036, 0.07, -0.03, 0.04)
    s.closePath()
    const geometry = new THREE.ExtrudeGeometry(s, { depth: 0.036, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 4 })
    geometry.translate(0, 0, -0.018)
    return geometry
  }, [])
  return (
    <group>
      <mesh geometry={base} castShadow><Mat clay={clay} color={color} roughness={0.35} /></mesh>
      <mesh geometry={head} position={[0, 0.045, 0]} castShadow><Mat clay={clay} color={color} roughness={0.35} /></mesh>
    </group>
  )
}
