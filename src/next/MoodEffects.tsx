import React from 'react'
import * as THREE from 'three'
import { Effect, EffectAttribute, BlendFunction } from 'postprocessing'
import { Bloom, BrightnessContrast, ChromaticAberration, DotScreen, EffectComposer, HueSaturation, Noise, Scanline, Vignette } from '@react-three/postprocessing'
import type { Mood } from './mood'

// How each mood renders the 3D. Studio stays photographic; Posters prints it in
// halftone; Hip-hop pushes the glow and adds tape; Sketchbook inks it.

// Ink: outlines from colour and depth edges, flat posterised shading, comic dots in
// the shadows, all on a warm paper tone.
const INK = /* glsl */ `
uniform float levels;
uniform float dotSize;
float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
  vec2 t = texelSize * 1.4;
  float dx = readDepth(uv + vec2(t.x, 0.0)) - readDepth(uv - vec2(t.x, 0.0));
  float dy = readDepth(uv + vec2(0.0, t.y)) - readDepth(uv - vec2(0.0, t.y));
  float lx = lum(texture2D(inputBuffer, uv + vec2(t.x, 0.0)).rgb) - lum(texture2D(inputBuffer, uv - vec2(t.x, 0.0)).rgb);
  float ly = lum(texture2D(inputBuffer, uv + vec2(0.0, t.y)).rgb) - lum(texture2D(inputBuffer, uv - vec2(0.0, t.y)).rgb);
  float edge = clamp(length(vec2(dx, dy)) * 40.0 + length(vec2(lx, ly)) * 1.4, 0.0, 1.0);
  vec3 c = floor(inputColor.rgb * levels + 0.5) / levels;
  c = mix(c, c * vec3(1.06, 1.0, 0.9) + vec3(0.04, 0.03, 0.0), 0.6);
  vec2 cell = fract(uv * resolution / dotSize) - 0.5;
  float dark = 1.0 - lum(c);
  float dotMask = 1.0 - smoothstep(0.0, 0.06, length(cell) - dark * 0.5);
  c = mix(c, c * vec3(0.82, 0.76, 0.96), dotMask * 0.35 * step(0.55, dark));
  c = mix(c, vec3(0.08, 0.07, 0.16), smoothstep(0.28, 0.6, edge));
  outputColor = vec4(c, inputColor.a);
}
`

class InkEffectImpl extends Effect {
  constructor() {
    super('InkEffect', INK, {
      attributes: EffectAttribute.DEPTH,
      blendFunction: BlendFunction.NORMAL,
      uniforms: new Map<string, THREE.Uniform>([
        ['levels', new THREE.Uniform(8)],
        ['dotSize', new THREE.Uniform(7)]
      ])
    })
  }
}

const Ink = React.forwardRef<InkEffectImpl>(function Ink(_, ref) {
  const effect = React.useMemo(() => new InkEffectImpl(), [])
  return <primitive ref={ref} object={effect} dispose={null} />
})

export default function MoodEffects({ mood, phone }: { mood: Mood; phone: boolean }): React.ReactElement {
  const multisampling = phone ? 0 : 4
  if (mood === 'posters') {
    return (
      <EffectComposer multisampling={multisampling}>
        <HueSaturation saturation={-0.55} />
        <BrightnessContrast contrast={0.2} brightness={0.12} />
        <DotScreen angle={Math.PI * 0.25} scale={phone ? 1.6 : 1.25} blendFunction={BlendFunction.MULTIPLY} />
        <Noise opacity={0.12} blendFunction={BlendFunction.OVERLAY} />
        <Vignette offset={0.3} darkness={0.6} />
      </EffectComposer>
    )
  }
  if (mood === 'hiphop') {
    return (
      <EffectComposer multisampling={multisampling}>
        <Bloom mipmapBlur luminanceThreshold={0.75} intensity={phone ? 1.1 : 1.7} radius={0.75} />
        <ChromaticAberration offset={new THREE.Vector2(0.0018, 0.0012)} radialModulation={false} modulationOffset={0} />
        <Scanline density={1.3} opacity={0.08} />
        <Noise opacity={0.08} blendFunction={BlendFunction.OVERLAY} />
        <Vignette offset={0.25} darkness={0.75} />
      </EffectComposer>
    )
  }
  if (mood === 'sketch') {
    return (
      <EffectComposer multisampling={0}>
        <Ink />
        <Vignette offset={0.4} darkness={0.35} />
      </EffectComposer>
    )
  }
  return (
    <EffectComposer multisampling={multisampling}>
      <Bloom mipmapBlur luminanceThreshold={1} intensity={phone ? 0.5 : 0.8} radius={0.65} />
      <Vignette offset={0.32} darkness={0.5} />
    </EffectComposer>
  )
}
