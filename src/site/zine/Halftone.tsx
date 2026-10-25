import React from 'react'
import { prefersReducedMotion } from '../motion'

// Renders an image as a live print halftone. Dots take the canvas's CSS `color`,
// the background stays transparent, and the real photo bleeds through around the pointer.

type HalftoneProps = {
  src: string
  alt: string
  className?: string
  cell?: number
  angle?: number
  contrast?: number
  brightness?: number
  focus?: [number, number]
  zoom?: number
  radius?: number
  wander?: boolean
}

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImg;
uniform vec2 uFocus;
uniform float uZoom;
uniform vec2 uMouse;
uniform float uReveal;
uniform float uRadius;
uniform float uCell;
uniform float uAngle;
uniform float uContrast;
uniform float uBright;
uniform float uGrow;
uniform float uTime;
uniform vec3 uInk;

vec2 coverUv(vec2 p) {
  float canvasAspect = uRes.x / uRes.y;
  float imageAspect = uImg.x / uImg.y;
  vec2 s = canvasAspect > imageAspect ? vec2(1.0, imageAspect / canvasAspect) : vec2(canvasAspect / imageAspect, 1.0);
  vec2 uv = p * s + uFocus * (1.0 - s);
  return (uv - uFocus) / uZoom + uFocus;
}

float darkness(vec2 uv) {
  vec4 c = texture2D(uTex, uv);
  float l = dot(c.rgb, vec3(0.299, 0.587, 0.114));
  l = clamp((l - 0.5) * uContrast + 0.5 + uBright, 0.0, 1.0);
  return (1.0 - l) * c.a;
}

void main() {
  vec2 frag = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  float s = sin(uAngle);
  float c = cos(uAngle);
  mat2 rot = mat2(c, -s, s, c);
  mat2 inv = mat2(c, s, -s, c);

  vec2 rp = rot * frag;
  vec2 base = floor(rp / uCell);
  float dotAlpha = 0.0;
  // Check neighbouring cells too, so big dark dots overlap into round blobs instead of clipped squares.
  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      vec2 center = (base + vec2(float(x), float(y)) + 0.5) * uCell;
      vec2 samplePoint = clamp((inv * center) / uRes, 0.0, 1.0);
      float d = darkness(coverUv(samplePoint));
      float r = uCell * 0.74 * sqrt(d) * uGrow;
      dotAlpha = max(dotAlpha, 1.0 - smoothstep(r - 0.9, r + 0.9, length(rp - center)));
    }
  }

  vec2 m = frag - uMouse;
  float a = atan(m.y, m.x);
  float wobble = 1.0 + 0.13 * sin(a * 5.0 + uTime * 1.7) + 0.06 * sin(a * 9.0 - uTime * 2.3);
  float reveal = (1.0 - smoothstep(uRadius * 0.4, uRadius, length(m) / wobble)) * uReveal;

  vec3 photo = texture2D(uTex, coverUv(frag / uRes)).rgb;
  gl_FragColor = vec4(mix(uInk * dotAlpha, photo, reveal), mix(dotAlpha, 1.0, reveal));
}
`

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader))
    return null
  }
  return shader
}

function parseColor(value: string): [number, number, number] {
  const parts = value.match(/[\d.]+/g)
  if (!parts || parts.length < 3) return [0, 0, 0]
  return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255]
}

const ease = (t: number): number => 1 - Math.pow(1 - t, 3)

export default function Halftone({
  src,
  alt,
  className = '',
  cell = 7,
  angle = 18,
  contrast = 1.3,
  brightness = 0.04,
  focus = [0.5, 0.5],
  zoom = 1,
  radius = 140,
  wander = false
}: HalftoneProps): React.ReactElement {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [failed, setFailed] = React.useState(false)
  const [focusX, focusY] = focus

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false, alpha: true })
    const vertex = gl && compile(gl, gl.VERTEX_SHADER, VERTEX)
    const fragment = gl && compile(gl, gl.FRAGMENT_SHADER, FRAGMENT)
    if (!gl || !vertex || !fragment) {
      setFailed(true)
      return
    }

    const program = gl.createProgram()!
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const uniform = (name: string): WebGLUniformLocation | null => gl.getUniformLocation(program, name)
    const u = {
      res: uniform('uRes'), img: uniform('uImg'), focus: uniform('uFocus'), zoom: uniform('uZoom'), mouse: uniform('uMouse'),
      reveal: uniform('uReveal'), radius: uniform('uRadius'), cell: uniform('uCell'), angle: uniform('uAngle'),
      contrast: uniform('uContrast'), bright: uniform('uBright'), grow: uniform('uGrow'), time: uniform('uTime'), ink: uniform('uInk')
    }

    const texture = gl.createTexture()
    let imageSize: [number, number] = [1, 1]
    let loaded = false
    let dirty = true
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      imageSize = [image.naturalWidth, image.naturalHeight]
      loaded = true
      dirty = true
    }
    image.onerror = () => setFailed(true)
    image.src = src

    let ink: [number, number, number] = [0, 0, 0]
    const readInk = (): void => {
      ink = parseColor(getComputedStyle(canvas).color)
      dirty = true
    }
    readInk()

    let dpr = 1
    const resize = (): void => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr))
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
      dirty = true
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    const reduced = prefersReducedMotion()
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 }
    let reveal = 0
    let revealTarget = 0
    let lastPointer = -Infinity
    let growStart = -1
    let visible = false
    let frame = 0

    const onPointerMove = (event: PointerEvent): void => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const inside = x > -radius && y > -radius && x < rect.width + radius && y < rect.height + radius
      lastPointer = performance.now()
      mouse.tx = x
      mouse.ty = y
      if (mouse.x < -9000) { mouse.x = x; mouse.y = y }
      revealTarget = inside ? 1 : 0
    }
    const onPointerLeave = (): void => { revealTarget = 0 }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)

    const render = (time: number): void => {
      if (!visible) { frame = 0; return }
      frame = requestAnimationFrame(render)
      if (!loaded) return

      if (wander && !reduced && time - lastPointer > 2600) {
        mouse.tx = canvas.clientWidth * (0.5 + 0.3 * Math.sin(time * 0.00041))
        mouse.ty = canvas.clientHeight * (0.4 + 0.2 * Math.sin(time * 0.00063 + 1.3))
        if (mouse.x < -9000) { mouse.x = mouse.tx; mouse.y = mouse.ty }
        revealTarget = 0.85
      }

      const prevReveal = reveal
      mouse.x += (mouse.tx - mouse.x) * 0.16
      mouse.y += (mouse.ty - mouse.y) * 0.16
      reveal += (revealTarget - reveal) * 0.08
      if (growStart < 0) growStart = time
      const grow = reduced ? 1 : ease(Math.min(1, (time - growStart) / 1700))

      const animating = grow < 1 || reveal > 0.002 || Math.abs(reveal - prevReveal) > 0.0005
      if (!animating && !dirty) return
      dirty = false

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.uniform2f(u.res, canvas.width, canvas.height)
      gl.uniform2f(u.img, imageSize[0], imageSize[1])
      gl.uniform2f(u.focus, focusX, focusY)
      gl.uniform1f(u.zoom, zoom)
      gl.uniform2f(u.mouse, mouse.x * dpr, mouse.y * dpr)
      gl.uniform1f(u.reveal, reveal)
      gl.uniform1f(u.radius, radius * dpr)
      gl.uniform1f(u.cell, cell * dpr)
      gl.uniform1f(u.angle, (angle * Math.PI) / 180)
      gl.uniform1f(u.contrast, contrast)
      gl.uniform1f(u.bright, brightness)
      gl.uniform1f(u.grow, grow)
      gl.uniform1f(u.time, time / 1000)
      gl.uniform3f(u.ink, ink[0], ink[1], ink[2])
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame) frame = requestAnimationFrame(render)
    }, { rootMargin: '120px' })
    intersection.observe(canvas)

    return () => {
      visible = false
      cancelAnimationFrame(frame)
      intersection.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
      // The canvas keeps its context across StrictMode remounts, so free resources instead of losing it.
      gl.deleteTexture(texture)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vertex)
      gl.deleteShader(fragment)
    }
  }, [src, cell, angle, contrast, brightness, focusX, focusY, zoom, radius, wander])

  if (failed) {
    return <img className={`halftone halftone-fallback ${className}`} src={src} alt={alt} />
  }

  return <canvas ref={canvasRef} className={`halftone ${className}`} role="img" aria-label={alt} />
}
