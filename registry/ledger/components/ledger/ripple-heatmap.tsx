"use client"

import * as React from "react"
import { animate, stagger } from "animejs"

import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/registry/ledger/hooks/use-reduced-motion"

const STAGGER_MS = 26
const SHRINK_MS = 180
const RETURN_MS = 700
const SHRUNK_SCALE = 0.25

/** The next cell for an arrow key, Home or End, staying inside the grid. */
export function moveCell(index: number, key: string, cols: number, rows: number) {
  const column = index % cols
  const row = Math.floor(index / cols)
  const moves: Record<string, number> = {
    ArrowLeft: row * cols + Math.max(0, column - 1),
    ArrowRight: row * cols + Math.min(cols - 1, column + 1),
    ArrowUp: Math.max(0, row - 1) * cols + column,
    ArrowDown: Math.min(rows - 1, row + 1) * cols + column,
    Home: row * cols,
    End: row * cols + cols - 1,
  }
  return moves[key]
}

export type HeatCell = { index: number; column: number; row: number; value: number }

type RippleHeatmapProps = {
  /** One value from 0 to 1 per cell, row by row. */
  values: number[]
  /** Describes the grid for screen readers. */
  label: string
  cols?: number
  /** One label per row, printed at the left. */
  rowLabels: string[]
  /** Names a cell for screen readers. */
  cellLabel?: (cell: HeatCell) => string
  /** Runs when a cell is pressed. */
  onPick?: (cell: HeatCell) => void
  className?: string
}

export function RippleHeatmap({
  values,
  label,
  cols = 24,
  rowLabels,
  cellLabel,
  onPick,
  className,
}: RippleHeatmapProps) {
  const reduced = useReducedMotion()
  const grid = React.useRef<HTMLDivElement>(null)
  const [focusIndex, setFocusIndex] = React.useState(0)
  const [picked, setPicked] = React.useState<number | null>(null)
  const rows = rowLabels.length

  const cellAt = (index: number): HeatCell => ({
    index,
    column: index % cols,
    row: Math.floor(index / cols),
    value: values[index] ?? 0,
  })

  const pick = (index: number) => {
    setPicked(index)
    setFocusIndex(index)
    onPick?.(cellAt(index))
    const cells = grid.current?.querySelectorAll("[data-cell]")
    if (!cells || reduced) return
    animate(cells, {
      scale: [
        { to: SHRUNK_SCALE, duration: SHRINK_MS, ease: "outSine" },
        { to: 1, duration: RETURN_MS, ease: "outElastic(1, .55)" },
      ],
      delay: stagger(STAGGER_MS, { grid: [cols, rows], from: index }),
    })
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const next = moveCell(focusIndex, event.key, cols, rows)
    if (next === undefined) return
    event.preventDefault()
    setFocusIndex(next)
    grid.current?.querySelector<HTMLElement>(`[data-cell="${next}"]`)?.focus()
  }

  return (
    <div
      ref={grid}
      role="grid"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn("grid items-center gap-[3px] overflow-x-auto", className)}
      style={{ gridTemplateColumns: `auto repeat(${cols}, minmax(12px, 1fr))` }}
    >
      {rowLabels.map((rowLabel, row) => (
        <div key={rowLabel} role="row" className="contents">
          <span role="rowheader" className="ledger-label pr-1.5 text-[10px]">
            {rowLabel}
          </span>
          {Array.from({ length: cols }, (_, column) => {
            const index = row * cols + column
            const cell = cellAt(index)
            return (
              <button
                key={index}
                type="button"
                role="gridcell"
                data-cell={index}
                aria-label={cellLabel?.(cell) ?? `${rowLabel}, column ${column + 1}`}
                aria-selected={picked === index}
                tabIndex={focusIndex === index ? 0 : -1}
                onClick={() => pick(index)}
                className={cn(
                  "ledger-focus aspect-square min-w-3 cursor-pointer",
                  picked === index && "outline-ink outline-2 outline-offset-1",
                )}
                style={{ background: `color-mix(in srgb, var(--accent-ink) ${Math.round(cell.value * 100)}%, var(--wash))` }}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
