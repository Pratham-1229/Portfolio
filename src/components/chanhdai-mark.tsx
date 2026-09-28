import type { ComponentProps } from "react"

// ---------------------------------------------------------------------
// Flat header mark — same P/K bitmaps as the isometric banner mark
// (chanhdai-mark-isometric.tsx), so both marks depict the same
// letterforms, just rendered differently (flat vs. extruded 3D).
//
// Uses the same boundary-extraction technique: define each letter as a
// pixel bitmap, walk it to find edges bordering an empty neighbor (this
// automatically produces both the outer silhouette and P's enclosed
// hole/counter with no extra logic), then emit a single evenodd path.
//
// This replaces a hand-authored path where the K's diagonal arms were
// connected by a big rectangular "waist" block instead of converging to
// a point — which is what made it read as a blob instead of a K.
// ---------------------------------------------------------------------

const CELL = 64

type Pt = [number, number]

function extractEdges(bitmap: number[][]): [Pt, Pt][] {
  const rows = bitmap.length
  const cols = bitmap[0]?.length ?? 0
  const filled = (r: number, c: number) =>
    r >= 0 && r < rows && c >= 0 && c < cols && bitmap[r][c] === 1

  const edges: [Pt, Pt][] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!filled(r, c)) continue
      if (!filled(r - 1, c))
        edges.push([
          [c, r],
          [c + 1, r],
        ])
      if (!filled(r, c + 1))
        edges.push([
          [c + 1, r],
          [c + 1, r + 1],
        ])
      if (!filled(r + 1, c))
        edges.push([
          [c + 1, r + 1],
          [c, r + 1],
        ])
      if (!filled(r, c - 1))
        edges.push([
          [c, r + 1],
          [c, r],
        ])
    }
  }
  return edges
}

function chainLoops(edges: [Pt, Pt][]): Pt[][] {
  const remaining = edges.map((e) => [e[0], e[1]] as [Pt, Pt])
  const loops: Pt[][] = []

  while (remaining.length) {
    const loop: Pt[] = []
    const [start, nextInit] = remaining.shift()!
    let next = nextInit
    loop.push(start, next)

    while (true) {
      const idx = remaining.findIndex(
        ([a]) => a[0] === next[0] && a[1] === next[1]
      )
      if (idx === -1) break
      const [, n2] = remaining.splice(idx, 1)[0]
      next = n2
      if (next[0] === loop[0][0] && next[1] === loop[0][1]) break
      loop.push(next)
    }
    loops.push(loop)
  }

  return loops
}

function fmt(n: number) {
  return Math.round(n)
}

function loopsToPath(loops: Pt[][], offsetCol: number): string {
  return loops
    .map((loop) => {
      const pts = loop.map(([c, r]) => [(c + offsetCol) * CELL, r * CELL] as Pt)
      const [s, ...rest] = pts
      return `M${fmt(s[0])} ${fmt(s[1])} ${rest
        .map((p) => `L${fmt(p[0])} ${fmt(p[1])}`)
        .join(" ")} Z`
    })
    .join(" ")
}

// Same bitmaps as chanhdai-mark-isometric.tsx — bolder (2-cell) strokes
// and tighter spacing than a thin 1-cell pixel font. Edit here too if
// you change the letterforms, to keep both marks in sync.
const P_BITMAP = [
  [1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0],
]

const K_BITMAP = [
  [1, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 1, 1],
  [1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 0, 0],
  [1, 1, 1, 1, 0, 0],
  [1, 1, 0, 1, 1, 0],
  [1, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 1, 1],
]

const K_OFFSET_COL = 7

const P_PATH = loopsToPath(chainLoops(extractEdges(P_BITMAP)), 0)
const K_PATH = loopsToPath(chainLoops(extractEdges(K_BITMAP)), K_OFFSET_COL)
const PK_PATH = `${P_PATH} ${K_PATH}`

const VIEW_W = (K_OFFSET_COL + K_BITMAP[0].length) * CELL
const VIEW_H = Math.max(P_BITMAP.length, K_BITMAP.length) * CELL

export function ChanhDaiMark(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      aria-hidden
      {...props}
    >
      <path d={PK_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}

export function getMarkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 ${VIEW_W} ${VIEW_H}"><path d="${PK_PATH}" fill="currentColor" fill-rule="evenodd"/></svg>`
}
