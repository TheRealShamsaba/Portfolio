import React from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshReflectorMaterial, RoundedBox, useTexture } from '@react-three/drei'
import { Effect, BlendFunction } from 'postprocessing'
import { Bloom, ChromaticAberration, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'

// The cypher, shot like a late-90s rap video: six projects stand in a circle in a dark
// warehouse, each a speaker stack with its screen on top. A hard light finds whoever
// has the mic, the woofers pump on the kick, the floor is wet, there's haze, and the
// camera is low, handheld and seen through a fisheye.

export type Rig = { intro: number; active: number; kick: number; snare: number }

export type Member = { image?: string; board?: boolean; crop: [number, number, number, number]; light: string }

const R = 3.4
const SCREEN: [number, number] = [1.2, 1.6]
const CAB = 1.0 // speaker cabinet height
const SCREEN_Y = CAB + 0.06 + SCREEN[1] / 2
const angle = (i: number): number => (i * Math.PI) / 3

// The fisheye: barrel distortion, the lens of every rap video from that era.
const FISHEYE = /* glsl */ `
uniform float strength;
void mainUv(inout vec2 uv) {
  vec2 p = uv * 2.0 - 1.0;
  float r2 = dot(p, p);
  p *= (1.0 - strength) + strength * r2;
  uv = p * 0.5 + 0.5;
}
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) { outputColor = inputColor; }
`
class FisheyeImpl extends Effect {
  constructor() {
    super('Fisheye', FISHEYE, { blendFunction: BlendFunction.NORMAL, uniforms: new Map([['strength', new THREE.Uniform(0.05)]]) })
  }
}
// Gentle on the wide orbit, full strength once you're inside the circle.
function Fisheye({ rig, max }: { rig: React.MutableRefObject<Rig>; max: number }): React.ReactElement {
  const effect = React.useMemo(() => new FisheyeImpl(), [])
  useFrame(() => {
    const k = THREE.MathUtils.smoothstep(rig.current.intro, 0, 1)
    effect.uniforms.get('strength')!.value = 0.04 + (max - 0.04) * k
  })
  return <primitive object={effect} dispose={null} />
}

// KnightVision's face: a board drawn here, a knight mid-game. Redrawn once the type
// has loaded, so the lettering isn't a fallback font.
function useBoard(): THREE.CanvasTexture {
  const texture = React.useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 768
    c.height = 1024
    const ctx = c.getContext('2d')!
    ctx.fillStyle = '#0d0c10'
    ctx.fillRect(0, 0, 768, 1024)
    const s = 84
    const x0 = (768 - s * 8) / 2
    const y0 = 220
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      ctx.fillStyle = (x + y) % 2 ? '#2a2830' : '#e9e6df'
      ctx.fillRect(x0 + x * s, y0 + y * s, s, s)
    }
    ctx.fillStyle = '#f2c14e'
    ctx.font = '400 74px "Apple Symbols", "Segoe UI Symbol", serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('♞︎', x0 + s * 5.5, y0 + s * 2.5)
    ctx.fillText('♚︎', x0 + s * 1.5, y0 + s * 6.5)
    ctx.fillStyle = '#f3f1ee'
    ctx.font = 'italic 900 100px Jost, Futura, "Arial Black", sans-serif'
    ctx.fillText('KNIGHT', 384, 110)
    ctx.fillText('VISION', 384, 950)
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])
  React.useEffect(() => {
    void document.fonts.load('italic 900 100px Jost').then(() => {
      const c = texture.image as HTMLCanvasElement
      const ctx = c.getContext('2d')!
      ctx.fillStyle = '#0d0c10'
      ctx.fillRect(0, 0, 768, 200)
      ctx.fillRect(0, 900, 768, 124)
      ctx.fillStyle = '#f3f1ee'
      ctx.font = 'italic 900 100px Jost, Futura, "Arial Black", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('KNIGHT', 384, 110)
      ctx.fillText('VISION', 384, 950)
      texture.needsUpdate = true
    })
  }, [texture])
  return texture
}

// One member of the cypher: a speaker cabinet, woofer and horn, its screen on top.
function Member({ i, member, rig }: { i: number; member: Member; rig: React.MutableRefObject<Rig> }): React.ReactElement {
  const board = useBoard()
  const photo = useTexture(member.image ?? '/projects/drip-app/screens/verdict.webp')
  const map = React.useMemo(() => {
    if (member.board) return board
    const t = photo.clone()
    t.colorSpace = THREE.SRGBColorSpace
    const [rx, ry, ox, oy] = member.crop
    t.repeat.set(rx, ry)
    t.offset.set(ox, oy)
    t.needsUpdate = true
    return t
  }, [photo, board, member])
  const mat = React.useRef<THREE.MeshStandardMaterial>(null)
  const cone = React.useRef<THREE.Group>(null)
  const a = angle(i)
  useFrame(() => {
    const r = rig.current
    const on = Math.round(r.active) === i && r.intro >= 1
    if (mat.current) {
      const target = on ? 0.55 + r.kick * 0.3 : r.intro < 1 ? 0.32 : 0.1
      mat.current.emissiveIntensity += (target - mat.current.emissiveIntensity) * 0.12
    }
    // Every woofer moves with the kick; the one with the mic hits hardest.
    if (cone.current) cone.current.position.z = 0.318 + r.kick * (on ? 0.035 : 0.015)
  })
  const metal = <meshStandardMaterial color="#9aa0a8" metalness={0.9} roughness={0.35} />
  return (
    <group position={[Math.sin(a) * R, 0, -Math.cos(a) * R]} rotation={[0, -a, 0]}>
      <RoundedBox args={[1.08, CAB, 0.62]} radius={0.025} smoothness={3} position={[0, CAB / 2, 0]}>
        <meshStandardMaterial color="#121214" roughness={0.92} />
      </RoundedBox>
      {/* The woofer: rubber surround, cone, dust cap. */}
      <mesh position={[0, 0.42, 0.312]}><torusGeometry args={[0.3, 0.028, 12, 48]} /><meshStandardMaterial color="#09090a" roughness={0.6} /></mesh>
      <group ref={cone} position={[0, 0.42, 0.318]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.03]}><coneGeometry args={[0.28, 0.07, 40, 1, true]} /><meshStandardMaterial color="#1c1c1f" roughness={0.75} side={THREE.DoubleSide} /></mesh>
        <mesh scale={[1, 1, 0.45]}><sphereGeometry args={[0.085, 20, 12]} /><meshStandardMaterial color="#26262a" roughness={0.4} metalness={0.3} /></mesh>
      </group>
      {/* The horn. */}
      <mesh position={[0, 0.82, 0.3]}><boxGeometry args={[0.46, 0.15, 0.04]} /><meshStandardMaterial color="#0b0b0c" roughness={0.5} /></mesh>
      <mesh position={[0, 0.82, 0.322]}><boxGeometry args={[0.36, 0.08, 0.01]} /><meshStandardMaterial color="#030303" roughness={0.9} /></mesh>
      {/* Metal corners. */}
      {[[-0.52, CAB - 0.02], [0.52, CAB - 0.02], [-0.52, 0.02], [0.52, 0.02]].map(([x, y]) => (
        <mesh key={`${x}${y}`} position={[x, y, 0.29]}><boxGeometry args={[0.06, 0.06, 0.06]} />{metal}</mesh>
      ))}
      {/* The screen on top. */}
      <mesh position={[0, SCREEN_Y, -0.04]}><boxGeometry args={[SCREEN[0] + 0.07, SCREEN[1] + 0.07, 0.07]} /><meshStandardMaterial color="#0c0c0e" metalness={0.6} roughness={0.3} /></mesh>
      <mesh position={[0, SCREEN_Y, -0.002]}>
        <planeGeometry args={SCREEN} />
        <meshStandardMaterial ref={mat} map={map} emissiveMap={map} emissive="#ffffff" emissiveIntensity={0.3} roughness={0.25} metalness={0} toneMapped={false} />
      </mesh>
    </group>
  )
}

// A hard light from the rafters, swinging to whoever has the mic, with a beam of light
// through the haze. For the opening it's wide and gold over the whole circle.
function Light({ members, rig }: { members: Member[]; rig: React.MutableRefObject<Rig> }): React.ReactElement {
  const spot = React.useRef<THREE.SpotLight>(null)
  const beam = React.useRef<THREE.Mesh>(null)
  const beamMat = React.useRef<THREE.ShaderMaterial>(null)
  const target = React.useMemo(() => new THREE.Object3D(), [])
  const aim = React.useRef(new THREE.Vector3(0, 1.4, -R))
  const colour = React.useRef(new THREE.Color(members[0].light))
  const top = React.useMemo(() => new THREE.Vector3(0, 6.2, 0), [])
  useFrame((_, dt) => {
    const r = rig.current
    const i = Math.max(0, Math.round(r.active))
    const a = angle(i)
    const goal = r.intro < 1 ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(Math.sin(a) * R, SCREEN_Y - 0.2, -Math.cos(a) * R)
    aim.current.lerp(goal, Math.min(1, dt * 4))
    target.position.copy(aim.current)
    colour.current.lerp(new THREE.Color(r.intro < 1 ? '#f2c14e' : members[i].light), Math.min(1, dt * 3))
    if (spot.current) {
      spot.current.color.copy(colour.current)
      const inside = THREE.MathUtils.smoothstep(r.intro, 0.4, 1)
      spot.current.intensity = THREE.MathUtils.lerp(70, 170, inside) + r.kick * 150 * inside
      spot.current.angle = THREE.MathUtils.lerp(0.62, 0.32, THREE.MathUtils.smoothstep(r.intro, 0, 1))
    }
    if (beam.current) {
      const mid = top.clone().add(aim.current).multiplyScalar(0.5)
      beam.current.position.copy(mid)
      beam.current.scale.set(1, top.distanceTo(aim.current), 1)
      beam.current.lookAt(aim.current)
      beam.current.rotateX(-Math.PI / 2)
    }
    if (beamMat.current) {
      beamMat.current.uniforms.uColor.value.copy(colour.current)
      beamMat.current.uniforms.uKick.value = r.kick
    }
  })
  return (
    <>
      <primitive object={target} />
      <spotLight ref={spot} position={top.toArray()} target={target} angle={0.32} penumbra={0.55} distance={14} decay={2} />
      <mesh ref={beam}>
        <cylinderGeometry args={[0.04, 1.15, 1, 48, 1, true]} />
        <shaderMaterial
          ref={beamMat}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          uniforms={{ uColor: { value: new THREE.Color('#f2c14e') }, uKick: { value: 0 } }}
          vertexShader={`varying vec2 vUv; varying vec3 vN; varying vec3 vView; void main(){ vUv = uv; vec4 mv = modelViewMatrix * vec4(position,1.0); vView = normalize(-mv.xyz); vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * mv; }`}
          fragmentShader={`uniform vec3 uColor; uniform float uKick; varying vec2 vUv; varying vec3 vN; varying vec3 vView; void main(){ float edge = pow(abs(dot(vN, vView)), 1.6); float fall = smoothstep(0.0, 0.35, vUv.y) * (0.35 + 0.65 * vUv.y); gl_FragColor = vec4(uColor * (0.08 + uKick * 0.05) * edge * fall, 1.0); }`}
        />
      </mesh>
    </>
  )
}

// During the opening orbit, a light behind the circle, always opposite the camera, so
// every stack is rim-lit through the haze.
function BackLight({ rig }: { rig: React.MutableRefObject<Rig> }): React.ReactElement {
  const light = React.useRef<THREE.PointLight>(null)
  const { camera } = useThree()
  useFrame(() => {
    if (!light.current) return
    const flat = new THREE.Vector3(camera.position.x, 0, camera.position.z)
    if (flat.lengthSq() < 0.01) flat.set(0, 0, 1)
    flat.normalize().multiplyScalar(-6.5)
    light.current.position.set(flat.x, 2.6, flat.z)
    light.current.intensity = (1 - THREE.MathUtils.smoothstep(rig.current.intro, 0, 0.8)) * 60
  })
  return <pointLight ref={light} color="#ffcf7a" distance={16} decay={1.6} />
}

// The warehouse around the circle: fluorescent tubes far out in the dark.
function Tubes(): React.ReactElement {
  const tubes = React.useMemo(() => Array.from({ length: 18 }, (_, i) => {
    const a = (i / 18) * Math.PI * 2 + (i % 3) * 0.11
    const r = 10.5 + (i % 4) * 0.9
    const flat = i % 5 === 0
    return { x: Math.sin(a) * r, z: -Math.cos(a) * r, y: flat ? 3.6 : 1.4 + (i % 3) * 0.5, rot: flat ? Math.PI / 2 : 0, len: flat ? 2.4 : 1.4 + (i % 2) * 0.6, warm: i % 4 === 1 }
  }), [])
  return (
    <>
      {tubes.map((t, i) => (
        <mesh key={i} position={[t.x, t.y, t.z]} rotation={[0, 0, t.rot]}>
          <boxGeometry args={[0.05, t.len, 0.05]} />
          <meshBasicMaterial color={t.warm ? new THREE.Color(2.2, 1.5, 0.9) : new THREE.Color(1.6, 1.7, 2.1)} toneMapped={false} />
        </mesh>
      ))}
    </>
  )
}

// Haze lying low over the floor, drifting.
function GroundHaze(): React.ReactElement {
  const mat = React.useRef<THREE.ShaderMaterial>(null)
  useFrame(({ clock }) => { if (mat.current) mat.current.uniforms.uTime.value = clock.elapsedTime })
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.18, 0]}>
      <planeGeometry args={[30, 30]} />
      <shaderMaterial
        ref={mat}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
        fragmentShader={`uniform float uTime; varying vec2 vUv;
          float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
          void main(){ vec2 p = vUv * 9.0; float v = n(p + vec2(uTime*0.05, uTime*0.02)) * 0.6 + n(p*2.1 - uTime*0.04) * 0.4;
            float fade = smoothstep(0.5, 0.15, distance(vUv, vec2(0.5)));
            gl_FragColor = vec4(vec3(0.55, 0.53, 0.66) * v * fade * 0.16, 1.0); }`}
      />
    </mesh>
  )
}

// Soft haze drifting through the light, out at the edge of the circle.
function Smoke({ count }: { count: number }): React.ReactElement {
  const texture = React.useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const ctx = c.getContext('2d')!
    for (let k = 0; k < 14; k++) {
      const x = 128 + (Math.random() - 0.5) * 120
      const y = 128 + (Math.random() - 0.5) * 120
      const g = ctx.createRadialGradient(x, y, 0, x, y, 40 + Math.random() * 70)
      g.addColorStop(0, 'rgba(255,255,255,0.12)')
      g.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 256, 256)
    }
    return new THREE.CanvasTexture(c)
  }, [])
  const puffs = React.useMemo(() => Array.from({ length: count }, (_, i) => ({ a: (i / count) * Math.PI * 2, r: 3 + Math.random() * 2.5, y: 0.4 + Math.random() * 2.6, s: 2.5 + Math.random() * 2.5, v: 0.02 + Math.random() * 0.04 })), [count])
  const group = React.useRef<THREE.Group>(null)
  const { camera } = useThree()
  useFrame(({ clock }) => {
    group.current?.children.forEach((m, i) => {
      const p = puffs[i]
      const a = p.a + clock.elapsedTime * p.v
      m.position.set(Math.sin(a) * p.r, p.y + Math.sin(clock.elapsedTime * 0.2 + i) * 0.2, -Math.cos(a) * p.r)
      m.quaternion.copy(camera.quaternion)
    })
  })
  return (
    <group ref={group}>
      {puffs.map((p, i) => (
        <mesh key={i} scale={p.s}>
          <planeGeometry />
          <meshBasicMaterial map={texture} transparent opacity={0.16} depthWrite={false} color="#8d88a6" fog={false} />
        </mesh>
      ))}
    </group>
  )
}

// The mic on its stand, passed to whoever's turn it is.
function Mic({ rig }: { rig: React.MutableRefObject<Rig> }): React.ReactElement {
  const ref = React.useRef<THREE.Group>(null)
  const at = React.useRef(0)
  useFrame((_, dt) => {
    if (!ref.current) return
    const goal = angle(Math.max(0, Math.round(rig.current.active)))
    let d = goal - at.current
    while (d > Math.PI) d -= Math.PI * 2
    while (d < -Math.PI) d += Math.PI * 2
    at.current += d * Math.min(1, dt * 3.5)
    // Just off to the side of the stack, so it doesn't split the screen down the middle.
    const r = R - 0.95
    const side = at.current - 0.2
    ref.current.position.set(Math.sin(side) * r, 0, -Math.cos(side) * r)
    ref.current.rotation.y = -at.current
    ref.current.visible = rig.current.intro >= 0.6
  })
  return (
    <group ref={ref}>
      <mesh position={[0, 0.72, 0]}><cylinderGeometry args={[0.012, 0.012, 1.44, 8]} /><meshStandardMaterial color="#202024" metalness={0.9} roughness={0.25} /></mesh>
      <mesh position={[0, 0.01, 0]}><cylinderGeometry args={[0.2, 0.22, 0.02, 20]} /><meshStandardMaterial color="#18181b" metalness={0.8} roughness={0.3} /></mesh>
      <mesh position={[0, 1.5, 0.04]} rotation={[0.5, 0, 0]}><cylinderGeometry args={[0.022, 0.016, 0.16, 12]} /><meshStandardMaterial color="#111" metalness={0.6} roughness={0.4} /></mesh>
      <mesh position={[0, 1.58, 0.09]}><sphereGeometry args={[0.042, 16, 12]} /><meshStandardMaterial color="#9aa0a8" metalness={1} roughness={0.35} /></mesh>
    </group>
  )
}

// The camera: a slow, low orbit round the outside of the circle for the opening, then
// inside it, low and handheld, whip-panning to the mic and punching in on the kick.
function Rigging({ rig, phone }: { rig: React.MutableRefObject<Rig>; phone: boolean }): null {
  const { camera } = useThree()
  const yaw = React.useRef(0)
  const look = React.useMemo(() => new THREE.Vector3(), [])
  useFrame(({ clock }, dt) => {
    const r = rig.current
    const goal = angle(Math.max(0, Math.round(r.active)))
    let d = goal - yaw.current
    while (d > Math.PI) d -= Math.PI * 2
    while (d < -Math.PI) d += Math.PI * 2
    yaw.current += d * Math.min(1, dt * 4.2)
    const t = clock.elapsedTime
    const shake = { x: Math.sin(t * 1.3) * 0.02 + Math.sin(t * 3.7) * 0.008, y: Math.sin(t * 1.9 + 1) * 0.015 }
    const step = phone ? -0.3 : 0.45
    const low = new THREE.Vector3(Math.sin(yaw.current) * step + shake.x, 1.05 + shake.y, -Math.cos(yaw.current) * step)
    const lowLook = new THREE.Vector3(Math.sin(yaw.current) * R, SCREEN_Y - 0.3, -Math.cos(yaw.current) * R)
    // The opening: a slow orbit outside the circle, low, looking across it.
    const orbit = Math.PI + t * 0.06
    const far = phone ? 9.4 : 8.2
    const high = new THREE.Vector3(Math.sin(orbit) * far, 3.1 + Math.sin(t * 0.3) * 0.08, -Math.cos(orbit) * far)
    const highLook = new THREE.Vector3(0, 1.05, 0)
    const k = THREE.MathUtils.smoothstep(r.intro, 0, 1)
    camera.position.lerpVectors(high, low, k)
    look.lerpVectors(highLook, lowLook, k)
    camera.lookAt(look)
    const cam = camera as THREE.PerspectiveCamera
    const fov = THREE.MathUtils.lerp(phone ? 64 : 46, phone ? 80 : 64, k) - r.kick * 2
    if (Math.abs(cam.fov - fov) > 0.01) { cam.fov = fov; cam.updateProjectionMatrix() }
  })
  return null
}

function Floor({ phone }: { phone: boolean }): React.ReactElement {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[18, 64]} />
      {phone ? (
        <meshStandardMaterial color="#0b0b0d" roughness={0.8} metalness={0.2} />
      ) : (
        <MeshReflectorMaterial resolution={512} blur={[300, 80]} mixBlur={1} mixStrength={2.6} mirror={0.6} roughness={0.85} depthScale={0.6} minDepthThreshold={0.4} maxDepthThreshold={1.2} color="#0b0b0e" metalness={0.5} />
      )}
    </mesh>
  )
}

export default function CypherScene({ members, rig, active }: { members: Member[]; rig: React.MutableRefObject<Rig>; active: boolean }): React.ReactElement {
  const phone = React.useMemo(() => window.matchMedia('(max-width: 899px)').matches, [])
  return (
    <Canvas dpr={[1, phone ? 1.3 : 1.6]} frameloop={active ? 'always' : 'never'} camera={{ position: [0, 1.6, 7.4], fov: 44, near: 0.05, far: 60 }} gl={{ antialias: false }}>
      <color attach="background" args={['#050407']} />
      <fog attach="fog" args={['#050407', 7, 22]} />
      <ambientLight intensity={0.08} />
      <hemisphereLight args={['#4a4468', '#050407', 0.5]} />
      <pointLight position={[0, 3.2, 0]} intensity={6} distance={9} decay={1.6} color="#6a5f8f" />
      <React.Suspense fallback={null}>
        {members.map((m, i) => <Member key={i} i={i} member={m} rig={rig} />)}
      </React.Suspense>
      <Light members={members} rig={rig} />
      <BackLight rig={rig} />
      <Mic rig={rig} />
      <Tubes />
      <GroundHaze />
      <Smoke count={phone ? 5 : 10} />
      <Floor phone={phone} />
      <Rigging rig={rig} phone={phone} />
      <EffectComposer multisampling={0}>
        <Fisheye rig={rig} max={phone ? 0.1 : 0.14} />
        <Bloom mipmapBlur luminanceThreshold={0.85} intensity={phone ? 0.7 : 1} radius={0.65} />
        <ChromaticAberration offset={new THREE.Vector2(0.0012, 0.0008)} radialModulation={false} modulationOffset={0} />
        <Noise opacity={0.14} blendFunction={BlendFunction.OVERLAY} />
        <Vignette offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  )
}
