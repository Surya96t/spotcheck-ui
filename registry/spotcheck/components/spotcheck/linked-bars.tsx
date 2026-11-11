"use client"

import * as React from "react"
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber"
import { BoxGeometry, Color, type InstancedMesh, MeshLambertMaterial, Object3D } from "three"

import { GlStage } from "@/registry/spotcheck/components/spotcheck/gl-stage"
import { useGlPalette } from "@/registry/spotcheck/hooks/use-gl-palette"
import { useReducedMotion } from "@/registry/spotcheck/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

const SPACING = 0.9
const BAR_WIDTH = 0.7
const MAX_HEIGHT = 3.1
const RAISED = 1.12
const DIMMED = 0.45
const HEIGHT_EASE = 0.12
const SETTLED = 0.001
const TIP_OFFSET = 12
// Below this width-to-height ratio the camera zooms out so the bars stay inside the canvas.
const FIT_ASPECT = 1.55
const PALETTE_TOKENS = ["--ink", "--wash", "--accent-ink"] as const
const CAMERA = { fov: 30, position: [8.5, 8, 10], near: 0.1, far: 100 } as const
const LOOK_AT: [number, number, number] = [0, 0.9, 0]

type Palette = Record<(typeof PALETTE_TOKENS)[number], string>
type Tip = { row: number; column: number; x: number; y: number }

/** How tall a bar should stand, given which row is highlighted. */
export function barHeight(value: number, largest: number, row: number, highlight: number | null) {
  const height = largest > 0 ? (value / largest) * MAX_HEIGHT : 0
  if (highlight === null) return height
  return height * (row === highlight ? RAISED : DIMMED)
}

/** Splits an instance id into the row and column of its bar. */
export function barAt(instanceId: number, columns: number) {
  return { row: Math.floor(instanceId / columns), column: instanceId % columns }
}

type BarsProps = {
  values: number[][]
  highlight: number | null
  still: boolean
  palette: Palette | null
  onBarMove: (bar: ThreeEvent<PointerEvent>) => void
  onBarLeave: () => void
  onBarTap: (bar: ThreeEvent<MouseEvent>) => void
}

function Bars({ values, highlight, still, palette, onBarMove, onBarLeave, onBarTap }: BarsProps) {
  const rows = values.length
  const columns = values[0]?.length ?? 0
  const count = rows * columns
  const largest = Math.max(0, ...values.flat())
  const mesh = React.useRef<InstancedMesh>(null)
  const invalidate = useThree((state) => state.invalidate)
  const camera = useThree((state) => state.camera)
  const aspect = useThree((state) => state.viewport.aspect)

  const [geometry, material, floor, floorMaterial] = React.useMemo(() => {
    const box = new BoxGeometry(SPACING * BAR_WIDTH, 1, SPACING * BAR_WIDTH)
    box.translate(0, 0.5, 0)
    return [box, new MeshLambertMaterial({ color: 0xffffff }), new BoxGeometry(1, 0.04, 1), new MeshLambertMaterial()] as const
  }, [])

  const scratch = React.useMemo(
    () => ({
      heights: new Float32Array(count),
      dummy: new Object3D(),
      color: new Color(),
      ink: new Color(),
      accent: new Color(),
      wash: new Color(),
    }),
    [count],
  )

  React.useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
      floor.dispose()
      floorMaterial.dispose()
    }
  }, [floor, floorMaterial, geometry, material])

  React.useEffect(() => {
    if (!palette) return
    scratch.ink.set(palette["--ink"])
    scratch.accent.set(palette["--accent-ink"])
    scratch.wash.set(palette["--wash"])
    floorMaterial.color.set(palette["--wash"])
    invalidate()
  }, [floorMaterial, invalidate, palette, scratch])

  React.useEffect(() => invalidate(), [highlight, invalidate, values])

  React.useLayoutEffect(() => {
    camera.zoom = Math.min(1, aspect / FIT_ASPECT)
    camera.updateProjectionMatrix()
    invalidate()
  }, [aspect, camera, invalidate])

  useFrame(() => {
    const bars = mesh.current
    if (!bars) return
    const { heights, dummy, color, ink, accent, wash } = scratch
    let moving = false

    for (let row = 0, index = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++, index++) {
        const value = values[row]?.[column] ?? 0
        const target = barHeight(value, largest, row, highlight)
        const current = heights[index] ?? 0
        const next = still || Math.abs(target - current) < SETTLED ? target : current + (target - current) * HEIGHT_EASE
        if (next !== target) moving = true
        heights[index] = next

        dummy.position.set((column - (columns - 1) / 2) * SPACING, 0, (row - (rows - 1) / 2) * SPACING)
        dummy.scale.set(1, Math.max(0.01, next), 1)
        dummy.updateMatrix()
        bars.setMatrixAt(index, dummy.matrix)

        color.copy(wash).lerp(ink, 0.35 + (largest > 0 ? value / largest : 0) * 0.65)
        if (row === highlight) color.copy(accent)
        else if (highlight !== null) color.lerp(wash, 0.6)
        bars.setColorAt(index, color)
      }
    }
    bars.instanceMatrix.needsUpdate = true
    if (bars.instanceColor) bars.instanceColor.needsUpdate = true
    // Raycasts test this sphere first, so it has to follow the bars as they grow.
    bars.computeBoundingSphere()
    if (moving) invalidate()
  })

  return (
    <>
      <hemisphereLight args={[0xffffff, 0x666666, 1.25]} />
      <directionalLight position={[-4, 9, 5]} intensity={1.2} />
      <mesh
        geometry={floor}
        material={floorMaterial}
        position={[0, -0.03, 0]}
        scale={[columns * SPACING + 0.4, 1, rows * SPACING + 0.4]}
      />
      <instancedMesh
        key={count}
        ref={mesh}
        args={[geometry, material, count]}
        frustumCulled={false}
        onPointerMove={onBarMove}
        onPointerOut={onBarLeave}
        onClick={onBarTap}
      />
    </>
  )
}

type LinkedBarsProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Row names, in the same order as `values`. */
  rows: string[]
  /** Column names, in the same order as each row of `values`. */
  columns: string[]
  /** One array per row, holding one number per column. */
  values: number[][]
  /** Printed above the table, and names it for screen readers. */
  title: string
  /** Describes the chart for screen readers. */
  label?: string
  /** The highlighted row, when you control it. Use `null` for no highlight. */
  highlight?: number | null
  /** Runs when the highlighted row changes. */
  onHighlightChange?: (row: number | null) => void
  /** Formats each value. Pass it from a client component. */
  format?: (value: number) => string
}

export function LinkedBars({
  rows,
  columns,
  values,
  title,
  label = "3D bar chart of the table's values",
  highlight,
  onHighlightChange,
  format = (value) => String(value),
  className,
  ...props
}: LinkedBarsProps) {
  const host = React.useRef<HTMLDivElement>(null)
  const frame = React.useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const palette = useGlPalette(host, PALETTE_TOKENS)
  const titleId = React.useId()

  // Hover and focus come and go, while a tap stays until it's cleared.
  const [hovered, setHovered] = React.useState<number | null>(null)
  const [pinned, setPinned] = React.useState<number | null>(null)
  const [tip, setTip] = React.useState<Tip | null>(null)
  const own = hovered ?? pinned
  const active = highlight !== undefined ? highlight : own

  const reported = React.useRef(own)
  React.useEffect(() => {
    if (reported.current !== own) onHighlightChange?.(own)
    reported.current = own
  }, [onHighlightChange, own])

  const tipFrom = (event: ThreeEvent<PointerEvent | MouseEvent>) => {
    const box = frame.current?.getBoundingClientRect()
    if (!box || event.instanceId === undefined) return null
    const clamp = Math.min(event.nativeEvent.clientX - box.left + TIP_OFFSET, box.width / 2)
    return { ...barAt(event.instanceId, columns.length), x: clamp, y: event.nativeEvent.clientY - box.top - TIP_OFFSET }
  }

  const onBarMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    if (event.nativeEvent.pointerType !== "mouse") return
    const next = tipFrom(event)
    if (!next) return
    setTip(next)
    setHovered(next.row)
  }

  const onBarLeave = () => {
    setHovered(null)
    setTip((current) => (pinned === null ? null : current))
  }

  const onBarTap = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    const next = tipFrom(event)
    if (!next) return
    setPinned(next.row)
    setTip(next)
  }

  const clearPin = () => {
    setPinned(null)
    setTip(null)
  }

  return (
    <div
      className={cn(
        "border-ink grid min-w-0 border-(length:--rule) font-(family-name:--f-body) md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]",
        className,
      )}
      {...props}
    >
      <div
        tabIndex={0}
        role="region"
        aria-labelledby={titleId}
        className="spotcheck-focus border-ink order-2 min-w-0 overflow-x-auto border-t-(length:--rule) -outline-offset-2 md:order-1 md:border-t-0 md:border-r-(length:--rule)"
      >
        <table className="w-full border-collapse font-(family-name:--f-mono) text-[11.5px] tabular-nums">
          <caption id={titleId} className="spotcheck-label px-2.5 pt-2.5 pb-1.5 text-left">
            {title}
          </caption>
          <thead>
            <tr className="border-ink border-b-(length:--rule)">
              <th scope="col" className="spotcheck-label bg-raise sticky left-0 px-2.5 py-1.5 text-left font-normal">
                <span className="sr-only">Row</span>
              </th>
              {columns.map((column) => (
                <th key={column} scope="col" className="spotcheck-label px-1.5 py-1.5 text-right font-normal">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={row}
                data-active={active === index || undefined}
                className="data-active:bg-ink data-active:text-paper border-b border-[color-mix(in_srgb,var(--ink)_18%,transparent)]"
                onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(index)}
                onPointerLeave={(event) => event.pointerType === "mouse" && setHovered(null)}
              >
                <th scope="row" className="bg-raise sticky left-0 p-0 text-left in-data-active:bg-ink">
                  <button
                    type="button"
                    aria-pressed={pinned === index}
                    className="spotcheck-heading w-full cursor-pointer px-2.5 py-2 text-left text-[15px] leading-none outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--accent-ink)"
                    onFocus={(event) => event.currentTarget.matches(":focus-visible") && setHovered(index)}
                    onBlur={() => setHovered(null)}
                    onClick={() => {
                      setPinned(pinned === index ? null : index)
                      setTip(null)
                    }}
                  >
                    {row}
                  </button>
                </th>
                {columns.map((column, cell) => (
                  <td
                    key={column}
                    data-cell={tip?.row === index && tip.column === cell ? "" : undefined}
                    className="data-cell:text-accent-on-ink px-1.5 py-2 text-right"
                  >
                    {format(values[index]?.[cell] ?? 0)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div ref={frame} className="relative order-1 min-w-0 md:order-2">
        <GlStage
          ref={host}
          data-testid="linked-bars-chart"
          label={label}
          animate={false}
          camera={CAMERA}
          lookAt={LOOK_AT}
          className="h-75 md:h-full md:min-h-90"
          onPointerMissed={clearPin}
        >
          <Bars
            values={values}
            highlight={active}
            still={reduced}
            palette={palette}
            onBarMove={onBarMove}
            onBarLeave={onBarLeave}
            onBarTap={onBarTap}
          />
        </GlStage>
        {tip && (
          <div
            aria-hidden
            data-testid="linked-bars-tip"
            className="bg-ink text-paper pointer-events-none absolute z-10 px-2 py-1 font-(family-name:--f-mono) text-[11.5px] whitespace-nowrap"
            style={{ left: tip.x, top: tip.y }}
          >
            {rows[tip.row]} · {columns[tip.column]} · {format(values[tip.row]?.[tip.column] ?? 0)}
          </div>
        )}
      </div>
    </div>
  )
}
