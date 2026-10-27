import React from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Html, Lightformer } from '@react-three/drei'
import { CuboidCollider, BallCollider, Physics, RigidBody, type RapierRigidBody } from '@react-three/rapier'
import { Basketball, ClayFinishContext, F1Car, IPod, Knight, Mug, Phone, PodcastMic, SneakerBox, SportsCar, type ClayFinish } from './Props'
import type { Mood } from './mood'

// The hero: the things on my shelves and desk, sculpted in clay and piled in front of
// my name. They pull back together; the pointer shoves them; hovering one says what
// it is. A click re-inks the whole set. You'll meet each of them again in the studio.

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

function Piece({ kind, clay, index, onHover }: { kind: Kind; clay: string; index: number; onHover: (label: string | null) => void }): React.ReactElement {
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

// An invisible ball that follows the pointer through the scene.
function Pointer(): React.ReactElement {
  const api = React.useRef<RapierRigidBody>(null)
  const target = React.useMemo(() => new THREE.Vector3(), [])
  const { viewport } = useThree()
  useFrame(({ pointer }) => {
    target.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0)
    api.current?.setNextKinematicTranslation(target)
  })
  return (
    <RigidBody ref={api} type="kinematicPosition" colliders={false} position={[100, 100, 100]}>
      <BallCollider args={[1.2]} />
    </RigidBody>
  )
}

// The name of whatever you're touching, following the pointer.
function Caption({ label }: { label: string | null }): React.ReactElement | null {
  const ref = React.useRef<THREE.Group>(null)
  const { viewport } = useThree()
  useFrame(({ pointer }) => ref.current?.position.set((pointer.x * viewport.width) / 2 + 0.4, (pointer.y * viewport.height) / 2 + 0.5, 3))
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

function Scene({ accent, double, mood, onReady }: { accent: string; double: boolean; mood: Mood; onReady?: () => void }): React.ReactElement {
  const [hover, setHover] = React.useState<string | null>(null)
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
        <Physics gravity={[0, 0, 0]}>
          <Pointer />
          {pieces.map((kind, i) => <Piece key={i} index={i} kind={kind} clay={clay(i)} onHover={setHover} />)}
          <Ready onReady={onReady} />
        </Physics>
      </ClayFinishContext.Provider>
      <Caption label={hover} />
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
  return (
    <Canvas
      className="nx-cluster"
      shadows
      frameloop={active ? 'always' : 'never'}
      dpr={[1, phone ? 1.5 : 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, phone ? 24 : 20], fov: 32, near: 1, far: 60 }}
      onClick={onPick}
    >
      <Scene accent={accent} double={!phone} mood={mood} onReady={onReady} />
    </Canvas>
  )
}
