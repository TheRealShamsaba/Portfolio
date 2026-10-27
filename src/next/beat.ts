// The album's beat: a four-bar boom-bap loop, synthesised in the browser (nothing
// sampled, nothing licensed), and a deck that plays it at whatever speed the record is
// turning. Normal spin is normal speed; a hand moving the record back and forth is a
// real scratch, backwards included; a hand holding it still is silence.

export const BPM = 88
export const STEP = 60 / BPM / 4 // one sixteenth
export const BAR = STEP * 16
export const BARS = 4
export const LOOP = BAR * BARS

// Boom-bap: kick on 1, the "and" of 2 and the "and" of 3; snare on 2 and 4.
export const KICKS = [0, 7, 10]
export const SNARES = [4, 12]
const SWING = 0.16 // the off-sixteenths land late

const at = (bar: number, step: number): number => bar * BAR + (step + (step % 2 ? SWING : 0)) * STEP

// Every hit in the loop, in seconds, for the visuals to read the groove.
export const HITS = {
  kick: Array.from({ length: BARS }, (_, bar) => KICKS.map((s) => at(bar, s))).flat().concat(at(3, 14)),
  snare: Array.from({ length: BARS }, (_, bar) => SNARES.map((s) => at(bar, s))).flat()
}

// How long ago (seconds) the last hit was, at a loop position.
export function since(hits: number[], pos: number): number {
  let best = Infinity
  for (const t of hits) {
    const d = (pos - t + LOOP) % LOOP
    if (d < best) best = d
  }
  return best
}

const midi = (n: number): number => 440 * Math.pow(2, (n - 69) / 12)
// Am7, Fmaj7, Dm7, E7.
const CHORDS = [[57, 60, 64, 67], [53, 57, 60, 64], [50, 53, 57, 60], [52, 56, 59, 62]]
const ROOTS = [33, 29, 26, 28]

export async function renderBeat(): Promise<AudioBuffer> {
  const rate = 44100
  const ctx = new OfflineAudioContext(2, Math.ceil(LOOP * rate), rate)
  const out = ctx.createDynamicsCompressor()
  out.threshold.value = -14
  out.ratio.value = 3
  const dust = ctx.createBiquadFilter()
  dust.type = 'lowpass'
  dust.frequency.value = 9000
  out.connect(dust).connect(ctx.destination)

  const noise = ctx.createBuffer(1, rate, rate)
  const n = noise.getChannelData(0)
  for (let i = 0; i < n.length; i++) n[i] = Math.random() * 2 - 1

  const kick = (t: number, level = 1): void => {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.frequency.setValueAtTime(150, t)
    osc.frequency.exponentialRampToValueAtTime(44, t + 0.12)
    g.gain.setValueAtTime(level, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
    osc.connect(g).connect(out)
    osc.start(t)
    osc.stop(t + 0.55)
  }
  const snare = (t: number): void => {
    const src = ctx.createBufferSource()
    src.buffer = noise
    const band = ctx.createBiquadFilter()
    band.type = 'bandpass'
    band.frequency.value = 1900
    band.Q.value = 0.7
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.75, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
    src.connect(band).connect(g).connect(out)
    src.start(t)
    src.stop(t + 0.25)
    const body = ctx.createOscillator()
    body.type = 'triangle'
    body.frequency.setValueAtTime(200, t)
    body.frequency.exponentialRampToValueAtTime(150, t + 0.08)
    const bg = ctx.createGain()
    bg.gain.setValueAtTime(0.45, t)
    bg.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
    body.connect(bg).connect(out)
    body.start(t)
    body.stop(t + 0.14)
  }
  const hat = (t: number, level: number): void => {
    const src = ctx.createBufferSource()
    src.buffer = noise
    const high = ctx.createBiquadFilter()
    high.type = 'highpass'
    high.frequency.value = 7200
    const g = ctx.createGain()
    g.gain.setValueAtTime(level, t)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05)
    src.connect(high).connect(g).connect(out)
    src.start(t, Math.random() * 0.5)
    src.stop(t + 0.06)
  }
  const bass = (t: number, note: number, length: number): void => {
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = midi(note)
    const low = ctx.createBiquadFilter()
    low.type = 'lowpass'
    low.frequency.value = 400
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.5, t + 0.01)
    g.gain.setTargetAtTime(0, t + length * 0.8, 0.05)
    osc.connect(low).connect(g).connect(out)
    osc.start(t)
    osc.stop(t + length + 0.2)
  }
  // Dusty keys: detuned saws through a soft filter, with a slow wobble like old tape.
  const keys = (t: number, notes: number[], length: number): void => {
    const low = ctx.createBiquadFilter()
    low.type = 'lowpass'
    low.frequency.value = 1300
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.085, t + 0.02)
    g.gain.setTargetAtTime(0.04, t + 0.05, 0.3)
    g.gain.setTargetAtTime(0, t + length, 0.08)
    low.connect(g).connect(out)
    const wobble = ctx.createOscillator()
    wobble.frequency.value = 0.6
    const depth = ctx.createGain()
    depth.gain.value = 9
    wobble.connect(depth)
    wobble.start(t)
    wobble.stop(t + length + 0.4)
    for (const note of notes) {
      for (const detune of [-7, 6]) {
        const osc = ctx.createOscillator()
        osc.type = 'sawtooth'
        osc.frequency.value = midi(note)
        osc.detune.value = detune
        depth.connect(osc.detune)
        osc.connect(low)
        osc.start(t)
        osc.stop(t + length + 0.4)
      }
    }
  }

  for (let bar = 0; bar < BARS; bar++) {
    for (const s of KICKS) kick(at(bar, s))
    for (const s of SNARES) snare(at(bar, s))
    for (let s = 0; s < 16; s += 2) hat(at(bar, s), s % 4 === 2 ? 0.22 : 0.13)
    hat(at(bar, 15), 0.07)
    bass(at(bar, 0), ROOTS[bar], STEP * 5)
    bass(at(bar, 7), ROOTS[bar], STEP * 2.5)
    bass(at(bar, 10), ROOTS[bar] + 12, STEP * 4)
    keys(at(bar, 0), CHORDS[bar], STEP * 6)
    keys(at(bar, 10), CHORDS[bar], STEP * 4)
  }
  kick(at(3, 14), 0.7)

  // Vinyl crackle under everything.
  const pops = ctx.createBuffer(1, Math.ceil(LOOP * rate), rate)
  const p = pops.getChannelData(0)
  for (let i = 0; i < p.length; i++) p[i] = (Math.random() < 0.0004 ? (Math.random() * 2 - 1) * 0.5 : 0) + (Math.random() * 2 - 1) * 0.006
  const crackle = ctx.createBufferSource()
  crackle.buffer = pops
  const high = ctx.createBiquadFilter()
  high.type = 'highpass'
  high.frequency.value = 1500
  crackle.connect(high).connect(ctx.destination)
  crackle.start(0)

  return ctx.startRendering()
}

// Reads the loop at any speed, forwards or backwards, smoothing changes so a scratch
// sounds like a hand on vinyl and not a click.
const WORKLET = `
class Deck extends AudioWorkletProcessor {
  constructor() {
    super()
    this.pos = 0; this.rate = 0; this.target = 0; this.l = null; this.r = null; this.tick = 0
    this.port.onmessage = (e) => {
      if (e.data.l) { this.l = e.data.l; this.r = e.data.r }
      if (typeof e.data.rate === 'number') this.target = e.data.rate
      if (typeof e.data.seek === 'number') this.pos = e.data.seek
    }
  }
  process(_, outputs) {
    const out = outputs[0]
    const L = out[0]
    const R = out[1] || out[0]
    if (!this.l) return true
    const n = this.l.length
    for (let i = 0; i < L.length; i++) {
      this.rate += (this.target - this.rate) * 0.0025
      const i0 = Math.floor(this.pos)
      const f = this.pos - i0
      const a = ((i0 % n) + n) % n
      const b = (a + 1) % n
      L[i] = this.l[a] + (this.l[b] - this.l[a]) * f
      R[i] = this.r[a] + (this.r[b] - this.r[a]) * f
      this.pos = (this.pos + this.rate + n) % n
    }
    if (++this.tick % 6 === 0) this.port.postMessage(this.pos)
    return true
  }
}
registerProcessor('deck', Deck)
`

export class Deck {
  ctx: AudioContext
  node: AudioWorkletNode | null = null
  analyser: AnalyserNode
  sampleRate: number
  position = 0 // seconds into the loop, as last heard from the deck
  private constructor(ctx: AudioContext) {
    this.ctx = ctx
    this.sampleRate = ctx.sampleRate
    this.analyser = ctx.createAnalyser()
    this.analyser.fftSize = 256
    this.analyser.smoothingTimeConstant = 0.7
  }

  static async start(): Promise<Deck> {
    const ctx = new AudioContext()
    const deck = new Deck(ctx)
    const url = URL.createObjectURL(new Blob([WORKLET], { type: 'application/javascript' }))
    await ctx.audioWorklet.addModule(url)
    URL.revokeObjectURL(url)
    const buffer = await renderBeat()
    // The loop is rendered at 44.1 kHz; resample by reading through a buffer at the
    // context's own rate if they differ.
    const data = await (async () => {
      if (buffer.sampleRate === ctx.sampleRate) return buffer
      const off = new OfflineAudioContext(2, Math.ceil(buffer.duration * ctx.sampleRate), ctx.sampleRate)
      const src = off.createBufferSource()
      src.buffer = buffer
      src.connect(off.destination)
      src.start()
      return off.startRendering()
    })()
    const node = new AudioWorkletNode(ctx, 'deck', { outputChannelCount: [2] })
    node.port.postMessage({ l: data.getChannelData(0), r: data.getChannelData(1) })
    node.port.onmessage = (e: MessageEvent<number>) => { deck.position = e.data / ctx.sampleRate }
    const master = ctx.createGain()
    master.gain.value = 0.9
    node.connect(master).connect(deck.analyser).connect(ctx.destination)
    deck.node = node
    return deck
  }

  setRate(rate: number): void { this.node?.port.postMessage({ rate }) }
  seek(seconds: number): void { this.node?.port.postMessage({ seek: seconds * this.ctx.sampleRate }) }
  close(): void { void this.ctx.close() }
}
