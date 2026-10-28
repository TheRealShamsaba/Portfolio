import React from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Html, Lightformer } from '@react-three/drei'
import { CuboidCollider, BallCollider, Physics, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { Basketball, ClayFinishContext, F1Car, IPod, Knight, Mug, Phone, PodcastMic, SneakerBox, SportsCar, type ClayFinish } from './Props'
import type { Mood } from './mood'
import { Quality } from './quality'

// The hero: the things on my shelves and desk, sculpted in clay and piled in front of
// my name. They pull back together; a mouse or a finger on the pile shoves them;
// hovering or tapping one says what it is. A click re-inks the whole set. You'll meet
// each of them again in the studio. Once the pile is still, it stops drawing frames.

type Kind = 'ball' | 'knight' | 'ipod' | 'f1' | 'car' | 'box' | 'mic' | 'phone' | 'mug'

type Spec = { label: string; scale: number; half: [number, number, number]; offset: [number, number, number]; ball?: number; render: (clay: string) => React.ReactElement }

// Each object at hero scale (about one and a half units across), with a collider that
// hugs it and an offset that centres it on its body.
const SPECS: Record<Kind, Spec> = {
  ball: { label: 'Hoops: Rose, Ant, the Heat', scale: 7, half: [0, 0, 0], ball: 0.84, offset: [0, 0, 0], render: (c) => <Basketball clay={c} /> },
  knight: { label: 'KnightVision', scale: 13, half: [0.6, 1.05, 0.5], offset: [0, -0.07, 0], render: (c) => <Knight clay={c} /> },
  ipod: { label: 'Hustleholic, on repeat', scale: 14, half: [0.45, 0.74, 0.1], offset: [0, 0, 0], render: (c) => <IPod clay={c} /> },
  f1: { label: 'F1 & Ferrari', scale: 6.5, half: [0.55, 0.3, 1.3], offset: [0, -0.045, 0], render: (c) => <F1Car clay={c} /> },
  car: { label: 'Cars in general', scale: 9, half: [0.42, 0.33, 0.92], offset: [0, -0.035, 0], render: (c) => <SportsCar clay={c} /> },
  box: { label: 'Jordan 1s', scale: 5, half: [0.86, 0.32, 0.57], offset: [0, -0.06, 0], render: (c) => <SneakerBox clay={c} kind="ones" /> },
  mic: { label: 'The Reasonable Show', scale: 9, half: [0.32, 0.9, 0.32], offset: [0, -0.1, 0], render: (c) => <PodcastMic clay={c} /> },
  phone: { label: 'Drip', scale: 10, half: [0.37, 0.76, 0.06], offset: [0, 0, 0], render: (c) => <Phone clay={c} /> },
  mug: { label: 'Coffee, the real MVP', scale: 10, half: [0.5, 0.46, 0.42], offset: [-0.004, -0.045, 0], render: (c) => <Mug clay={c} /> }
}
const ORDER: Kind[] = ['ball', 'knight', 'ipod', 'f1', 'car', 'box', 'mic', 'phone', 'mug']

const pull = new THREE.Vector3()

// Where the hand is, in screen terms (-1 to 1), and whether it's on the pile at all.
// Fresh means it just arrived, so the shover jumps there instead of sweeping across.
type Hand = { x: number; y: number; live: boolean; fresh: boolean }

// This frame's fastest piece, and how spread out the pile is (the sum of each piece's
// distance from the middle), so the scene knows when it can rest.
type Motion = { fastest: number; spread: number }

function Piece({ kind, clay, index, onHover, motion }: { kind: Kind; clay: string; index: number; onHover: (label: string | null) => void; motion: Motion }): React.ReactElement {
  const api = React.useRef<RapierRigidBody>(null)
  const spec = SPECS[kind]
  const start = React.useMemo<[number, number, number]>(() => {
    const r = THREE.MathUtils.randFloatSpread
    return [r(12), r(9) + 2, r(6)]
  }, [])
  useFrame((_, delta) => {
    const body = api.current
    if (!body) return
    // Everything drifts back toward the middle, gently, so the pile re-forms.
    const position = body.translation()
    pull.set(position.x, position.y, position.z).multiplyScalar(-0.2 * Math.min(delta * 60, 2))
    body.applyImpulse(pull, true)
    const v = body.linvel()
    motion.fastest = Math.max(motion.fastest, Math.hypot(v.x, v.y, v.z))
    motion.spread += Math.hypot(position.x, position.y, position.z)
  })
  return (
    <RigidBody ref={api} position={start} linearDamping={4} angularDamping={1.4} friction={0.2} colliders={false} rotation={[index * 0.9, index * 1.7, index * 0.4]}>
      {spec.ball ? <BallCollider args={[spec.ball]} /> : <CuboidCollider args={spec.half} />}
      <group
        scale={spec.scale}
        position={spec.offset.map((v) => v * spec.scale) as [number, number, number]}
        onPointerOver={(event) => { event.stopPropagation(); onHover(spec.label) }}
        onPointerOut={() => onHover(null)}
      >
        {spec.render(clay)}
      </group>
    </RigidBody>
  )
}

// An invisible ball that follows the hand through the scene, and waits well behind the
// pile when there's no hand on it (a finger that has lifted shouldn't keep shoving).
const AWAY = { x: 0, y: 0, z: -40 }
function Pointer({ hand }: { hand: React.MutableRefObject<Hand> }): React.ReactElement {
  const api = React.useRef<RapierRigidBody>(null)
  const target = React.useMemo(() => new THREE.Vector3(), [])
  const { viewport } = useThree()
  useFrame(() => {
    const body = api.current
    if (!body) return
    const h = hand.current
    if (!h.live) { body.setTranslation(AWAY, false); return }
    target.set((h.x * viewport.width) / 2, (h.y * viewport.height) / 2, 0)
    if (h.fresh) { h.fresh = false; body.setTranslation(target, true) } else body.setNextKinematicTranslation(target)
  })
  return (
    <RigidBody ref={api} type="kinematicPosition" colliders={false} position={[100, 100, 100]}>
      <BallCollider args={[1.2]} />
    </RigidBody>
  )
}

// The name of whatever you're touching, following the pointer.
function Caption({ label, hand }: { label: string | null; hand: React.MutableRefObject<Hand> }): React.ReactElement | null {
  const ref = React.useRef<THREE.Group>(null)
  const { viewport } = useThree()
  useFrame(() => ref.current?.position.set((hand.current.x * viewport.width) / 2 + 0.4, (hand.current.y * viewport.height) / 2 + 0.5, 3))
  return (
    <group ref={ref}>
      <Html zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
        <span className={`nx-caption ${label ? 'is-on' : ''}`}>{label ?? ''}</span>
      </Html>
    </group>
  )
}

// Each mood's set: what the objects are made of, and the three colours they come in.
const SETS: Record<Mood, { finish: ClayFinish; accent?: string; ink: string; bone: string }> = {
  studio: { finish: 'matte', ink: '#18181b', bone: '#efece4' },
  posters: { finish: 'print', accent: '#d6332a', ink: '#111111', bone: '#efe9dc' },
  hiphop: { finish: 'metal', accent: '#e2b23c', ink: '#1a1a1f', bone: '#d9dde3' },
  sketch: { finish: 'ink', accent: '#ff6fa8', ink: '#3a6df0', bone: '#fdf8ec' }
}

// Mounts only once the physics engine is up and every piece exists, so the loader
// can wait for it and lift onto a finished picture.
function Ready({ onReady }: { onReady?: () => void }): null {
  React.useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()))
    return () => cancelAnimationFrame(id)
  }, [onReady])
  return null
}

// Watches the pile. Pressed against each other the pieces never quite stop (they jiggle
// at up to about 0.8 a second), so it rests once nothing is moving fast and the pile has
// held the same shape for a second, with no hand on it. Then the scene stops drawing
// until something wakes it.
function Rest({ motion, hand, onRest }: { motion: Motion; hand: React.MutableRefObject<Hand>; onRest: () => void }): null {
  const history = React.useRef<number[]>([])
  const calm = React.useRef(0)
  useFrame(() => {
    const past = history.current
    past.push(motion.spread)
    if (past.length > 60) past.shift()
    const held = past.length === 60 && Math.abs(motion.spread - past[0]) < motion.spread * 0.01
    calm.current = held && motion.fastest < 1.5 && !hand.current.live ? calm.current + 1 : 0
    motion.fastest = 0
    motion.spread = 0
    if (calm.current > 30) { calm.current = 0; past.length = 0; onRest() }
  })
  return null
}

type SceneProps = { accent: string; double: boolean; mood: Mood; onReady?: () => void; hand: React.MutableRefObject<Hand>; hover: string | null; onHover: (label: string | null) => void; awake: boolean; onRest: () => void; phone: boolean }

function Scene({ accent, double, mood, onReady, hand, hover, onHover, awake, onRest, phone }: SceneProps): React.ReactElement {
  const motion = React.useMemo<Motion>(() => ({ fastest: 0, spread: 0 }), [])
  const set = SETS[mood]
  const tint = set.accent ?? accent
  // Most pieces take the accent; a few stay ink or bone, like a mixed batch of clay.
  const tones = React.useMemo(() => ['accent', 'accent', 'ink', 'accent', 'bone', 'accent', 'accent', 'ink', 'bone'], [])
  const clay = (i: number): string => (tones[i % tones.length] === 'accent' ? tint : tones[i % tones.length] === 'ink' ? set.ink : set.bone)
  const pieces = double ? [...ORDER, ...ORDER] : ORDER
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 9, 8]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-8, -2, 4]} intensity={0.6} color="#c9ceff" />
      <ClayFinishContext.Provider value={set.finish}>
        {/* Paused while resting: the engine keeps asking for frames while anything is awake. */}
        <Physics gravity={[0, 0, 0]} paused={!awake}>
          <Pointer hand={hand} />
          {pieces.map((kind, i) => <Piece key={i} index={i} kind={kind} clay={clay(i)} onHover={onHover} motion={motion} />)}
          <Ready onReady={onReady} />
          <Rest motion={motion} hand={hand} onRest={onRest} />
        </Physics>
      </ClayFinishContext.Provider>
      {awake ? <Quality id="hero" max={phone ? 1.5 : 1.75} /> : null}
      <Caption label={hover} hand={hand} />
      {/* Soft studio light so the clay reads as clay: matte, with gentle highlights. */}
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={1.6} position={[0, 6, 4]} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 6, 1]} />
      </Environment>
    </>
  )
}

export default function Cluster({ accent, active, mood, onPick, onReady }: { accent: string; active: boolean; mood: Mood; onPick: () => void; onReady?: () => void }): React.ReactElement {
  const phone = React.useMemo(() => window.matchMedia('(max-width: 899px)').matches, [])
  const hand = React.useRef<Hand>({ x: 0, y: 0, live: false, fresh: false })
  const [hover, setHover] = React.useState<string | null>(null)
  const [awake, setAwake] = React.useState(true)
  const forget = React.useRef(0)
  const wake = (): void => setAwake(true)
  // A new look or a new set of colours sets the pile moving again.
  React.useEffect(wake, [mood, accent, active])
  React.useEffect(() => () => window.clearTimeout(forget.current), [])

  const place = (event: React.PointerEvent<HTMLDivElement>): void => {
    const box = event.currentTarget.getBoundingClientRect()
    hand.current.x = ((event.clientX - box.left) / box.width) * 2 - 1
    hand.current.y = -(((event.clientY - box.top) / box.height) * 2 - 1)
  }
  const arrive = (event: React.PointerEvent<HTMLDivElement>): void => {
    place(event)
    if (!hand.current.live) hand.current.fresh = true
    hand.current.live = true
    window.clearTimeout(forget.current)
    wake()
  }
  // A finger has no hover: once it lifts (or the page takes over to scroll), the shove
  // stops, and the name it touched stays up a moment before fading.
  const leave = (event: React.PointerEvent<HTMLDivElement>): void => {
    hand.current.live = false
    window.clearTimeout(forget.current)
    if (event.pointerType === 'mouse') setHover(null)
    else forget.current = window.setTimeout(() => setHover(null), 1400)
  }

  return (
    <Canvas
      className="nx-cluster"
      shadows
      frameloop={!active ? 'never' : awake ? 'always' : 'demand'}
      dpr={[1, phone ? 1.5 : 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, phone ? 24 : 20], fov: 32, near: 1, far: 60 }}
      onClick={onPick}
      onPointerDown={arrive}
      onPointerMove={(event) => { if (event.pointerType === 'mouse' || hand.current.live) arrive(event) }}
      onPointerUp={(event) => { if (event.pointerType !== 'mouse') leave(event) }}
      onPointerCancel={leave}
      onPointerLeave={leave}
    >
      <Scene accent={accent} double={!phone} mood={mood} onReady={onReady} hand={hand} hover={hover} onHover={setHover} awake={awake} onRest={() => setAwake(false)} phone={phone} />
    </Canvas>
  )
}
