// Live type: words drawn once onto a canvas, then pushed around by a fragment shader
// as the cursor moves over them. Plain WebGL2, no three.js, so this mood stays light.
// Each effect comes from one of my posters (the melting Stay Close, the spiral Think)
// or from the project it sits on (a lens for medical precision, a mirror for RTL).

export type Effect = 'flow' | 'melt' | 'lens' | 'mirror' | 'pinch' | 'halftone' | 'twirl' | 'ripple'
export type Paint = (ctx: CanvasRenderingContext2D, w: number, h: number) => void

const MODE: Record<Effect, number> = { flow: 0, melt: 1, lens: 2, mirror: 3, pinch: 4, halftone: 5, twirl: 6, ripple: 7 }
// Effects that leave a trail need a buffer that remembers where you've been.
const TRAILS: Effect[] = ['flow', 'melt']

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() { vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`

// The trail: last frame's displacement, faded, plus a new splat where the cursor is.
// Melt also shifts the whole field down a little each frame, so drips run.
const TRAIL = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uPrev;
uniform vec2 uMouse;
uniform vec2 uVel;
uniform float uSplat;
uniform float uAspect;
uniform int uMode;
uniform vec2 uTexel;
float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
// Smooth noise along x, so neighbouring drips differ without tearing apart.
float drips(float x) {
  float i = floor(x);
  float f = fract(x);
  return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f));
}
void main() {
  vec2 uv = vUv;
  if (uMode == 1) uv.y += uTexel.y * 0.9;
  vec2 d = texture(uPrev, uv).rg * 2.0 - 1.0;
  d *= uMode == 1 ? 0.994 : 0.955;
  d -= sign(d) * min(abs(d), vec2(uMode == 1 ? 0.0015 : 0.004));
  vec2 p = vUv - uMouse;
  p.x *= uAspect;
  if (uMode == 1) {
    float g = exp(-dot(p, p) / 0.007);
    float run = 0.2 + 0.8 * pow(drips(vUv.x * 46.0), 2.0);
    d.y = min(1.0, d.y + g * uSplat * run * 0.09);
  } else {
    float g = exp(-dot(p, p) / 0.01);
    d += g * uVel * uSplat;
  }
  o = vec4(clamp(d, -1.0, 1.0) * 0.5 + 0.5, 0.0, 1.0);
}`

const DRAW = `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 o;
uniform sampler2D uText;
uniform sampler2D uTrail;
uniform vec2 uMouse;
uniform float uPower;
uniform float uAspect;
uniform int uMode;
uniform float uTime;
uniform vec2 uRes;
uniform vec4 uWaves[6];
vec4 tex(vec2 uv) { return texture(uText, uv); }
void main() {
  vec2 uv = vUv;
  vec2 p = uv - uMouse;
  p.x *= uAspect;
  float dist = length(p);
  vec4 c;
  if (uMode == 0) {
    // Smear along the stroke, with the inks splitting like a misprint.
    vec2 off = (texture(uTrail, uv).rg * 2.0 - 1.0) * 0.08;
    vec4 a = tex(uv - off), b = tex(uv - off * 1.1), e = tex(uv - off * 1.2);
    c = vec4(a.r, b.g, e.b, max(max(a.a, b.a), e.a));
  } else if (uMode == 1) {
    float drop = max(0.0, texture(uTrail, uv).g * 2.0 - 1.0);
    c = tex(uv + vec2(0.0, drop * 0.32));
  } else if (uMode == 2) {
    float k = clamp(1.0 - dist / 0.2, 0.0, 1.0) * uPower;
    vec2 q = uv - uMouse;
    c = tex(uMouse + q * (1.0 - k * k * 0.62));
    float ring = smoothstep(0.004, 0.0, abs(dist - 0.2)) * uPower;
    c = mix(c, vec4(vec3(0.07, 0.09, 0.25) * 0.9, 0.9), ring * 0.8);
  } else if (uMode == 3) {
    float m = smoothstep(0.19, 0.18, dist) * clamp(uPower * 1.4, 0.0, 1.0);
    c = mix(tex(uv), tex(vec2(2.0 * uMouse.x - uv.x, uv.y)), m);
    float ring = smoothstep(0.003, 0.0, abs(dist - 0.185)) * uPower;
    c = mix(c, vec4(0.84, 0.16, 0.12, 1.0), ring);
  } else if (uMode == 4) {
    float k = exp(-dist * dist / 0.06) * uPower;
    c = tex(uv - (uMouse - uv) * k * 1.1);
  } else if (uMode == 5) {
    // Near the cursor the type prints as halftone, dots growing with the ink under them.
    float k = smoothstep(0.34, 0.0, dist) * uPower;
    float cell = mix(2.0, 26.0, k) * uRes.x / 1400.0;
    vec2 px = uv * uRes;
    vec2 cc = (floor(px / cell) + 0.5) * cell;
    vec4 s = tex(cc / uRes);
    float rad = sqrt(s.a) * cell * 0.66;
    float a = smoothstep(rad, rad - 1.5, length(px - cc));
    vec4 dots = vec4(s.rgb / max(s.a, 0.001) * a, a);
    c = mix(tex(uv), dots, smoothstep(0.04, 0.25, k));
  } else if (uMode == 6) {
    float t = clamp(1.0 - dist / 0.42, 0.0, 1.0);
    float ang = t * t * uPower * 6.0;
    vec2 q = uv - uMouse;
    q.x *= uAspect;
    q = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * q;
    q.x /= uAspect;
    c = tex(uMouse + q);
  } else {
    vec2 off = vec2(0.0);
    for (int i = 0; i < 6; i++) {
      vec4 w = uWaves[i];
      if (w.w <= 0.0) continue;
      float age = uTime - w.z;
      vec2 q = uv - w.xy;
      q.x *= uAspect;
      float d = length(q);
      float front = age * 0.32;
      float wave = sin((d - front) * 42.0) * exp(-abs(d - front) * 10.0) * exp(-age * 0.9) * w.w;
      off += q / max(d, 0.001) * wave * 0.045;
    }
    c = tex(uv + vec2(off.x / uAspect, off.y));
  }
  o = c;
}`

type Target = { fb: WebGLFramebuffer; tex: WebGLTexture }

function compile(gl: WebGL2RenderingContext, frag: string): WebGLProgram {
  const program = gl.createProgram()!
  for (const [type, source] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, frag]] as const) {
    const shader = gl.createShader(type)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(`${type === gl.VERTEX_SHADER ? 'vertex' : 'fragment'}: ${gl.getShaderInfoLog(shader) || 'no log'} (lost: ${gl.isContextLost()})`)
    gl.attachShader(program, shader)
  }
  gl.bindAttribLocation(program, 0, 'aPos')
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? 'link')
  return program
}

export function liveType(canvas: HTMLCanvasElement, effect: Effect, paint: Paint, fonts: string[]): () => void {
  const host = canvas.parentElement!
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const text = document.createElement('canvas')
  const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, antialias: false })
  let width = 0
  let height = 0
  let scale = 1
  let disposed = false

  const drawText = (): void => {
    const ctx = text.getContext('2d')!
    text.width = Math.round(width * scale)
    text.height = Math.round(height * scale)
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    ctx.clearRect(0, 0, width, height)
    paint(ctx, width, height)
  }

  // No WebGL2: the type still shows, it just doesn't move.
  if (!gl) {
    const flat = (): void => {
      width = canvas.clientWidth
      height = canvas.clientHeight
      scale = Math.min(window.devicePixelRatio || 1, 2)
      drawText()
      canvas.width = text.width
      canvas.height = text.height
      canvas.getContext('2d')?.drawImage(text, 0, 0)
    }
    void Promise.all(fonts.map((f) => document.fonts.load(f))).then(flat)
    const observer = new ResizeObserver(flat)
    observer.observe(canvas)
    return () => observer.disconnect()
  }

  const trail = TRAILS.includes(effect)
  const draw = compile(gl, DRAW)
  const trailProgram = trail ? compile(gl, TRAIL) : null
  const quad = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, quad)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  const textTex = gl.createTexture()!
  const half = !!gl.getExtension('EXT_color_buffer_float')
  let targets: Target[] = []

  const makeTargets = (): void => {
    for (const t of targets) { gl.deleteFramebuffer(t.fb); gl.deleteTexture(t.tex) }
    targets = []
    if (!trail) return
    const w = Math.max(2, Math.round(width / 4))
    const h = Math.max(2, Math.round(height / 4))
    for (let i = 0; i < 2; i++) {
      const tex = gl.createTexture()!
      gl.bindTexture(gl.TEXTURE_2D, tex)
      if (half) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null)
      else gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      const fb = gl.createFramebuffer()!
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb)
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0)
      // Start flat: 0.5 is "no displacement".
      gl.viewport(0, 0, w, h)
      gl.clearColor(0.5, 0.5, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)
      targets.push({ fb, tex })
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }

  const upload = (): void => {
    drawText()
    gl.bindTexture(gl.TEXTURE_2D, textTex)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, text)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  }

  const resize = (): void => {
    width = canvas.clientWidth
    height = canvas.clientHeight
    scale = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(width * scale)
    canvas.height = Math.round(height * scale)
    makeTargets()
    upload()
  }

  // The cursor, and a hand that drifts over the type when nobody's touching it.
  const mouse = { x: 0.5, y: 0.5 }
  const smooth = { x: 0.5, y: 0.5 }
  let lastInput = -1e9
  let hovering = false
  let power = 0
  let current = 0
  const waves = new Float32Array(24)
  let wave = 0
  let lastWave = 0
  const SWEEP = 1.5
  let sweepAt = -10

  const onMove = (event: PointerEvent): void => {
    const box = canvas.getBoundingClientRect()
    mouse.x = (event.clientX - box.left) / box.width
    mouse.y = 1 - (event.clientY - box.top) / box.height
    lastInput = performance.now()
    hovering = true
  }
  const onLeave = (): void => { hovering = false }
  host.addEventListener('pointermove', onMove)
  host.addEventListener('pointerdown', onMove)
  host.addEventListener('pointerleave', onLeave)

  const uniforms = (program: WebGLProgram, name: string): WebGLUniformLocation | null => gl.getUniformLocation(program, name)
  const u = {
    text: uniforms(draw, 'uText'), trail: uniforms(draw, 'uTrail'), mouse: uniforms(draw, 'uMouse'), power: uniforms(draw, 'uPower'),
    aspect: uniforms(draw, 'uAspect'), mode: uniforms(draw, 'uMode'), time: uniforms(draw, 'uTime'), res: uniforms(draw, 'uRes'), waves: uniforms(draw, 'uWaves')
  }
  const t = trailProgram ? {
    prev: uniforms(trailProgram, 'uPrev'), mouse: uniforms(trailProgram, 'uMouse'), vel: uniforms(trailProgram, 'uVel'), splat: uniforms(trailProgram, 'uSplat'),
    aspect: uniforms(trailProgram, 'uAspect'), mode: uniforms(trailProgram, 'uMode'), texel: uniforms(trailProgram, 'uTexel')
  } : null

  let raf = 0
  let running = false
  let prev = performance.now()
  const start = prev

  const frame = (now: number): void => {
    if (!running || disposed) return
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - prev) / 1000)
    prev = now
    const time = (now - start) / 1000
    const idle = now - lastInput > 2600
    // Arriving on a cover, the hand sweeps once through the word so you see it give.
    const sweep = idle ? (time - sweepAt) / SWEEP : 1
    const sweeping = sweep >= 0 && sweep < 1
    const eased = sweeping ? 1 - Math.pow(1 - sweep, 2) : 0
    const target = sweeping
      ? { x: 0.08 + eased * 0.84, y: 0.5 + Math.sin(eased * Math.PI * 2) * 0.1 }
      : idle
        ? { x: 0.5 + Math.sin(time * 0.31) * 0.34, y: 0.5 + Math.sin(time * 0.47 + 1.2) * 0.2 }
        : mouse
    const was = { ...smooth }
    if (sweeping && sweep < 0.04) { smooth.x = target.x; smooth.y = target.y; was.x = target.x; was.y = target.y }
    const follow = sweeping ? 0.35 : idle ? 0.05 : 0.22
    smooth.x += (target.x - smooth.x) * follow
    smooth.y += (target.y - smooth.y) * follow
    const vx = (smooth.x - was.x) / Math.max(dt, 0.001)
    const vy = (smooth.y - was.y) / Math.max(dt, 0.001)
    const speed = Math.hypot(vx, vy)
    // Hover effects follow presence; the rest follow how much you move.
    const hoverish = effect === 'lens' || effect === 'mirror' || effect === 'halftone'
    const goal = sweeping ? 1 : hoverish ? (idle ? 0.75 : hovering ? 1 : 0) : Math.min(1, speed * (idle ? 1.1 : 0.9))
    current += (goal - current) * (goal > current ? 0.12 : 0.025)
    power = current

    if (effect === 'ripple' && speed > 0.08 && time - lastWave > (idle ? 0.5 : 0.11)) {
      waves.set([smooth.x, smooth.y, time, Math.min(1, 0.4 + speed) * (idle ? 0.6 : 1)], wave * 4)
      wave = (wave + 1) % 6
      lastWave = time
    }

    const aspect = width / Math.max(1, height)
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    if (trail && trailProgram && t && targets.length === 2) {
      const w = Math.max(2, Math.round(width / 4))
      const h = Math.max(2, Math.round(height / 4))
      gl.useProgram(trailProgram)
      gl.bindFramebuffer(gl.FRAMEBUFFER, targets[1].fb)
      gl.viewport(0, 0, w, h)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, targets[0].tex)
      gl.uniform1i(t.prev, 0)
      gl.uniform2f(t.mouse, smooth.x, smooth.y)
      gl.uniform2f(t.vel, Math.max(-6, Math.min(6, vx)) * 0.12, Math.max(-6, Math.min(6, vy)) * 0.12)
      gl.uniform1f(t.splat, effect === 'melt' ? Math.min(1, speed * 1.4) : 1)
      gl.uniform1f(t.aspect, aspect)
      gl.uniform1i(t.mode, MODE[effect])
      gl.uniform2f(t.texel, 1 / w, 1 / h)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      targets.reverse()
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(draw)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textTex)
    gl.uniform1i(u.text, 0)
    if (targets.length) {
      gl.activeTexture(gl.TEXTURE1)
      gl.bindTexture(gl.TEXTURE_2D, targets[0].tex)
      gl.uniform1i(u.trail, 1)
    }
    gl.uniform2f(u.mouse, smooth.x, smooth.y)
    gl.uniform1f(u.power, still ? 0 : power)
    gl.uniform1f(u.aspect, aspect)
    gl.uniform1i(u.mode, MODE[effect])
    gl.uniform1f(u.time, time)
    gl.uniform2f(u.res, canvas.width, canvas.height)
    gl.uniform4fv(u.waves, waves)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    if (still) { running = false; cancelAnimationFrame(raf) }
  }

  const play = (): void => {
    if (running || disposed) return
    running = true
    sweepAt = (performance.now() - start) / 1000 + 0.35
    prev = performance.now()
    raf = requestAnimationFrame(frame)
  }
  const pause = (): void => { running = false; cancelAnimationFrame(raf) }

  const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()), { rootMargin: '10% 0px' })
  const sizer = new ResizeObserver(() => { resize(); if (!running) { running = true; frame(performance.now()); running = false } })
  const onFonts = (): void => { upload() }

  void Promise.all(fonts.map((f) => document.fonts.load(f))).catch(() => undefined).then(() => {
    if (disposed) return
    resize()
    sizer.observe(canvas)
    visibility.observe(canvas)
    document.fonts.addEventListener('loadingdone', onFonts)
  })

  return () => {
    disposed = true
    pause()
    visibility.disconnect()
    sizer.disconnect()
    document.fonts.removeEventListener('loadingdone', onFonts)
    host.removeEventListener('pointermove', onMove)
    host.removeEventListener('pointerdown', onMove)
    host.removeEventListener('pointerleave', onLeave)
    // Free what we made but keep the context: the canvas may be mounted again (React's
    // development double-mount does exactly that), and a lost context can't come back.
    for (const target of targets) { gl.deleteFramebuffer(target.fb); gl.deleteTexture(target.tex) }
    gl.deleteTexture(textTex)
    gl.deleteBuffer(quad)
    gl.deleteProgram(draw)
    if (trailProgram) gl.deleteProgram(trailProgram)
  }
}

// Set a line of type as large as it can be inside a box.
export function fit(ctx: CanvasRenderingContext2D, line: string, font: (size: number) => string, maxWidth: number, maxHeight: number): number {
  ctx.font = font(100)
  const m = ctx.measureText(line)
  const tall = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) || 100
  const size = Math.min((100 * maxWidth) / Math.max(1, m.width), (100 * maxHeight) / tall)
  ctx.font = font(size)
  return size
}
