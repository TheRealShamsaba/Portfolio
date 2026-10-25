import React from 'react'
import { prefersReducedMotion } from './motion'

// Morphy's Opera Game (Paris, 1858), replayed on a loop while the board is on screen.
const MOVES = [
  'e2e4', 'e7e5', 'g1f3', 'd7d6', 'd2d4', 'c8g4', 'd4e5', 'g4f3', 'd1f3', 'd6e5', 'f1c4', 'g8f6',
  'f3b3', 'd8e7', 'b1c3', 'c7c6', 'c1g5', 'b7b5', 'c3b5', 'c6b5', 'c4b5', 'b8d7', 'e1c1', 'a8d8',
  'd1d7', 'd8d7', 'h1d1', 'e7e6', 'b5d7', 'f6d7', 'b3b8', 'd7b8', 'd1d8'
]
const SAN = [
  'e4', 'e5', 'Nf3', 'd6', 'd4', 'Bg4', 'dxe5', 'Bxf3', 'Qxf3', 'dxe5', 'Bc4', 'Nf6',
  'Qb3', 'Qe7', 'Nc3', 'c6', 'Bg5', 'b5', 'Nxb5', 'cxb5', 'Bxb5+', 'Nbd7', 'O-O-O', 'Rd8',
  'Rxd7', 'Rxd7', 'Rd1', 'Qe6', 'Bxd7+', 'Nxd7', 'Qb8+', 'Nxb8', 'Rd8#'
]
const GLYPH: Record<string, string> = { k: '♚\uFE0E', q: '♛\uFE0E', r: '♜\uFE0E', b: '♝\uFE0E', n: '♞\uFE0E', p: '♟\uFE0E' }
const VALUE: Record<string, number> = { k: 0, q: 9, r: 5, b: 3, n: 3, p: 1 }

type Piece = { id: string; type: string; white: boolean; square: string; alive: boolean }

function startingPieces(): Piece[] {
  const back = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
  const files = 'abcdefgh'
  const pieces: Piece[] = []
  back.forEach((type, i) => {
    pieces.push({ id: `w${type}${i}`, type, white: true, square: `${files[i]}1`, alive: true })
    pieces.push({ id: `wp${i}`, type: 'p', white: true, square: `${files[i]}2`, alive: true })
    pieces.push({ id: `b${type}${i}`, type, white: false, square: `${files[i]}8`, alive: true })
    pieces.push({ id: `bp${i}`, type: 'p', white: false, square: `${files[i]}7`, alive: true })
  })
  return pieces
}

function play(pieces: Piece[], move: string): Piece[] {
  const from = move.slice(0, 2)
  const to = move.slice(2, 4)
  const next = pieces.map((piece) => {
    if (!piece.alive) return piece
    if (piece.square === to) return { ...piece, alive: false }
    if (piece.square === from) return { ...piece, square: to }
    return piece
  })
  if (move === 'e1c1') return next.map((p) => (p.alive && p.square === 'a1' ? { ...p, square: 'd1' } : p))
  return next
}

const position = (square: string): React.CSSProperties => ({
  transform: `translate(${(square.charCodeAt(0) - 97) * 100}%, ${(8 - Number(square[1])) * 100}%)`
})

export default function ChessBoard(): React.ReactElement {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const listRef = React.useRef<HTMLOListElement>(null)
  const [ply, setPly] = React.useState(0)
  const pieces = React.useMemo(() => MOVES.slice(0, ply).reduce(play, startingPieces()), [ply])

  React.useEffect(() => {
    if (prefersReducedMotion()) { setPly(MOVES.length); return }
    let timer = 0
    let visible = false
    let current = 0
    const tick = (): void => {
      current = current >= MOVES.length ? 0 : current + 1
      setPly(current)
      timer = window.setTimeout(tick, current === MOVES.length ? 4200 : current === 0 ? 900 : 1150)
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !visible) { visible = true; timer = window.setTimeout(tick, 600) }
      if (!entry.isIntersecting && visible) { visible = false; window.clearTimeout(timer) }
    })
    if (rootRef.current) observer.observe(rootRef.current)
    return () => { observer.disconnect(); window.clearTimeout(timer) }
  }, [])

  React.useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [ply])

  const material = pieces.reduce((sum, p) => (p.alive ? sum + (p.white ? 1 : -1) * VALUE[p.type] : sum), 0)
  const lastMove = ply > 0 ? MOVES[ply - 1] : ''
  const squares = Array.from({ length: 64 }, (_, i) => `${'abcdefgh'[i % 8]}${8 - Math.floor(i / 8)}`)

  return (
    <div className="chess" ref={rootRef} aria-label="A chess game replaying move by move">
      <div className="chess-board">
        {squares.map((square, i) => (
          <span
            key={square}
            className={`sq ${(Math.floor(i / 8) + i) % 2 ? 'is-dark' : ''} ${lastMove.includes(square) ? 'is-last' : ''}`}
          />
        ))}
        {pieces.map((piece) => (
          <span
            key={piece.id}
            className={`piece ${piece.white ? 'is-white' : 'is-black'} ${piece.alive ? '' : 'is-taken'}`}
            style={position(piece.square)}
          >
            {GLYPH[piece.type]}
          </span>
        ))}
        {ply === MOVES.length ? <span className="chess-mate">Mate.</span> : null}
      </div>
      <div className="chess-side">
        <p className="chess-title">Paris, 1858<br /><em>Morphy’s Opera Game</em></p>
        <ol className="chess-moves" ref={listRef}>
          {SAN.slice(0, ply).map((san, i) => (
            <li key={i} className={i === ply - 1 ? 'is-current' : ''}>{i % 2 === 0 ? `${i / 2 + 1}. ` : ''}{san}</li>
          ))}
        </ol>
        <div className="chess-eval">
          <span>Material</span>
          <div className="chess-bar"><i style={{ transform: `scaleX(${0.5 + Math.max(-0.5, Math.min(0.5, material / 30))})` }} /></div>
          <b>{material > 0 ? `+${material}` : material}</b>
        </div>
      </div>
    </div>
  )
}
