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

import { cn } from "@/lib/utils"
import { metalClickSound } from "@/lib/soundcn/metal-click"
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
// Each letter is defined as a simple pixel bitmap (1 = filled cell).
// The generator projects that bitmap onto a true isometric grid,
// extracts its boundary (outer silhouette AND any interior holes, e.g.
// the counter of "P") via a marching-squares-style edge walk, and
// builds path layers from it: a top face (evenodd fill handles holes
// automatically), side walls (one quad per boundary edge), and a
// stroke outline (top rim + bottom rim + corner ticks).
//
// This replaces hand-authored path coordinates — fragile and easy to
// get subtly (or completely) wrong — with geometry that is correct by
// construction for any bitmap you give it. Edit the bitmaps below to
// change the letterforms; nothing else needs to change.
// ---------------------------------------------------------------------

const TILE_W = 110.86 // projected width of one grid cell
const TILE_H = 64 // projected height of one grid cell
const EXTRUDE = 32 // vertical "thickness" of the extrusion

type Pt = [number, number]

function project(col: number, row: number): Pt {
  return [(col - row) * (TILE_W / 2), (col + row) * (TILE_H / 2)]
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
      if (!filled(r - 1, c)) edges.push([[c, r], [c + 1, r]])
      if (!filled(r, c + 1)) edges.push([[c + 1, r], [c + 1, r + 1]])
      if (!filled(r + 1, c)) edges.push([[c + 1, r + 1], [c, r + 1]])
      if (!filled(r, c - 1)) edges.push([[c, r + 1], [c, r]])
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

// 5x7 blocky bitmaps. 1 = filled. Edit freely — the generator handles
// any shape, including P's enclosed hole (the counter). Make them
// chunkier/taller if you want a bolder mark; just keep them roughly
// the same width so P and K feel balanced side by side.
const P_BITMAP = [
  [1, 1, 1, 1],
  [1, 0, 0, 1],
  [1, 0, 0, 1],
  [1, 1, 1, 1],
  [1, 0, 0, 0],
  [1, 0, 0, 0],
  [1, 0, 0, 0],
]

const K_BITMAP = [
  [1, 0, 0, 0, 1],
  [1, 0, 0, 1, 0],
  [1, 0, 1, 0, 0],
  [1, 1, 0, 0, 0],
  [1, 0, 1, 0, 0],
  [1, 0, 0, 1, 0],
  [1, 0, 0, 0, 1],
]

const K_OFFSET_COL = 5 // P is 4 cols wide + 1 col gap

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

// Computed once at module load — this is static geometry, no need to
// recompute per render.
const P_GEO = buildLetter(P_BITMAP, 0)
const K_GEO = buildLetter(K_BITMAP, K_OFFSET_COL)

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

  const margin = 24
  return {
    x: minX - margin,
    y: minY - margin,
    width: maxX - minX + margin * 2,
    height: maxY - minY + margin * 2,
  }
}

const BOUNDS = computeBounds()

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
        "h-auto w-full touch-manipulation overflow-visible select-none [--pattern:color-mix(in_oklab,var(--foreground)_12%,var(--background))] [--stroke:color-mix(in_oklab,var(--foreground)_16%,var(--background))]",
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
