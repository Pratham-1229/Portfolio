"use client"

import { useEffect, useId, useRef } from "react"
import type { Transition } from "motion/react"
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

import { metalClickSound } from "@/lib/soundcn/metal-click"
import { cn } from "@/lib/utils"
import { useSound } from "@/hooks/soundcn/use-sound"

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 18,
  stiffness: 200,
}

// ---------------------------------------------------------------------
// Isometric letter geometry generator
//
// Each letter is a pixel bitmap (1 = filled cell), projected onto true
// 30deg isometric axes: the "col" axis ascends (up-right), the "row"
// axis descends (down-right). That's what makes a multi-letter mark
// read as rising from bottom-left toward top-right — a top-down
// floor-grid projection (both axes moving downward) reads the wrong
// way, ending bottom-right instead.
//
// The boundary walk (extractEdges) keeps only edges bordering an empty
// neighbor, which automatically yields both the outer silhouette and
// any interior holes (e.g. P's counter) with no extra logic. Side
// walls are one quad per boundary edge, extruded straight down (world
// Z always projects to pure vertical, independent of the ground-plane
// axis convention above).
// ---------------------------------------------------------------------

const TILE_W = 110.86 // projected width of one grid cell
const TILE_H = 64 // projected height of one grid cell
const HALF_W = TILE_W / 2
const HALF_H = TILE_H / 2
const EXTRUDE = 32 // vertical "thickness" of the extrusion

type Pt = [number, number]

function project(col: number, row: number): Pt {
  return [(col + row) * HALF_W, (row - col) * HALF_H]
}

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
    const first = remaining.shift()!
    const [start, nextInit] = first
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
  return n.toFixed(2)
}

function loopsToPath(loops: Pt[][], offsetCol: number, dy = 0): string {
  return loops
    .map((loop) => {
      const pts = loop.map(([c, r]) => {
        const [x, y] = project(c + offsetCol, r)
        return [x, y + dy] as Pt
      })
      const [s, ...rest] = pts
      return `M${fmt(s[0])} ${fmt(s[1])} ${rest
        .map((p) => `L${fmt(p[0])} ${fmt(p[1])}`)
        .join(" ")} Z`
    })
    .join(" ")
}

function wallPath(edges: [Pt, Pt][], offsetCol: number): string {
  return edges
    .map(([p1, p2]) => {
      const a = project(p1[0] + offsetCol, p1[1])
      const b = project(p2[0] + offsetCol, p2[1])
      const a2: Pt = [a[0], a[1] + EXTRUDE]
      const b2: Pt = [b[0], b[1] + EXTRUDE]
      return `M${fmt(a[0])} ${fmt(a[1])} L${fmt(b[0])} ${fmt(b[1])} L${fmt(
        b2[0]
      )} ${fmt(b2[1])} L${fmt(a2[0])} ${fmt(a2[1])} Z`
    })
    .join(" ")
}

function tickPath(edges: [Pt, Pt][], offsetCol: number): string {
  const seen = new Set<string>()
  let d = ""
  for (const [p1, p2] of edges) {
    for (const p of [p1, p2]) {
      const key = `${p[0]},${p[1]}`
      if (seen.has(key)) continue
      seen.add(key)
      const [x, y] = project(p[0] + offsetCol, p[1])
      d += `M${fmt(x)} ${fmt(y)} L${fmt(x)} ${fmt(y + EXTRUDE)} `
    }
  }
  return d.trim()
}

// 6x8 bold bitmaps — thicker (2-cell) strokes and tighter letter
// spacing than a thin 1-cell pixel font, closer to the reference
// mark's chunky, mostly-solid letterforms. Edit freely — the generator
// handles any shape, including P's enclosed hole (the counter).
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

const K_OFFSET_COL = 7 // P is 6 cols wide + 1 col gap — tighter than before

function buildLetter(bitmap: number[][], offsetCol: number) {
  const edges = extractEdges(bitmap)
  const loops = chainLoops(edges)
  return {
    face: loopsToPath(loops, offsetCol),
    wall: wallPath(edges, offsetCol),
    rim: loopsToPath(loops, offsetCol, EXTRUDE),
    ticks: tickPath(edges, offsetCol),
  }
}

const P_GEO = buildLetter(P_BITMAP, 0)
const K_GEO = buildLetter(K_BITMAP, K_OFFSET_COL)

function centroid(bitmap: number[][], offsetCol: number): Pt {
  return project(offsetCol + bitmap[0].length / 2, bitmap.length / 2)
}

function computeBounds() {
  const sources: [number[][], number][] = [
    [P_BITMAP, 0],
    [K_BITMAP, K_OFFSET_COL],
  ]
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const [bitmap, offset] of sources) {
    for (let r = 0; r <= bitmap.length; r++) {
      for (let c = 0; c <= bitmap[0].length; c++) {
        const [x, y] = project(c + offset, r)
        minX = Math.min(minX, x)
        maxX = Math.max(maxX, x)
        minY = Math.min(minY, y)
        maxY = Math.max(maxY, y + EXTRUDE)
      }
    }
  }

  const margin = 32
  return {
    x: minX - margin,
    y: minY - margin,
    width: maxX - minX + margin * 2,
    height: maxY - minY + margin * 2,
  }
}

const BOUNDS = computeBounds()
const P_CENTER = centroid(P_BITMAP, 0)
const K_CENTER = centroid(K_BITMAP, K_OFFSET_COL)
const MID_CENTER: Pt = [
  (P_CENTER[0] + K_CENTER[0]) / 2,
  (P_CENTER[1] + K_CENTER[1]) / 2,
]

// Dashed background axis guide lines — matching the original mark's
// faint x/y isometric axis indicators, along the same two true-30deg
// directions used by project() above. These deliberately extend WAY
// beyond the mark's own bounding box — combined with the svg's
// overflow-visible, they bleed into the surrounding banner/container
// rather than stopping at the letters' edges, matching the original.
const ASCEND_DIR: Pt = [HALF_W / TILE_H, -HALF_H / TILE_H]
const DESCEND_DIR: Pt = [HALF_W / TILE_H, HALF_H / TILE_H]
const GUIDE_LEN = Math.max(BOUNDS.width, BOUNDS.height) * 6

function axisLine(center: Pt, dir: Pt, length: number): string {
  const x1 = center[0] - dir[0] * length
  const y1 = center[1] - dir[1] * length
  const x2 = center[0] + dir[0] * length
  const y2 = center[1] + dir[1] * length
  return `M${fmt(x1)} ${fmt(y1)} L${fmt(x2)} ${fmt(y2)}`
}

const GUIDE_LINES = [
  axisLine(MID_CENTER, ASCEND_DIR, GUIDE_LEN),
  axisLine(P_CENTER, DESCEND_DIR, GUIDE_LEN),
  axisLine(K_CENTER, DESCEND_DIR, GUIDE_LEN),
]

export function ChanhDaiMarkIsometric({ className }: { className?: string }) {
  const id = useId()
  const ids = {
    facePattern: `pk-face-pattern-${id}`,
    radialGradient: `pk-radial-gradient-${id}`,
  }

  const ref = useRef<SVGSVGElement>(null)
  const [play] = useSound(metalClickSound)

  const shouldReduceMotion = useReducedMotion()
  const isInView = useInView(ref, { margin: "80px" })

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const cx = useSpring(
    useTransform(mouseX, [0, 1], [BOUNDS.x, BOUNDS.x + BOUNDS.width]),
    { stiffness: 300, damping: 30, mass: 0.1 }
  )
  const cy = useSpring(
    useTransform(mouseY, [0, 1], [BOUNDS.y, BOUNDS.y + BOUNDS.height]),
    { stiffness: 300, damping: 30, mass: 0.1 }
  )

  useEffect(() => {
    if (shouldReduceMotion || !isInView) return
    if (window.matchMedia("(hover: none)").matches) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [shouldReduceMotion, isInView, mouseX, mouseY])

  return (
    <motion.svg
      ref={ref}
      className={cn(
        "h-auto w-full touch-manipulation overflow-visible select-none [--axis:color-mix(in_oklab,var(--foreground)_24%,var(--background))] [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))]",
        className
      )}
      viewBox={`${BOUNDS.x} ${BOUNDS.y} ${BOUNDS.width} ${BOUNDS.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      initial="normal"
      whileTap="pressed"
      onTap={() => play()}
    >
      <defs>
        <pattern
          id={ids.facePattern}
          x="0"
          y="0"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M-1 1l2 -2M0 10l10 -10M9 11l2 -2"
            stroke="var(--pattern)"
            strokeWidth="1"
          />
        </pattern>

        <motion.radialGradient
          id={ids.radialGradient}
          cx={cx}
          cy={cy}
          r="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop
            className="dark:[stop-color:#fff]"
            stopColor="var(--color-zinc-700)"
          />
          <stop
            className="dark:[stop-color:var(--color-zinc-600)]"
            offset="1"
            stopColor="var(--color-zinc-400)"
            stopOpacity="0"
          />
        </motion.radialGradient>
      </defs>

      {/* Background axis guide lines — decorative, drawn first so
          everything else paints over them. Deliberately unclipped: they
          extend far beyond the letters and rely on overflow-visible
          (plus the parent container not clipping) to bleed into the
          wider banner, matching the reference mark. */}
      <g stroke="var(--axis)" strokeWidth="1" strokeDasharray="4 2">
        {GUIDE_LINES.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* Static walls + bottom rim + corner ticks. These never move —
          see the note on the top-face group below for why that's fine. */}
      <g className="fill-background">
        <path d={P_GEO.wall} />
        <path d={K_GEO.wall} />
      </g>
      <g stroke="var(--stroke)" strokeWidth="1">
        <path d={P_GEO.rim} fill="none" />
        <path d={K_GEO.rim} fill="none" />
        <path d={P_GEO.ticks} fill="none" />
        <path d={K_GEO.ticks} fill="none" />
      </g>
      <g stroke={`url(#${ids.radialGradient})`} strokeWidth="1">
        <path d={P_GEO.rim} fill="none" />
        <path d={K_GEO.rim} fill="none" />
      </g>

      {/* Top faces. This is the ONLY group that animates on press — it
          translates down by 16px, which naturally covers more of the
          static walls above and produces the "pushed in" look without
          needing a second hand-computed "pressed" wall shape. */}
      <motion.g
        variants={{ normal: { y: 0 }, pressed: { y: 16 } }}
        transition={transition}
      >
        <g fillRule="evenodd" clipRule="evenodd">
          <g className="fill-background">
            <path d={P_GEO.face} />
            <path d={K_GEO.face} />
          </g>
          <g fill={`url(#${ids.facePattern})`}>
            <path d={P_GEO.face} />
            <path d={K_GEO.face} />
          </g>
        </g>
        <g stroke="var(--stroke)" strokeWidth="1">
          <path d={P_GEO.face} fill="none" fillRule="evenodd" />
          <path d={K_GEO.face} fill="none" fillRule="evenodd" />
        </g>
        <g stroke={`url(#${ids.radialGradient})`} strokeWidth="1">
          <path d={P_GEO.face} fill="none" fillRule="evenodd" />
          <path d={K_GEO.face} fill="none" fillRule="evenodd" />
        </g>
      </motion.g>
    </motion.svg>
  )
}
