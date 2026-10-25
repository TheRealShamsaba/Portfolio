import React from 'react'

// A quiet, sample-free four-bar groove. Its audio clock, rather than animation
// frames, schedules the swing; no context or sound exists before a deliberate tap.
function createBeat() {
  const Context = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Context) return null
  const ctx = new Context()
  const master = ctx.createGain()
  const limiter = ctx.createDynamicsCompressor()
  master.gain.value = 0
  limiter.threshold.value = -16
  limiter.ratio.value = 4
  limiter.attack.value = .003
  limiter.release.value = .16
  master.connect(limiter)
  limiter.connect(ctx.destination)
  const noise = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * .24), ctx.sampleRate)
  const samples = noise.getChannelData(0)
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1
  const voices = new Set<AudioScheduledSourceNode>()

  const tone = (time: number, frequency: number, level: number, length: number, type: OscillatorType = 'sine', drop?: number): void => {
    const source = ctx.createOscillator()
    const gain = ctx.createGain()
    source.type = type
    source.frequency.setValueAtTime(frequency,time)
    if (drop) source.frequency.exponentialRampToValueAtTime(drop,time + .09)
    gain.gain.setValueAtTime(.0001,time)
    gain.gain.exponentialRampToValueAtTime(level,time + .006)
    gain.gain.exponentialRampToValueAtTime(.0001,time + length)
    source.connect(gain)
    gain.connect(master)
    source.start(time)
    source.stop(time + length + .02)
    voices.add(source)
    source.onended = () => { voices.delete(source); source.disconnect(); gain.disconnect() }
  }
  const hit = (time: number, level: number, length: number, cutoff: number): void => {
    const source = ctx.createBufferSource()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()
    source.buffer = noise
    filter.type = 'highpass'
    filter.frequency.value = cutoff
    gain.gain.setValueAtTime(level,time)
    gain.gain.exponentialRampToValueAtTime(.0001,time + length)
    source.connect(filter)
    filter.connect(gain)
    gain.connect(master)
    source.start(time)
    source.stop(time + length + .01)
    voices.add(source)
    source.onended = () => { voices.delete(source); source.disconnect(); filter.disconnect(); gain.disconnect() }
  }
  let active = false
  let interval = 0
  let pause = 0
  let next = 0
  let step = 0
  const sixteenth = 60 / 88 / 4
  const schedule = (): void => {
    if (!active || ctx.state !== 'running') return
    if (next < ctx.currentTime) next = ctx.currentTime + .04
    while (next < ctx.currentTime + .12) {
      const at = step % 16
      const bar = Math.floor(step / 16) % 4
      const swung = next + (at % 2 ? .027 : 0)
      if (at === 0 || at === 7 || at === 10 || (bar === 3 && at === 14)) tone(swung,145,.75,.3,'sine',47)
      if (at === 4 || at === 12) { hit(swung,.24,.16,1100); tone(swung,174,.09,.09,'triangle') }
      if (at % 2 === 0) hit(swung,.035 + (at % 4 === 2 ? .012 : 0),at === 14 ? .085 : .035,7200)
      if (at === 3 || (bar % 2 && at === 11)) hit(swung,.013,.025,8500)
      const bass = [87.31,87.31,103.83,77.78][bar]
      if (at === 0 || at === 10) tone(swung,bass,.13,at === 0 ? .43 : .29,'sine')
      if (at === 0 && bar % 2 === 0) [130.81,174.61,207.65,261.63].forEach((note,i) => tone(swung + i * .012,note,.017,1.35,'triangle'))
      next += sixteenth
      step = (step + 1) % 64
    }
  }
  return {
    async start(): Promise<boolean> {
      window.clearTimeout(pause)
      active = true
      await ctx.resume()
      if (!active || ctx.state !== 'running') return false
      next = ctx.currentTime + .06
      step = 0
      master.gain.setTargetAtTime(.3,ctx.currentTime,.02)
      window.clearInterval(interval)
      schedule()
      interval = window.setInterval(schedule,25)
      return true
    },
    stop(): void {
      active = false
      window.clearInterval(interval)
      if (ctx.state === 'closed') return
      master.gain.setTargetAtTime(0,ctx.currentTime,.015)
      voices.forEach((voice) => { try { voice.stop(ctx.currentTime + .04) } catch { /* Already finished. */ } })
      pause = window.setTimeout(() => { if (ctx.state === 'running') void ctx.suspend().catch(() => undefined) },100)
    },
    destroy(): void {
      active = false
      window.clearInterval(interval)
      window.clearTimeout(pause)
      if (ctx.state !== 'closed') void ctx.close().catch(() => undefined)
    }
  }
}

export default function useRecordBeat() {
  const engine = React.useRef<ReturnType<typeof createBeat>>(null)
  const desired = React.useRef(false)
  const mounted = React.useRef(true)
  const [on,setOn] = React.useState(false)
  const [unavailable,setUnavailable] = React.useState(false)
  React.useEffect(() => {
    mounted.current = true
    const hide = (): void => {
      if (!document.hidden) return
      desired.current = false
      engine.current?.stop()
      setOn(false)
    }
    document.addEventListener('visibilitychange',hide)
    return () => {
      mounted.current = false
      desired.current = false
      document.removeEventListener('visibilitychange',hide)
      engine.current?.destroy()
      engine.current = null
    }
  },[])
  const toggle = async (): Promise<void> => {
    desired.current = !desired.current
    if (!desired.current) { engine.current?.stop(); setOn(false); return }
    try {
      engine.current ??= createBeat()
      if (!engine.current) { desired.current = false; setUnavailable(true); return }
      const started = await engine.current.start()
      if (mounted.current && desired.current) { setOn(started); if (!started) desired.current = false }
    } catch {
      desired.current = false
      engine.current?.stop()
      if (mounted.current) { setOn(false); setUnavailable(true) }
    }
  }
  return { on,unavailable,toggle }
}
