import React from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { Environment, Html, Lightformer, RoundedBox, SoftShadows, useCursor, useGLTF, useTexture } from '@react-three/drei'
import MoodEffects from './MoodEffects'
import type { Mood } from './mood'
import { scrollToId } from '../site/motion'
import { clients, dripApp, knightvision, medium, profile } from '../site/data'
import { Basketball, Books, F1Car, IPod, Mug, PodcastMic, SneakerBox, SportsCar, useCanvasTexture } from './Props'
import useInView from './useInView'
import CityView from './CityView'
import { KnightVisionBoard } from './KnightVisionBoard'
import { Quality } from './quality'

// The studio: my room in Istanbul at night, in real metres. You walk it by tapping
// the glowing spots on the floor and look around by dragging. Everything that matters
// opens. Furniture models are CC0 from Poly Haven; the rest is built here.

type Vec = [number, number, number]

// Where you can stand, and what you look at from there.
const SPOTS: { id: string; label: string; pos: Vec; look: Vec }[] = [
  { id: 'door', label: 'Door', pos: [0, 1.55, 2.05], look: [0, 1.0, -1.4] },
  { id: 'desk', label: 'Desk', pos: [-1.4, 1.38, -0.7], look: [-1.5, 1.0, -2.4] },
  { id: 'window', label: 'Window', pos: [0.65, 1.32, -0.45], look: [1.05, 0.62, -1.95] },
  { id: 'shelf', label: 'Shelf', pos: [0.95, 1.5, 0.85], look: [2.8, 1.1, 0.95] },
  { id: 'wall', label: 'Wall', pos: [-0.95, 1.45, 0.55], look: [-2.95, 1.3, 0.55] }
]

type Spot = 'work' | 'drip' | 'chess' | 'show' | 'posters' | 'music' | 'hoops' | 'cars' | 'contact'

type Stop = { spot: string; look: Vec; dot: Vec; kicker: string; title: string; text: string; go?: string; link?: [string, string]; embed?: 'music' | 'show'; play?: boolean }

const STOPS: Record<Spot, Stop> = {
  work: {
    spot: 'desk', look: [-1.5, 1.04, -2.35], dot: [-1.5, 1.32, -2.32],
    kicker: 'On the monitor', title: 'Client work', go: 'work',
    text: 'A medical catalogue in Tehran, a car dealer in three languages in Istanbul, and my studio’s own site. The screen cycles through all three.'
  },
  drip: {
    spot: 'desk', look: [-0.82, 0.86, -2.12], dot: [-0.82, 1.02, -2.12],
    kicker: 'On the desk', title: 'Drip', go: 'drip', link: ['Join the waitlist', dripApp.url],
    text: 'My own app: one photo of your outfit, one honest answer, every swap from clothes you already own. Private beta.'
  },
  chess: {
    spot: 'window', look: [1.05, 0.6, -1.95], dot: [1.05, 0.82, -1.95],
    kicker: 'By the window', title: knightvision.title, link: ['Read the full story', knightvision.url], play: true,
    text: `${knightvision.line} Built with BakerDmo. The real network runs right here in your browser: play it, and watch what it’s weighing before every move.`
  },
  show: {
    spot: 'wall', look: [-2.7, 0.98, 0.25], dot: [-2.68, 1.32, 0.25],
    kicker: 'On air', title: 'The Reasonable Show', embed: 'show', link: ['The channel', 'https://www.youtube.com/@TheReasonableShow'],
    text: 'My talk show about life, honesty and the things we tell ourselves. Flip the channels.'
  },
  posters: {
    spot: 'wall', look: [-2.95, 1.7, -1.05], dot: [-2.9, 2.15, -1.05],
    kicker: 'On the wall', title: 'Posters', go: 'posters',
    text: 'I make these for fun, because I like art. The one with Miles is for the Spider-Verse, the best-looking films ever made.'
  },
  music: {
    spot: 'shelf', look: [2.7, 1.22, 0.6], dot: [2.7, 1.3, 0.6], embed: 'music',
    kicker: 'On the shelf', title: 'Hustleholic',
    text: 'What’s on while I work. Press play.'
  },
  hoops: {
    spot: 'shelf', look: [2.95, 1.55, 1.8], dot: [2.92, 2.12, 1.8],
    kicker: 'Hoops', title: 'Bulls, Heat, Wolves',
    text: 'Derrick Rose will always be my guy. Right now it’s Ant-Man. Chicago, Miami and Minnesota, in that order of heartbreak.'
  },
  cars: {
    spot: 'shelf', look: [2.74, 0.5, 0.45], dot: [2.74, 0.82, 0.42],
    kicker: 'On the shelf', title: 'Cars',
    text: 'Ferrari, F1, cars in general. The red ones on the shelf are the closest I get on a Tuesday. On my feet: Jordan 1s and Puma Suedes.'
  },
  contact: {
    spot: 'shelf', look: [2.95, 1.9, -1.15], dot: [2.9, 2.2, -1.15],
    kicker: 'The sign’s on', title: 'Open for work', go: 'contact', link: [profile.email, `mailto:${profile.email}`],
    text: 'Tell me what the business does and where it hurts. I’ll take it from there.'
  }
}

const EPISODES: [string, string][] = [
  ['9iLwSkk9k6U', 'EP0.3 · Distractions'],
  ['tw4cTelvIQA', 'EP0.2 · Why brutal honesty sets you free'],
  ['7Vks-qv7RjY', 'EP0.1 · Friendship and being alone'],
  ['mESzKmGGksA', 'EP10 · Rome, Mafia & Good Boy'],
  ['Z0DnbfvER1w', 'EP09 · Lap the Library'],
  ['NXwHao4D4f4', 'EP08 · The New Start']
]
const PLAYLIST = 'https://embed.music.apple.com/tr/playlist/hustleholic/pl.u-d2b0k40uMpEJb93'

// ───────────── Camera: walk between spots, drag to look ─────────────

const yawPitch = (from: THREE.Vector3, to: THREE.Vector3): [number, number] => {
  const d = to.clone().sub(from)
  return [Math.atan2(-d.x, -d.z), Math.asin(THREE.MathUtils.clamp(d.y / d.length(), -1, 1))]
}
const shortest = (from: number, to: number): number => from + Math.atan2(Math.sin(to - from), Math.cos(to - from))

function Rig({ spot, focus, phone, drag }: { spot: number; focus: Spot | null; phone: boolean; drag: React.MutableRefObject<{ yaw: number; pitch: number }> }): null {
  const { camera } = useThree()
  const angles = React.useRef<[number, number]>([0, -0.2])
  const goal = React.useMemo(() => new THREE.Vector3(), [])
  const look = React.useMemo(() => new THREE.Vector3(), [])
  useFrame((_, delta) => {
    const here = SPOTS[spot]
    goal.set(...here.pos)
    look.set(...(focus ? STOPS[focus].look : here.look))
    // A portrait screen sees a narrow slice, so on a phone you stand a step further back.
    if (phone) {
      const back = goal.clone().sub(look).setY(0).normalize().multiplyScalar(focus ? 0.35 : 0.6)
      goal.add(back)
    }
    const [yaw, pitch] = yawPitch(goal, look)
    const targetYaw = yaw + drag.current.yaw
    const targetPitch = THREE.MathUtils.clamp(pitch + drag.current.pitch, -1.1, 0.9)
    const ease = 1 - Math.exp(-delta * 2.8)
    camera.position.lerp(goal, ease)
    angles.current[0] = THREE.MathUtils.lerp(angles.current[0], shortest(angles.current[0], targetYaw), ease)
    angles.current[1] = THREE.MathUtils.lerp(angles.current[1], targetPitch, ease)
    camera.rotation.set(angles.current[1], angles.current[0], 0, 'YXZ')
  })
  return null
}

// A glowing ring on the floor: tap it to walk there.
function FloorSpot({ index, onWalk }: { index: number; onWalk: (i: number) => void }): React.ReactElement {
  const [hover, setHover] = React.useState(false)
  const ring = React.useRef<THREE.Mesh>(null)
  useCursor(hover)
  const here = SPOTS[index]
  useFrame(({ clock }) => {
    if (ring.current) ring.current.scale.setScalar((hover ? 1.15 : 1) + Math.sin(clock.elapsedTime * 2.4 + index) * 0.05)
  })
  return (
    <group position={[here.pos[0], 0.012, here.pos[2]]}>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={(event) => { event.stopPropagation(); setHover(true) }}
        onPointerOut={() => setHover(false)}
        onClick={(event) => { event.stopPropagation(); if (event.delta < 8) onWalk(index) }}>
        <ringGeometry args={[0.16, 0.22, 48]} />
        <meshBasicMaterial color="#cfd5ff" transparent opacity={hover ? 0.95 : 0.6} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.16, 48]} />
        <meshBasicMaterial color="#8d95f3" transparent opacity={0.18} />
      </mesh>
      <Html position={[0, 0.06, 0]} center zIndexRange={[15, 0]} wrapperClass="ns-dot-wrap">
        <button type="button" className="nr-spot" onClick={(event) => { event.stopPropagation(); onWalk(index) }} onPointerDown={(event) => event.stopPropagation()}>{here.label}</button>
      </Html>
    </group>
  )
}

// Something you can open: lifts a touch on hover, opens its card on tap.
function Hotspot({ id, onPick, children, showDot }: { id: Spot; onPick: (id: Spot) => void; children: React.ReactNode; showDot: boolean }): React.ReactElement {
  const [hover, setHover] = React.useState(false)
  useCursor(hover)
  return (
    <group
      onPointerOver={(event) => { event.stopPropagation(); setHover(true) }}
      onPointerOut={() => setHover(false)}
      onClick={(event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); if (event.delta < 8) onPick(id) }}
    >
      {children}
      {showDot ? (
        <Html position={STOPS[id].dot} center zIndexRange={[20, 0]} wrapperClass="ns-dot-wrap">
          {/* The dot lives inside the canvas wrapper; stop its click there or the canvas reads it as a miss. */}
          <button type="button" className={`ns-dot ${hover ? 'is-hover' : ''}`} onClick={(event) => { event.stopPropagation(); onPick(id) }} onPointerDown={(event) => event.stopPropagation()} aria-label={STOPS[id].title}>
            <i /><span>{STOPS[id].title}</span>
          </button>
        </Html>
      ) : null}
    </group>
  )
}

function Model({ name, ...props }: { name: string } & JSX.IntrinsicElements['group']): React.ReactElement {
  const { scene } = useGLTF(`/studio/${name}.glb`)
  const copy = React.useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((object) => {
      if ((object as THREE.Mesh).isMesh) { object.castShadow = true; object.receiveShadow = true }
    })
    return clone
  }, [scene])
  return <group {...props}><primitive object={copy} /></group>
}

// ───────────── The room ─────────────

const SHELF = [0.12, 0.63, 1.135, 1.64]

const W = 6
const D = 5.2
const H = 2.8

function Shell(): React.ReactElement {
  const floor = useCanvasTexture(1024, 1024, (ctx) => {
    const rows = 8
    for (let r = 0; r < rows; r++) {
      let x = -((r * 173) % 400)
      while (x < 1024) {
        const len = 300 + ((x * 7 + r * 31) % 260)
        const tone = 150 + ((x + r * 47) % 40)
        ctx.fillStyle = `rgb(${tone}, ${Math.round(tone * 0.72)}, ${Math.round(tone * 0.5)})`
        ctx.fillRect(x, r * 128, len, 128)
        ctx.strokeStyle = 'rgba(40, 22, 10, 0.35)'
        ctx.lineWidth = 3
        ctx.strokeRect(x, r * 128, len, 128)
        for (let g = 0; g < 7; g++) {
          ctx.strokeStyle = `rgba(70, 40, 18, ${0.08 + (g % 3) * 0.04})`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          const y = r * 128 + 12 + g * 16
          ctx.moveTo(x, y)
          ctx.bezierCurveTo(x + len * 0.3, y + 6, x + len * 0.6, y - 6, x + len, y + 2)
          ctx.stroke()
        }
        x += len
      }
    }
  })
  floor.wrapS = floor.wrapT = THREE.RepeatWrapping
  floor.repeat.set(2, 2)

  const rug = useCanvasTexture(1024, 700, (ctx) => {
    // A kilim: bands of stepped diamonds in madder red, indigo and cream.
    ctx.fillStyle = '#8c2a22'
    ctx.fillRect(0, 0, 1024, 700)
    ctx.fillStyle = '#efe4cf'
    ctx.fillRect(30, 30, 964, 640)
    ctx.fillStyle = '#8c2a22'
    ctx.fillRect(52, 52, 920, 596)
    const band = (y: number, colour: string): void => {
      for (let x = 80; x < 960; x += 110) {
        ctx.fillStyle = colour
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 50, y - 60); ctx.lineTo(x + 100, y); ctx.lineTo(x + 50, y + 60); ctx.closePath(); ctx.fill()
        ctx.fillStyle = '#efe4cf'
        ctx.beginPath(); ctx.moveTo(x + 30, y); ctx.lineTo(x + 50, y - 24); ctx.lineTo(x + 70, y); ctx.lineTo(x + 50, y + 24); ctx.closePath(); ctx.fill()
      }
    }
    band(200, '#1f2a55')
    band(350, '#d9a441')
    band(500, '#1f2a55')
    ctx.fillStyle = 'rgba(0,0,0,0.08)'
    for (let i = 0; i < 4000; i++) ctx.fillRect(Math.random() * 1024, Math.random() * 700, 2, 2)
  })

  const plaster = <meshStandardMaterial color="#d6cdbf" roughness={0.95} />
  const gallery = <meshStandardMaterial color="#232845" roughness={0.9} />
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial map={floor} roughness={0.55} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0.05]}>
        <planeGeometry args={[2.7, 1.85]} />
        <meshStandardMaterial map={rug} roughness={0.95} />
      </mesh>
      {/* Back wall, cut around the window. */}
      <mesh receiveShadow position={[-1.5, H / 2, -D / 2]}><boxGeometry args={[3.0, H, 0.12]} />{plaster}</mesh>
      <mesh receiveShadow position={[2.8, H / 2, -D / 2]}><boxGeometry args={[0.4, H, 0.12]} />{plaster}</mesh>
      <mesh receiveShadow position={[1.3, 0.425, -D / 2]}><boxGeometry args={[2.6, 0.85, 0.12]} />{plaster}</mesh>
      <mesh receiveShadow position={[1.3, 2.6, -D / 2]}><boxGeometry args={[2.6, 0.4, 0.12]} />{plaster}</mesh>
      {/* Window frame and mullion. */}
      {[[1.3, 0.86, 2.62, 0.04], [1.3, 2.39, 2.62, 0.04]].map(([x, y, w, h]) => (
        <mesh key={y} position={[x, y, -D / 2 + 0.04]}><boxGeometry args={[w, h, 0.08]} /><meshStandardMaterial color="#141414" roughness={0.4} /></mesh>
      ))}
      {[0.01, 1.3, 2.59].map((x) => (
        <mesh key={x} position={[x, 1.625, -D / 2 + 0.04]}><boxGeometry args={[0.04, 1.55, 0.08]} /><meshStandardMaterial color="#141414" roughness={0.4} /></mesh>
      ))}
      <mesh position={[1.3, 0.9, -D / 2 + 0.16]}><boxGeometry args={[2.7, 0.04, 0.26]} /><meshStandardMaterial color="#efe9de" roughness={0.6} /></mesh>
      {/* Side walls: the gallery wall is painted deep blue. */}
      <mesh receiveShadow position={[-W / 2, H / 2, 0]}><boxGeometry args={[0.12, H, D]} />{gallery}</mesh>
      <mesh receiveShadow position={[W / 2, H / 2, 0]}><boxGeometry args={[0.12, H, D]} />{plaster}</mesh>
      {/* Front wall with the door, behind you as you walk in. */}
      <mesh receiveShadow position={[0.6, H / 2, D / 2]}><boxGeometry args={[4.8, H, 0.12]} />{plaster}</mesh>
      <mesh position={[-2.55, 2.4, D / 2]}><boxGeometry args={[0.9, 0.8, 0.12]} />{plaster}</mesh>
      <mesh position={[-2.55, 1.0, D / 2 - 0.02]}><boxGeometry args={[0.86, 2.0, 0.06]} /><meshStandardMaterial color="#3a2a22" roughness={0.6} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}><planeGeometry args={[W, D]} /><meshStandardMaterial color="#cfc6b8" roughness={1} side={THREE.DoubleSide} /></mesh>
      {/* Skirting. */}
      <mesh position={[-1.6, 0.05, -D / 2 + 0.07]}><boxGeometry args={[2.8, 0.1, 0.02]} /><meshStandardMaterial color="#efe9de" /></mesh>
    </group>
  )
}

// ───────────── The desk ─────────────

function Monitor(): React.ReactElement {
  const textures = useTexture(clients.map((client) => client.image))
  const screen = React.useRef<THREE.MeshBasicMaterial>(null)
  const fracs = React.useMemo(() => textures.map((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    const image = texture.image as HTMLImageElement
    const visible = Math.min(1, (image.width / 1.7) / image.height)
    texture.repeat.set(1, visible)
    return visible
  }), [textures])
  // Each site gets eight seconds, scrolling top to bottom while it's on.
  useFrame(({ clock }) => {
    const t = clock.elapsedTime / 8
    const i = Math.floor(t) % textures.length
    const local = t % 1
    const texture = textures[i]
    texture.offset.y = (1 - fracs[i]) * (1 - Math.min(1, local * 1.15))
    if (screen.current && screen.current.map !== texture) { screen.current.map = texture; screen.current.needsUpdate = true }
  })
  return (
    <group position={[-1.5, 0.74, -2.38]}>
      <mesh castShadow position={[0, 0.006, 0.02]}><boxGeometry args={[0.22, 0.012, 0.16]} /><meshStandardMaterial color="#c9ccd1" metalness={0.8} roughness={0.3} /></mesh>
      <mesh castShadow position={[0, 0.16, 0]}><boxGeometry args={[0.05, 0.3, 0.02]} /><meshStandardMaterial color="#c9ccd1" metalness={0.8} roughness={0.3} /></mesh>
      <group position={[0, 0.33, 0.02]}>
        <RoundedBox args={[0.64, 0.38, 0.025]} radius={0.008} smoothness={4} castShadow>
          <meshStandardMaterial color="#1b1b1d" metalness={0.5} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0.006, 0.0131]}>
          <planeGeometry args={[0.62, 0.345]} />
          <meshBasicMaterial ref={screen} map={textures[0]} toneMapped={false} />
        </mesh>
      </group>
      <rectAreaLight position={[0, 0.33, 0.1]} width={0.6} height={0.34} intensity={3} color="#dfe7ff" />
    </group>
  )
}

function Keyboard(): React.ReactElement {
  const keys = useCanvasTexture(512, 160, (ctx) => {
    ctx.fillStyle = '#2a2a2d'
    ctx.fillRect(0, 0, 512, 160)
    const rows = [14, 14, 13, 12, 9]
    rows.forEach((n, r) => {
      const w = 512 / 14.6
      for (let k = 0; k < n; k++) {
        const wide = r === 4 && k === 4 ? 5 : 1
        ctx.fillStyle = '#3c3c40'
        const x = 6 + k * w + (r === 4 && k > 4 ? w * 4 : 0) + r * 4
        ctx.fillRect(x, 6 + r * 30, w * wide - 4, 26)
      }
    })
  })
  return (
    <group position={[-1.5, 0.74, -2.02]}>
      <mesh castShadow position={[0, 0.008, 0]}><boxGeometry args={[0.44, 0.016, 0.14]} /><meshStandardMaterial color="#2a2a2d" roughness={0.6} /></mesh>
      <mesh position={[0, 0.0165, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.43, 0.13]} /><meshStandardMaterial map={keys} roughness={0.6} /></mesh>
      <mesh castShadow position={[0.32, 0.012, 0.01]} scale={[1, 0.5, 1.5]}><sphereGeometry args={[0.03, 24, 16]} /><meshStandardMaterial color="#2a2a2d" roughness={0.4} /></mesh>
    </group>
  )
}

function Desk(): React.ReactElement {
  const oak = <meshStandardMaterial color="#b98a5e" roughness={0.55} />
  const steel = <meshStandardMaterial color="#1c1c1e" metalness={0.6} roughness={0.4} />
  return (
    <group>
      <mesh castShadow receiveShadow position={[-1.5, 0.72, -2.15]}><boxGeometry args={[1.7, 0.04, 0.78]} />{oak}</mesh>
      {[[-2.3, -2.48], [-0.7, -2.48], [-2.3, -1.82], [-0.7, -1.82]].map(([x, z]) => (
        <mesh key={`${x}${z}`} castShadow position={[x, 0.35, z]}><boxGeometry args={[0.04, 0.7, 0.04]} />{steel}</mesh>
      ))}
      <mesh position={[-1.5, 0.66, -2.48]}><boxGeometry args={[1.6, 0.06, 0.03]} />{steel}</mesh>
    </group>
  )
}

function DripPhone(): React.ReactElement {
  const texture = useTexture(dripApp.chapters[1].screen)
  texture.colorSpace = THREE.SRGBColorSpace
  return (
    <group position={[-0.82, 0.74, -2.12]} rotation={[0, -0.4, 0]}>
      <mesh castShadow position={[0, 0.015, 0.02]}><boxGeometry args={[0.08, 0.03, 0.06]} /><meshStandardMaterial color="#e5482f" roughness={0.45} /></mesh>
      <mesh position={[0, 0.1, 0]} rotation={[-0.18, 0, 0]}>
        <planeGeometry args={[0.08, 0.08 * (1246 / 586)]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
    </group>
  )
}

// ───────────── Walls: posters, hoops, the sign ─────────────

function Framed({ src, position, height, rotation = [0, Math.PI / 2, 0] }: { src: string; position: Vec; height: number; rotation?: Vec }): React.ReactElement {
  const texture = useTexture(medium(src))
  texture.colorSpace = THREE.SRGBColorSpace
  const image = texture.image as HTMLImageElement
  const width = height * (image.width / image.height)
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow position={[0, 0, -0.012]}><boxGeometry args={[width + 0.05, height + 0.05, 0.024]} /><meshStandardMaterial color="#111" roughness={0.5} /></mesh>
      <mesh position={[0, 0, 0.001]}><planeGeometry args={[width, height]} /><meshStandardMaterial map={texture} roughness={0.6} /></mesh>
    </group>
  )
}

// Typographic posters for the teams and players: names and numbers only.
function TypePoster({ kind, position, rotation }: { kind: 'rose' | 'ant' | 'miami'; position: Vec; rotation: Vec }): React.ReactElement {
  const texture = useCanvasTexture(600, 840, (ctx) => {
    const theme = {
      rose: { bg: '#c8102e', ink: '#0d0d0d', top: 'D. ROSE', num: '1', city: 'CHICAGO', line: 'THE YOUNGEST MVP. ALWAYS.' },
      ant: { bg: '#0c2340', ink: '#78be20', top: 'ANT-MAN', num: '5', city: 'MINNESOTA', line: 'NOW IT’S HIS TURN.' },
      miami: { bg: '#f7d9e3', ink: '#0e7c86', top: 'MIAMI', num: '305', city: 'SOUTH BEACH', line: 'HEAT CULTURE.' }
    }[kind]
    ctx.fillStyle = theme.bg
    ctx.fillRect(0, 0, 600, 840)
    ctx.fillStyle = theme.ink
    ctx.font = '400 92px Anton, Impact'
    ctx.fillText(theme.top, 44, 130)
    ctx.font = `400 ${kind === 'miami' ? 300 : 520}px Anton, Impact`
    ctx.fillStyle = kind === 'rose' ? '#ffffff' : theme.ink
    ctx.fillText(theme.num, 40, kind === 'miami' ? 520 : 640)
    ctx.fillStyle = theme.ink
    ctx.fillRect(44, 690, 512, 6)
    ctx.font = '700 34px "Space Mono", monospace'
    ctx.fillText(theme.city, 44, 750)
    ctx.font = '400 22px "Space Mono", monospace'
    ctx.fillText(theme.line, 44, 795)
    ctx.fillStyle = 'rgba(0,0,0,0.12)'
    for (let i = 0; i < 6000; i++) ctx.fillRect(Math.random() * 600, Math.random() * 840, 2, 2)
  }, [kind])
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow position={[0, 0, -0.008]}><boxGeometry args={[0.47, 0.65, 0.016]} /><meshStandardMaterial color="#f4f1ea" roughness={0.6} /></mesh>
      <mesh position={[0, 0, 0.001]}><planeGeometry args={[0.43, 0.6]} /><meshStandardMaterial map={texture} roughness={0.7} /></mesh>
    </group>
  )
}

function Neon(): React.ReactElement {
  const texture = useCanvasTexture(1024, 400, (ctx) => {
    ctx.clearRect(0, 0, 1024, 400)
    ctx.textAlign = 'center'
    ctx.font = '400 150px "Permanent Marker", cursive'
    ctx.shadowColor = '#ff4f8b'
    ctx.shadowBlur = 40
    ctx.fillStyle = '#ffd0df'
    ctx.fillText('open', 512, 170)
    ctx.font = '400 110px "Permanent Marker", cursive'
    ctx.fillText('for work', 512, 330)
  })
  return (
    <group position={[2.93, 1.92, -1.15]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh><planeGeometry args={[1.0, 0.39]} /><meshBasicMaterial map={texture} transparent toneMapped={false} color={new THREE.Color(2.2, 1.6, 1.8)} /></mesh>
      <pointLight position={[0, 0, 0.4]} color="#ff4f8b" intensity={2.5} distance={3} decay={1.6} />
    </group>
  )
}

// ───────────── The TV ─────────────

// Four frames of static, made once and cycled, so the TV costs almost nothing per frame.
let staticFrames: ImageData[] | null = null
function noise(ctx: CanvasRenderingContext2D, frame: number): ImageData {
  if (!staticFrames) {
    staticFrames = Array.from({ length: 4 }, () => {
      const image = ctx.createImageData(320, 240)
      for (let i = 0; i < image.data.length; i += 4) {
        const v = 16 + Math.random() * 55
        image.data[i] = v; image.data[i + 1] = v + 4; image.data[i + 2] = v + 26; image.data[i + 3] = 255
      }
      return image
    })
  }
  return staticFrames[frame % staticFrames.length]
}

function drawOnAir(ctx: CanvasRenderingContext2D, time: number): void {
  const channel = Math.floor(time / 5) % EPISODES.length
  ctx.putImageData(noise(ctx, Math.floor(time * 12)), 0, 0)
  ctx.fillStyle = '#ff2a1a'
  ctx.beginPath(); ctx.arc(62, 58, 8, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = '700 18px Helvetica, Arial'
  ctx.fillText('ON AIR', 78, 64)
  ctx.fillText(`CH ${String(channel + 1).padStart(2, '0')}`, 204, 64)
  ctx.fillStyle = '#f3b224'
  ctx.fillRect(46, 150, 228, 28)
  ctx.fillStyle = '#111'
  ctx.font = '700 15px Helvetica, Arial'
  ctx.fillText('THE REASONABLE SHOW', 56, 170)
  ctx.fillStyle = '#fff'
  ctx.font = '400 13px Helvetica, Arial'
  ctx.fillText(EPISODES[channel][1].slice(0, 30), 50, 198)
  for (let y = 0; y < 240; y += 3) { ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(0, y, 320, 1) }
}

// The CRT's glass bulges toward you, so the picture is a curved patch that follows it.
// Measured from the model: centre (0, 0.26), about 0.30 × 0.20 m, peaking at z 0.122
// and falling back about 2.6 cm toward the left and right edges.
function OnAirScreen(): React.ReactElement {
  const canvas = React.useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 320
    c.height = 240
    drawOnAir(c.getContext('2d')!, 0)
    return c
  }, [])
  const texture = React.useMemo(() => { const t = new THREE.CanvasTexture(canvas); t.colorSpace = THREE.SRGBColorSpace; return t }, [canvas])
  const geometry = React.useMemo(() => {
    const plane = new THREE.PlaneGeometry(0.29, 0.2, 24, 16)
    const position = plane.attributes.position
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i)
      const y = position.getY(i)
      position.setZ(i, -(1.0 * x * x + 1.2 * y * y))
    }
    plane.computeVertexNormals()
    return plane
  }, [])
  const last = React.useRef(0)
  useFrame(({ clock }) => {
    if (clock.elapsedTime - last.current < 0.08) return
    last.current = clock.elapsedTime
    drawOnAir(canvas.getContext('2d')!, clock.elapsedTime)
    texture.needsUpdate = true
  })
  return (
    <mesh geometry={geometry} position={[-0.002, 0.26, 0.1255]}>
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  )
}

// ───────────── Everything in its place ─────────────

function Furniture({ focus, spot, onPick }: { focus: Spot | null; spot: number; onPick: (id: Spot) => void }): React.ReactElement {
  const dot = (id: Spot): boolean => !focus && STOPS[id].spot === SPOTS[spot].id
  return (
    <>
      <Shell />
      <CityView />
      <Desk />
      <Keyboard />
      <Model name="desk_lamp_arm_01" position={[-2.2, 0.74 + 0.09, -2.32]} rotation={[0, -1.1, 0]} />
      <group position={[-2.05, 0.74, -1.95]}><Mug /></group>
      <Model name="modern_arm_chair_01" position={[-1.45, 0, -1.25]} rotation={[0, Math.PI, 0]} />
      <Model name="modern_ceiling_lamp_01" position={[0, H - 1.173, 0]} />
      <Model name="potted_plant_02" position={[2.55, 0, -2.15]} scale={1.2} />

      <Hotspot id="work" onPick={onPick} showDot={dot('work')}><Monitor /></Hotspot>
      <Hotspot id="drip" onPick={onPick} showDot={dot('drip')}><DripPhone /></Hotspot>

      {/* The chess corner by the window. */}
      <Hotspot id="chess" onPick={onPick} showDot={dot('chess')}>
        <group position={[1.05, 0, -1.95]}>
          <mesh castShadow receiveShadow position={[0, 0.28, 0]}><cylinderGeometry args={[0.04, 0.14, 0.56, 24]} /><meshStandardMaterial color="#2b211c" roughness={0.6} /></mesh>
          <mesh castShadow receiveShadow position={[0, 0.57, 0]}><cylinderGeometry args={[0.34, 0.34, 0.025, 48]} /><meshStandardMaterial color="#3a2a22" roughness={0.45} /></mesh>
          <Model name="chess_set" position={[0, 0.583, 0]} scale={0.95} rotation={[0, 0.4, 0]} />
        </group>
      </Hotspot>
      <Model name="mid_century_lounge_chair" position={[1.95, 0, -1.3]} rotation={[0, -2.35, 0]} />

      {/* The gallery wall: my posters over the media cabinet. */}
      <Hotspot id="posters" onPick={onPick} showDot={dot('posters')}>
        <Framed src="/posters/satire-maximum-effort.webp" position={[-2.93, 1.68, -1.05]} height={0.95} />
        <Framed src="/posters/concept-greatness-and-honor.webp" position={[-2.93, 1.78, -0.15]} height={0.72} />
        <Framed src="/posters/identity-be-the-man-you-want.webp" position={[-2.93, 1.66, 0.75]} height={0.66} />
        <Framed src="/posters/concept-impermanence.webp" position={[-2.93, 1.74, 1.55]} height={0.6} />
        <Framed src="/posters/concept-perspective.webp" position={[-2.93, 1.58, -1.95]} height={0.55} />
      </Hotspot>
      <Model name="modern_wooden_cabinet" position={[-2.72, 0, 0.55]} rotation={[0, Math.PI / 2, 0]} />
      <Hotspot id="show" onPick={onPick} showDot={dot('show')}>
        <group position={[-2.7, 0.68, 0.25]} rotation={[0, Math.PI / 2, 0]} scale={1.7}>
          <Model name="television_02" />
          <OnAirScreen />
          <pointLight position={[0, 0.2, 0.3]} color="#9fb4ff" intensity={0.8} distance={1.6} decay={2} />
        </group>
      </Hotspot>
      <Model name="gaming_console" position={[-2.72, 0.68, 1.25]} rotation={[0, Math.PI / 2, 0]} />
      <group position={[-2.75, 0.68, 1.65]} rotation={[0, Math.PI / 2, 0]}><PodcastMic /></group>

      {/* The shelf: plank tops measured from the model at 0.12, 0.63, 1.135 and 1.64 m.
          Turned to face the room, its width runs along z from 0.15 to 0.75. */}
      <Model name="steel_frame_shelves_02" position={[2.72, 0, 0.45]} rotation={[0, -Math.PI / 2, 0]} />
      <Hotspot id="cars" onPick={onPick} showDot={dot('cars')}>
        {/* Bottom shelf: the shoeboxes, stacked. */}
        <group position={[2.74, SHELF[0], 0.45]} rotation={[0, -Math.PI / 2, 0]}><SneakerBox kind="suede" /></group>
        <group position={[2.74, SHELF[0] + 0.127, 0.46]} rotation={[0, -Math.PI / 2 + 0.06, 0]}><SneakerBox kind="ones" /></group>
        {/* Second shelf: the cars, angled like they're on display. */}
        <group position={[2.74, SHELF[1], 0.58]} rotation={[0, -Math.PI / 2 - 0.5, 0]} scale={1.15}><F1Car /></group>
        <group position={[2.74, SHELF[1], 0.27]} rotation={[0, -Math.PI / 2 + 0.45, 0]} scale={1.2}><SportsCar /></group>
      </Hotspot>
      {/* Third shelf: books, and the iPod standing at the end of them. */}
      <group position={[2.76, SHELF[2], 0.17]} rotation={[0, -Math.PI / 2, 0]}><Books count={7} seed={3} /></group>
      <Hotspot id="music" onPick={onPick} showDot={dot('music')}>
        <group position={[2.68, SHELF[2] + 0.083, 0.6]} rotation={[-0.12, -Math.PI / 2, 0]} scale={1.6}><IPod /></group>
      </Hotspot>
      {/* Fourth shelf: more books, one leaning. */}
      <group position={[2.76, SHELF[3], 0.17]} rotation={[0, -Math.PI / 2, 0]}><Books count={10} seed={8} /></group>

      {/* Hoops corner. */}
      <Hotspot id="hoops" onPick={onPick} showDot={dot('hoops')}>
        <TypePoster kind="rose" position={[2.93, 1.62, 1.45]} rotation={[0, -Math.PI / 2, 0]} />
        <TypePoster kind="ant" position={[2.93, 1.62, 2.02]} rotation={[0, -Math.PI / 2, 0]} />
        <TypePoster kind="miami" position={[2.93, 1.0, 1.73]} rotation={[0, -Math.PI / 2, 0.04]} />
        <group position={[2.55, 0.12, 1.55]}><Basketball /></group>
      </Hotspot>

      <Hotspot id="contact" onPick={onPick} showDot={dot('contact')}><Neon /></Hotspot>
    </>
  )
}

// Each mood relights the room.
const LIGHTS: Record<Mood, { ambient: string; sky: string; ground: string; moon: string; ceiling: string; ceilingPower: number; lamp: string }> = {
  studio: { ambient: '#c9b8ff', sky: '#6e78c8', ground: '#3a2418', moon: '#a9b8ff', ceiling: '#ffcf9a', ceilingPower: 3.2, lamp: '#ffb067' },
  posters: { ambient: '#ffffff', sky: '#e8e8e8', ground: '#777777', moon: '#ffffff', ceiling: '#fff4e6', ceilingPower: 5, lamp: '#ffe2c4' },
  hiphop: { ambient: '#8a4dff', sky: '#5a2cc8', ground: '#2a0f3a', moon: '#7a5cff', ceiling: '#b06cff', ceilingPower: 4.2, lamp: '#ffc23c' },
  sketch: { ambient: '#fff1d8', sky: '#bcd0ff', ground: '#6a4a30', moon: '#d7e2ff', ceiling: '#ffe6bf', ceilingPower: 3.4, lamp: '#ffc98a' }
}

// Nothing in the room moves, so its shadows are drawn once instead of every frame
// (again when a mood relights it), and every material is compiled as soon as the
// furniture is in, rather than the moment the room first scrolls into view.
function Settle({ mood }: { mood: Mood }): null {
  const { gl, scene, camera, advance } = useThree()
  React.useEffect(() => {
    gl.shadowMap.autoUpdate = false
    gl.shadowMap.needsUpdate = true
    // Two real frames now, while the room is still below the screen: the first lights it
    // (the environment is drawn on a frame), the second compiles every shader against
    // that light, uploads every texture and draws the shadows. Otherwise all of it lands
    // the moment the room scrolls in.
    const now = performance.now()
    advance(now)
    advance(now + 16)
  }, [gl, scene, camera, mood, advance])
  return null
}

function Scene({ spot, focus, phone, mood, onWalk, onPick, drag }: { spot: number; focus: Spot | null; phone: boolean; mood: Mood; onWalk: (i: number) => void; onPick: (id: Spot) => void; drag: React.MutableRefObject<{ yaw: number; pitch: number }> }): React.ReactElement {
  const light = LIGHTS[mood]
  return (
    <>
      <color attach="background" args={['#0d1235']} />
      {/* Soft shadows are heavy on phone GPUs and too subtle to see on a small screen. */}
      {!phone ? <SoftShadows size={16} samples={12} focus={0.6} /> : null}
      <ambientLight intensity={mood === 'sketch' ? 0.45 : mood === 'posters' ? 0.5 : 0.18} color={light.ambient} />
      <hemisphereLight args={[light.sky, light.ground, mood === 'sketch' ? 0.6 : 0.35]} />
      {/* Moonlight through the window. */}
      <directionalLight position={[3.5, 4.2, -8]} intensity={1.1} color={light.moon} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0003} shadow-normalBias={0.02} shadow-camera-left={-3.4} shadow-camera-right={3.4} shadow-camera-top={3.2} shadow-camera-bottom={-3.2} shadow-camera-near={4} shadow-camera-far={14} />
      {/* The ceiling lamp and the desk lamp: the warm lights of the room. */}
      <pointLight position={[0, 1.75, 0]} color={light.ceiling} intensity={light.ceilingPower} distance={6} decay={1.4} />
      <spotLight position={[-1.95, 1.35, -2.2]} angle={0.8} penumbra={0.8} intensity={6} distance={3} decay={1.6} color={light.lamp} castShadow={!phone} target-position={[-1.45, 0.74, -2.0]} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={1} color="#8f99ff" position={[1.3, 2, -4]} scale={[3, 2, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#ffcf9a" position={[0, 3, 0]} scale={[3, 3, 1]} rotation-x={Math.PI / 2} />
      </Environment>
      <Rig spot={spot} focus={focus} phone={phone} drag={drag} />
      <React.Suspense fallback={null}>
        <Furniture focus={focus} spot={spot} onPick={onPick} />
        <Settle mood={mood} />
      </React.Suspense>
      {!focus ? SPOTS.map((_, i) => (i !== spot ? <FloorSpot key={i} index={i} onWalk={onWalk} /> : null)) : null}
      <MoodEffects mood={mood} phone={phone} />
    </>
  )
}

;['desk_lamp_arm_01', 'modern_arm_chair_01', 'modern_ceiling_lamp_01', 'potted_plant_02', 'chess_set', 'mid_century_lounge_chair', 'modern_wooden_cabinet', 'television_02', 'gaming_console', 'steel_frame_shelves_02'].forEach((name) => useGLTF.preload(`/studio/${name}.glb`))

export default function Room({ mood = 'studio' }: { mood?: Mood }): React.ReactElement {
  const rootRef = React.useRef<HTMLElement>(null)
  // Draws only while some of it is on screen; just below the fold it would cost a phone
  // every frame for nothing.
  const inView = useInView(rootRef)
  const [spot, setSpot] = React.useState(0)
  const [focus, setFocus] = React.useState<Spot | null>(null)
  const [channel, setChannel] = React.useState(0)
  const [playing, setPlaying] = React.useState(false)
  const drag = React.useRef({ yaw: 0, pitch: 0 })
  const phone = React.useMemo(() => window.matchMedia('(max-width: 899px)').matches, [])
  const stop = focus ? STOPS[focus] : null

  const walk = React.useCallback((index: number) => {
    drag.current = { yaw: 0, pitch: 0 }
    setFocus(null)
    setSpot(index)
  }, [])
  const pick = React.useCallback((id: Spot) => {
    drag.current = { yaw: 0, pitch: 0 }
    setSpot(SPOTS.findIndex((s) => s.id === STOPS[id].spot))
    setFocus(id)
  }, [])

  React.useEffect(() => {
    if (!focus) return
    const onKey = (event: KeyboardEvent): void => { if (event.key === 'Escape') setFocus(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focus])

  // Drag to look around. Phones only turn left and right, so up-and-down still scrolls the page.
  // The drag ends however the finger does: lifted, or handed to the page when it starts to
  // scroll (a cancel, not an up). Only the finger that started it can steer.
  const onPointerDown = (event: React.PointerEvent): void => {
    if (!event.isPrimary) return
    const id = event.pointerId
    const start = { x: event.clientX, y: event.clientY, yaw: drag.current.yaw, pitch: drag.current.pitch }
    const move = (e: PointerEvent): void => {
      if (e.pointerId !== id) return
      drag.current.yaw = start.yaw + (e.clientX - start.x) * 0.0045
      if (!phone) drag.current.pitch = THREE.MathUtils.clamp(start.pitch + (e.clientY - start.y) * 0.0035, -0.8, 0.8)
    }
    const up = (e: PointerEvent): void => {
      if (e.pointerId !== id) return
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
  }

  return (
    <section className={`ns nr ${focus ? 'is-focused' : ''} ${spot !== 0 ? 'is-walking' : ''}`} ref={rootRef} id="studio">
      <div className="nr-canvas" onPointerDown={onPointerDown}>
        <Canvas
          shadows
          dpr={[1, phone ? 1.3 : 1.75]}
          frameloop={inView ? 'always' : 'never'}
          camera={{ position: SPOTS[0].pos, fov: phone ? 72 : 50, near: 0.03, far: 160 }}
          gl={{ antialias: false }}
          onPointerMissed={() => setFocus(null)}
        >
          <Scene spot={spot} focus={focus} phone={phone} mood={mood} onWalk={walk} onPick={pick} drag={drag} />
          {inView ? <Quality id="room" max={phone ? 1.3 : 1.75} /> : null}
        </Canvas>
      </div>

      <div className="ns-head">
        <p className="nx-kicker">The studio · Istanbul, after dark</p>
        <h2>Come in,<br /><em>look around.</em></h2>
        <p className="ns-hint">{phone ? 'Tap the rings to walk, swipe sideways to look.' : 'Click the rings to walk, drag to look around.'}</p>
      </div>

      <nav className="nr-nav" aria-label="Walk to">
        {SPOTS.map((item, i) => (
          <button key={item.id} type="button" className={i === spot ? 'is-on' : ''} onClick={() => walk(i)}>{item.label}</button>
        ))}
      </nav>

      {stop ? (
        <aside className={`ns-card ${stop.embed ? 'has-embed' : ''}`} key={focus}>
          <p className="nx-kicker">{stop.kicker}</p>
          <h3>{stop.title}</h3>
          <p>{stop.text}</p>
          {stop.embed === 'music' ? (
            <iframe className="nr-embed is-music" title="Hustleholic on Apple Music" src={PLAYLIST} allow="autoplay *; encrypted-media *; clipboard-write" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" loading="lazy" />
          ) : null}
          {stop.embed === 'show' ? (
            <>
              <iframe className="nr-embed is-show" title={EPISODES[channel][1]} src={`https://www.youtube-nocookie.com/embed/${EPISODES[channel][0]}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`} allow="autoplay; encrypted-media; picture-in-picture" loading="lazy" />
              <div className="nr-channels">
                {EPISODES.map(([id, title], i) => (
                  <button key={id} type="button" className={i === channel ? 'is-on' : ''} onClick={() => setChannel(i)} title={title}>CH {String(i + 1).padStart(2, '0')}</button>
                ))}
              </div>
            </>
          ) : null}
          <div className="ns-actions">
            {stop.play ? <button type="button" className="ns-go" onClick={() => setPlaying(true)}>Play it ♞</button> : null}
            {stop.go ? <button type="button" className="ns-go" onClick={() => scrollToId(stop.go!)}>Take me there ↓</button> : null}
            {stop.link ? <a href={stop.link[1]} target={stop.link[1].startsWith('mailto') ? undefined : '_blank'} rel="noreferrer">{stop.link[0]} ↗</a> : null}
          </div>
          <button type="button" className="ns-back" onClick={() => setFocus(null)}>← Back to the room</button>
        </aside>
      ) : null}
      {playing ? <KnightVisionBoard onClose={() => setPlaying(false)} /> : null}
    </section>
  )
}
