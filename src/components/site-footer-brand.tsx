"use client"

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

const CELL = 32

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

function loopsToPath(loops: Pt[][], offsetCol: number): string {
  return loops
    .map((loop) => {
      const pts = loop.map(
        ([c, r]) => [1 + (c + offsetCol) * CELL, 1 + r * CELL] as Pt
      )
      const [s, ...rest] = pts
      return `M${Math.round(s[0])} ${Math.round(s[1])} ${rest
        .map((p) => `L${Math.round(p[0])} ${Math.round(p[1])}`)
        .join(" ")} Z`
    })
    .join(" ")
}

// 8-row bitmap glyphs matching chanhdai's geometric pixel-letter style.
// Row 0-1: ascenders (P, t, h)
// Row 2: x-height top
// Row 7: baseline (sitting at y = 257)
const GLYPHS: Record<string, number[][]> = {
  P: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
  ],
  r: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  a: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 1, 1],
    [0, 1, 1, 0, 1],
  ],
  t: [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [1, 1, 1, 1],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 1],
    [0, 0, 1, 1],
  ],
  h: [
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  m: [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 1],
  ],
  e: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  s: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
}

function generateWordmarkPath(word: string) {
  let col = 0
  const pathParts: string[] = []

  for (let i = 0; i < word.length; i++) {
    const char = word[i]
    const bm = GLYPHS[char]
    if (!bm) continue
    const edges = extractEdges(bm)
    const loops = chainLoops(edges)
    pathParts.push(loopsToPath(loops, col))
    col += bm[0].length + 1
  }

  const totalCols = col - 1
  const viewWidth = totalCols * CELL + 2
  return { path: pathParts.join(" "), viewWidth }
}

const WORD = "Prathamesh"
const { path: PRATHAMESH_PATH, viewWidth: VIEWBOX_WIDTH } =
  generateWordmarkPath(WORD)
const VIEWBOX_HEIGHT = 258

export function SiteFooterInteractiveLogotype() {
  const shouldReduceMotion = useReducedMotion()

  const gradientX1Raw = useMotionValue(0.5)
  const gradientX1 = useSpring(
    useTransform(gradientX1Raw, [0, 1], [0, VIEWBOX_WIDTH]),
    {
      stiffness: 150,
      damping: 25,
    }
  )

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return

    const containerRect = event.currentTarget.getBoundingClientRect()
    gradientX1Raw.set(
      (event.clientX - containerRect.left) / containerRect.width
    )
  }

  const handleMouseLeave = () => {
    if (shouldReduceMotion) return
    gradientX1Raw.set(0.5)
  }

  return (
    <div className="screen-line-bottom after:z-1 after:bg-foreground/15">
      <div
        className="overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex w-full translate-y-[37.5%] items-center justify-center">
          <svg
            className="container size-full"
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d={PRATHAMESH_PATH}
              fill="url(#paint0_linear_prathamesh)"
            />
            <path
              className="stroke-foreground/10"
              d={PRATHAMESH_PATH}
              strokeWidth="2"
              fill="none"
            />
            <defs>
              <motion.linearGradient
                id="paint0_linear_prathamesh"
                x1={gradientX1}
                y1="1"
                x2={VIEWBOX_WIDTH / 2}
                y2="257"
                gradientUnits="userSpaceOnUse"
              >
                <stop
                  offset="0.625"
                  stopColor="var(--foreground)"
                  stopOpacity="0"
                />
                <stop offset="1" stopColor="var(--foreground)" />
              </motion.linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-1/2 hidden h-px w-[50%] max-w-full -translate-x-1/2 dark:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0) 0%, rgba(228, 228, 231, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
        }}
        aria-hidden
      />
    </div>
  )
}
