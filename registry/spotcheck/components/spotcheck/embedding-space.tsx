"use client"

import * as React from "react"
import { invalidate as invalidateAll, useFrame, useThree } from "@react-three/fiber"
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  EdgesGeometry,
  type Group,
  LineBasicMaterial,
  type Mesh,
  MeshBasicMaterial,
  PointsMaterial,
  Vector3,
} from "three"

import { GlStage } from "@/registry/spotcheck/components/spotcheck/gl-stage"
import { useGlPalette } from "@/registry/spotcheck/hooks/use-gl-palette"
import { useOrbitDrag } from "@/registry/spotcheck/hooks/use-orbit-drag"
import { useReducedMotion } from "@/registry/spotcheck/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

const START_ANGLE = 0.5
const TILT = 0.12
const SPIN_PER_SECOND = 0.15
const MARKER_EASE = 0.08
const LINE_GROWTH = 0.035
const POINT_SIZE = 0.15
const HIT_SIZE = 0.2
const MARKER_SIZE = 0.24
const FRAME_SIZE = 9
const PALETTE_TOKENS = ["--ink", "--mute", "--accent-ink"] as const
const CAMERA = { fov: 42, position: [0, 1.5, 16], near: 0.1, far: 100 } as const
const LOOK_AT: [number, number, number] = [0, 0, 0]

type Palette = Record<(typeof PALETTE_TOKENS)[number], string>

export type EmbeddingVector = [x: number, y: number, z: number]
export type EmbeddingPoint = { id: string; position: EmbeddingVector; label: string }
export type EmbeddingNeighbour = { id: string; score: number }
export type EmbeddingQuery = {
  id: string
  label: string
  position: EmbeddingVector
  /** The closest chunks, best first. Each `id` is a point's id. */
  neighbours: EmbeddingNeighbour[]
}

/** Joins a query's neighbours to their points. Neighbours with no matching point are dropped. */
export function rankNeighbours(points: EmbeddingPoint[], query: EmbeddingQuery | undefined) {
  if (!query) return []
  const byId = new Map(points.map((point) => [point.id, point]))
  return query.neighbours.flatMap((neighbour) => {
    const point = byId.get(neighbour.id)
    return point ? [{ ...neighbour, point }] : []
  })
}

function positionAttribute(count: number) {
  return new BufferAttribute(new Float32Array(count * 3), 3)
}

type CloudProps = {
  points: EmbeddingPoint[]
  target: EmbeddingVector
  hits: EmbeddingPoint[]
  slots: number
  still: boolean
  palette: Palette | null
  rotation: React.RefObject<number>
  dragging: React.RefObject<boolean>
}

function Cloud({ points, target, hits, slots, still, palette, rotation, dragging }: CloudProps) {
  const group = React.useRef<Group>(null)
  const marker = React.useRef<Mesh>(null)
  const invalidate = useThree((state) => state.invalidate)

  const parts = React.useMemo(() => {
    const cloud = new BufferGeometry()
    const positions = new Float32Array(points.length * 3)
    points.forEach((point, index) => positions.set(point.position, index * 3))
    cloud.setAttribute("position", new BufferAttribute(positions, 3))

    const hitCloud = new BufferGeometry()
    hitCloud.setAttribute("position", positionAttribute(slots))
    const lines = new BufferGeometry()
    lines.setAttribute("position", positionAttribute(slots * 2))
    const frameBox = new BoxGeometry(FRAME_SIZE, FRAME_SIZE, FRAME_SIZE)
    return {
      cloud,
      hitCloud,
      lines,
      box: new BoxGeometry(MARKER_SIZE, MARKER_SIZE, MARKER_SIZE),
      frameEdges: new EdgesGeometry(frameBox),
      pointMaterial: new PointsMaterial({ size: POINT_SIZE, sizeAttenuation: true }),
      hitMaterial: new PointsMaterial({ size: HIT_SIZE, sizeAttenuation: true }),
      lineMaterial: new LineBasicMaterial({ transparent: true, opacity: 0.9 }),
      markerMaterial: new MeshBasicMaterial(),
      frameMaterial: new LineBasicMaterial({ transparent: true, opacity: 0.35 }),
    }
  }, [points, slots])

  const motion = React.useRef({ marker: new Vector3(), goal: new Vector3(), grow: 0, spin: 0 })

  React.useEffect(() => {
    return () => Object.values(parts).forEach((part) => part.dispose())
  }, [parts])

  React.useEffect(() => {
    if (!palette) return
    parts.pointMaterial.color.set(palette["--mute"])
    parts.frameMaterial.color.set(palette["--mute"])
    parts.hitMaterial.color.set(palette["--accent-ink"])
    parts.lineMaterial.color.set(palette["--accent-ink"])
    parts.markerMaterial.color.set(palette["--ink"])
    invalidate()
  }, [invalidate, palette, parts])

  React.useEffect(() => {
    const positions = parts.hitCloud.getAttribute("position") as BufferAttribute
    positions.array.fill(0)
    hits.forEach((hit, index) => positions.setXYZ(index, ...hit.position))
    positions.needsUpdate = true
    parts.hitCloud.setDrawRange(0, hits.length)
    parts.lines.setDrawRange(0, hits.length * 2)
    motion.current.goal.set(...target)
    motion.current.grow = 0
    invalidate()
  }, [hits, invalidate, parts, target])

  useFrame(({ clock }, delta) => {
    if (!group.current || !marker.current) return
    const state = motion.current
    if (!still && !dragging.current) state.spin += delta * SPIN_PER_SECOND
    group.current.rotation.set(TILT, rotation.current + state.spin, 0)

    if (still) {
      state.marker.copy(state.goal)
      state.grow = 1
    } else {
      state.marker.lerp(state.goal, MARKER_EASE)
      state.grow = Math.min(1, state.grow + LINE_GROWTH)
      marker.current.rotation.set(clock.elapsedTime * 0.7, clock.elapsedTime * 0.9, 0)
    }
    marker.current.position.copy(state.marker)

    const lines = parts.lines.getAttribute("position") as BufferAttribute
    const { x, y, z } = state.marker
    hits.forEach((hit, index) => {
      const [hitX, hitY, hitZ] = hit.position
      lines.setXYZ(index * 2, x, y, z)
      lines.setXYZ(index * 2 + 1, x + (hitX - x) * state.grow, y + (hitY - y) * state.grow, z + (hitZ - z) * state.grow)
    })
    lines.needsUpdate = true
  })

  return (
    <group ref={group}>
      <points geometry={parts.cloud} material={parts.pointMaterial} />
      <points geometry={parts.hitCloud} material={parts.hitMaterial} frustumCulled={false} />
      <lineSegments geometry={parts.lines} material={parts.lineMaterial} frustumCulled={false} />
      <lineSegments geometry={parts.frameEdges} material={parts.frameMaterial} />
      <mesh ref={marker} geometry={parts.box} material={parts.markerMaterial} />
    </group>
  )
}

type EmbeddingSpaceProps = Omit<React.ComponentProps<"div">, "children" | "defaultValue"> & {
  /** Every chunk, with a 3D position you've worked out. The component doesn't compute embeddings. */
  points: EmbeddingPoint[]
  /** The questions to choose from, each with its own position, neighbours and scores. */
  queries: EmbeddingQuery[]
  /** The chosen query's id, when you control it. */
  value?: string
  /** The starting query's id, when the component manages itself. */
  defaultValue?: string
  /** Runs when a different query is chosen. */
  onValueChange?: (value: string) => void
  /** Describes the cloud for screen readers. */
  label?: string
  /** Formats each score. Pass it from a client component. */
  formatScore?: (score: number) => string
}

export function EmbeddingSpace({
  points,
  queries,
  value,
  defaultValue,
  onValueChange,
  label = "Point cloud of document chunks",
  formatScore = (score) => score.toFixed(3),
  className,
  ...props
}: EmbeddingSpaceProps) {
  const host = React.useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const palette = useGlPalette(host, PALETTE_TOKENS)
  const { rotation, dragging, bind } = useOrbitDrag({ angle: START_ANGLE, onChange: () => invalidateAll() })
  const headingId = React.useId()

  const [internal, setInternal] = React.useState(defaultValue ?? queries[0]?.id)
  const current = value ?? internal
  const query = queries.find((candidate) => candidate.id === current)
  const ranked = React.useMemo(() => rankNeighbours(points, query), [points, query])
  const hits = React.useMemo(() => ranked.map((neighbour) => neighbour.point), [ranked])
  const slots = Math.max(1, ...queries.map((candidate) => candidate.neighbours.length))

  const choose = (id: string) => {
    setInternal(id)
    if (id !== current) onValueChange?.(id)
  }

  return (
    <div
      className={cn(
        "border-ink grid min-w-0 border-(length:--rule) font-(family-name:--f-body) md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]",
        className,
      )}
      {...props}
    >
      <GlStage
        ref={host}
        data-testid="embedding-space-cloud"
        label={label}
        camera={CAMERA}
        lookAt={LOOK_AT}
        className="border-ink h-75 cursor-grab border-b-(length:--rule) select-none active:cursor-grabbing md:h-auto md:min-h-95 md:border-r-(length:--rule) md:border-b-0"
        {...bind}
      >
        <Cloud
          points={points}
          target={query?.position ?? LOOK_AT}
          hits={hits}
          slots={slots}
          still={reduced}
          palette={palette}
          rotation={rotation}
          dragging={dragging}
        />
      </GlStage>

      <div className="flex min-w-0 flex-col gap-3 p-3.5">
        <div className="flex flex-col gap-1.5">
          <div className="spotcheck-label">Query</div>
          <div className="border-ink flex flex-col border-(length:--rule)">
            {queries.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                aria-pressed={candidate.id === current}
                className="spotcheck-focus aria-pressed:bg-ink aria-pressed:text-paper cursor-pointer border-[color-mix(in_srgb,var(--ink)_25%,transparent)] px-2.5 py-2 text-left text-sm -outline-offset-2 not-first:border-t"
                onClick={() => choose(candidate.id)}
              >
                {candidate.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-1.5">
          <div id={headingId} className="spotcheck-label">
            Top {ranked.length} neighbours
          </div>
          <ol aria-labelledby={headingId} className="font-(family-name:--f-mono) text-xs">
            {ranked.map((neighbour, index) => (
              <li
                key={neighbour.id}
                className="grid grid-cols-[1.6em_minmax(0,1fr)_auto] items-end gap-1.5 border-b border-[color-mix(in_srgb,var(--ink)_15%,transparent)] pt-1.5 pb-0.5"
              >
                <span aria-hidden className="text-mute tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="truncate">{neighbour.point.label}</span>
                <span className="text-accent-ink tabular-nums">{formatScore(neighbour.score)}</span>
              </li>
            ))}
          </ol>
        </div>

        <p role="status" className="sr-only">
          {query ? `Showing ${ranked.length} closest chunks for: ${query.label}` : ""}
        </p>
      </div>
    </div>
  )
}
