import React from 'react'
import { createPortal } from 'react-dom'
import { Chess, type Square } from 'chess.js'
import { knightvision } from '../site/data'
import { loadEngine, think, type Candidate } from './kvEngine'

// Play KnightVision: you take white, the real network plays black. Before every move it
// shows what it's considering: arrows for its top three, sized by how sure it is.

const FILES = 'abcdefgh'
const sq = (row: number, col: number): Square => `${FILES[col]}${8 - row}` as Square
const centre = (square: string): [number, number] => [square.charCodeAt(0) - 97 + 0.5, 8 - Number(square[1]) + 0.5]

function Arrows({ candidates, colour }: { candidates: Candidate[]; colour: string }): React.ReactElement {
  return (
    <svg className="kv-arrows" viewBox="0 0 8 8" aria-hidden="true">
      <defs>
        <marker id={`kv-head-${colour}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="2.6" markerHeight="2.6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={colour} />
        </marker>
      </defs>
      {candidates.map((move, i) => {
        const [x1, y1] = centre(move.from)
        const [x2, y2] = centre(move.to)
        const length = Math.hypot(x2 - x1, y2 - y1)
        const trim = 0.32 / length
        return (
          <line
            key={`${move.from}${move.to}`}
            x1={x1} y1={y1} x2={x2 - (x2 - x1) * trim} y2={y2 - (y2 - y1) * trim}
            stroke={colour}
            strokeWidth={0.1 + move.p * 0.22}
            strokeOpacity={i === 0 ? 0.9 : 0.55}
            strokeLinecap="round"
            markerEnd={`url(#kv-head-${colour})`}
          />
        )
      })}
    </svg>
  )
}

export function KnightVisionBoard({ onClose }: { onClose: () => void }): React.ReactElement {
  const game = React.useRef(new Chess())
  const [fen, setFen] = React.useState(game.current.fen())
  const [selected, setSelected] = React.useState<Square | null>(null)
  const [last, setLast] = React.useState<[string, string] | null>(null)
  const [progress, setProgress] = React.useState(0)
  const [ready, setReady] = React.useState(false)
  const [failed, setFailed] = React.useState(false)
  const [thinking, setThinking] = React.useState(false)
  const [considering, setConsidering] = React.useState<Candidate[]>([])
  const [hint, setHint] = React.useState<Candidate[]>([])
  const [showHints, setShowHints] = React.useState(true)
  // Each ply: the move, and for KnightVision's moves how sure it was.
  const [log, setLog] = React.useState<{ san: string; p?: number }[]>([])

  React.useEffect(() => {
    loadEngine(setProgress).then(() => setReady(true)).catch((error) => { console.error('KnightVision failed to load', String(error), error?.stack); setFailed(true) })
  }, [])

  // On your turn, ask the network what it would play for you.
  React.useEffect(() => {
    if (!ready || game.current.turn() !== 'w' || game.current.isGameOver()) { setHint([]); return }
    let alive = true
    think(game.current).then((moves) => { if (alive) setHint(moves.slice(0, 3)) }).catch(() => undefined)
    return () => { alive = false }
  }, [fen, ready])

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent): void => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.documentElement.classList.add('nx-locked')
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('nx-locked')
    }
  }, [onClose])

  const reply = async (): Promise<void> => {
    setThinking(true)
    const moves = await think(game.current)
    setConsidering(moves.slice(0, 3))
    // Let you see what it weighed before it commits.
    await new Promise((resolve) => window.setTimeout(resolve, 1100))
    const best = moves[0]
    const played = game.current.move({ from: best.from, to: best.to, promotion: 'q' })
    setLast([best.from, best.to])
    setLog((value) => [...value, { san: played.san, p: best.p }])
    setConsidering([])
    setThinking(false)
    setFen(game.current.fen())
  }

  const tap = (square: Square): void => {
    if (!ready || thinking || game.current.turn() !== 'w' || game.current.isGameOver()) return
    const piece = game.current.get(square)
    if (selected) {
      const legal = game.current.moves({ square: selected, verbose: true }).some((move) => move.to === square)
      if (legal) {
        const played = game.current.move({ from: selected, to: square, promotion: 'q' })
        setLast([selected, square])
        setLog((value) => [...value, { san: played.san }])
        setSelected(null)
        setHint([])
        setFen(game.current.fen())
        if (!game.current.isGameOver()) void reply()
        return
      }
    }
    setSelected(piece && piece.color === 'w' ? square : null)
  }

  const reset = (): void => {
    game.current = new Chess()
    setLast(null)
    setLog([])
    setSelected(null)
    setConsidering([])
    setFen(game.current.fen())
  }

  const targets = selected ? new Set(game.current.moves({ square: selected, verbose: true }).map((move) => move.to)) : new Set<string>()
  const board = game.current.board()
  const over = game.current.isGameOver()
  const turn = game.current.turn()
  const status = !ready
    ? failed ? 'Couldn’t load the network. Try again later.' : 'Loading the network'
    : over
      ? game.current.isCheckmate() ? (turn === 'w' ? 'Checkmate. KnightVision wins.' : 'Checkmate. You beat it.') : 'Draw.'
      : thinking ? 'Thinking' : 'Your move'
  const mind = considering.length ? considering : showHints ? hint : []
  const rows = Array.from({ length: Math.ceil(log.length / 2) }, (_, i) => [log[i * 2], log[i * 2 + 1]] as const)
  const logRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' }) }, [log.length])

  return createPortal(
    <div className="kv" role="dialog" aria-modal="true" aria-label="Play KnightVision">
      <header className="kv-top">
        <div className="kv-brand">
          <span className="kv-logo" aria-hidden="true">♞</span>
          <div>
            <p className="kv-name">KnightVision</p>
            <p className="kv-spec">Policy network · 25M parameters · running in your browser</p>
          </div>
        </div>
        <button type="button" className="kv-close" onClick={onClose} aria-label="Close">×</button>
      </header>

      <div className="kv-body">
        <div className="kv-play">
          <div className={`kv-player is-ai ${thinking ? 'is-active' : ''}`}>
            <span className="kv-avatar">♞</span>
            <span><b>KnightVision</b><small>Black · plays on instinct</small></span>
            {thinking ? <span className="kv-pulse">thinking<i /><i /><i /></span> : null}
          </div>

          <div className="kv-board-wrap">
            <div className={`kv-board ${thinking ? 'is-thinking' : ''}`}>
              {board.map((rank, row) => rank.map((piece, col) => {
                const square = sq(row, col)
                const dark = (row + col) % 2 === 1
                const isLast = last && (last[0] === square || last[1] === square)
                return (
                  <button
                    key={square}
                    type="button"
                    className={`kv-sq ${dark ? 'is-dark' : ''} ${selected === square ? 'is-selected' : ''} ${isLast ? 'is-last' : ''} ${targets.has(square) ? (piece ? 'is-capture' : 'is-target') : ''}`}
                    onClick={() => tap(square)}
                    aria-label={`${square}${piece ? ` ${piece.color === 'w' ? 'white' : 'black'} ${piece.type}` : ''}`}
                  >
                    {piece ? <img src={`/knightvision/pieces/${piece.color}${piece.type === 'p' ? 'p' : piece.type.toUpperCase()}.png`} alt="" draggable={false} /> : null}
                    {col === 0 ? <span className="kv-rank">{8 - row}</span> : null}
                    {row === 7 ? <span className="kv-file">{FILES[col]}</span> : null}
                  </button>
                )
              }))}
              {considering.length ? <Arrows candidates={considering} colour="#e5482f" /> : null}
              {!considering.length && showHints && hint.length ? <Arrows candidates={hint} colour="#4f7cff" /> : null}
            </div>
            {!ready ? (
              <div className="kv-loading">
                <p>{failed ? status : `Waking up the network · ${Math.round(progress * 100)}%`}</p>
                <span><i style={{ width: `${progress * 100}%` }} /></span>
              </div>
            ) : null}
          </div>

          <div className={`kv-player is-you ${ready && !thinking && !over && turn === 'w' ? 'is-active' : ''}`}>
            <span className="kv-avatar">♙</span>
            <span><b>You</b><small>White · tap a piece, then a square</small></span>
          </div>
        </div>

        <aside className="kv-side">
          <div className="kv-status">
            <span className={`kv-dot ${thinking ? 'is-ai' : ''}`} />
            <p>{status}</p>
          </div>

          <section className="kv-mind">
            <p className="kv-label">{considering.length ? 'What it’s weighing' : 'What it would play for you'}</p>
            <ol>
              {mind.length ? mind.map((move, i) => (
                <li key={`${move.from}${move.to}`} className={i === 0 ? 'is-top' : ''}>
                  <b>{move.san}</b>
                  <span className="kv-bar"><i style={{ width: `${Math.max(2, move.p * 100)}%` }} /></span>
                  <span className="kv-pct">{Math.round(move.p * 100)}%</span>
                </li>
              )) : <li className="kv-empty">{showHints ? 'Reading the board…' : 'Hints are off.'}</li>}
            </ol>
          </section>

          <section className="kv-moves">
            <p className="kv-label">Moves</p>
            <div className="kv-table" ref={logRef}>
              {rows.length ? rows.map(([white, black], i) => (
                <div key={i} className="kv-row">
                  <span className="kv-no">{i + 1}.</span>
                  <span>{white?.san}</span>
                  <span>{black ? <>{black.san}{black.p !== undefined ? <small>{Math.round(black.p * 100)}%</small> : null}</> : ''}</span>
                </div>
              )) : <p className="kv-empty">Your move. Start with anything.</p>}
            </div>
          </section>

          <div className="kv-actions">
            <label className="kv-switch">
              <input type="checkbox" checked={showHints} onChange={(event) => setShowHints(event.target.checked)} />
              <span aria-hidden="true" />
              Hints
            </label>
            <button type="button" className="kv-new" onClick={reset}>New game</button>
            <a href={knightvision.url} target="_blank" rel="noreferrer">Repo ↗</a>
          </div>
          <p className="kv-note">Red arrows: what it’s weighing before it moves. Blue: what it would play in your seat. It rates every legal move at a glance and plays its favourite, without searching ahead. Built with BakerDmo.</p>
        </aside>
      </div>
    </div>,
    document.body
  )
}
