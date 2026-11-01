"use client"

import * as React from "react"
import { animate, type JSAnimation } from "animejs"

import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/registry/ledger/hooks/use-reduced-motion"

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-"
const FLIP_MS = 65
const COLUMN_STAGGER_MS = 22
const ROW_STAGGER_MS = 60
const MAX_EXTRA_SPINS = 4

export function padRow(row: string, width: number) {
  return row.padEnd(width).slice(0, width)
}

/** The cells that differ between two boards. */
export function changedCells(from: string[], to: string[]) {
  return to.flatMap((row, rowIndex) =>
    Array.from(row).flatMap((char, column) =>
      from[rowIndex]?.[column] === char ? [] : [{ row: rowIndex, column, char }],
    ),
  )
}

export type FlapColumn = { label: string; start: number }

type SplitFlapProps = {
  /** One string per row. Keep the number of rows the same between updates. */
  rows: string[]
  /** Characters per row. */
  width?: number
  /** Column headings, each starting at a character position. */
  columns?: FlapColumn[]
  /** How many characters at the end of each row take the accent. */
  accentCharacters?: number
  className?: string
}

export function SplitFlap({ rows, width = 22, columns = [], accentCharacters = 0, className }: SplitFlapProps) {
  const reduced = useReducedMotion()
  const board = rows.map((row) => padRow(row, width))
  const boardKey = board.join("\n")
  const [firstBoard] = React.useState(board)
  const shown = React.useRef(firstBoard)
  const cells = React.useRef(new Map<string, HTMLSpanElement>())
  const running = React.useRef<JSAnimation[]>([])

  React.useEffect(() => {
    const target = boardKey.split("\n")
    const from = shown.current
    shown.current = target

    running.current.forEach((animation) => animation.cancel())
    running.current = []
    for (const [key, cell] of cells.current) {
      const [row = 0, column = 0] = key.split(":").map(Number)
      cell.textContent = from[row]?.[column] ?? " "
      cell.style.transform = ""
    }

    for (const { row, column, char } of changedCells(from, target)) {
      const cell = cells.current.get(`${row}:${column}`)
      if (!cell) continue
      if (reduced) {
        cell.textContent = char
        continue
      }
      const spins = 1 + ((column + row) % MAX_EXTRA_SPINS)
      let flips = 0
      running.current.push(
        animate(cell, {
          rotateX: [0, -90],
          duration: FLIP_MS,
          ease: "inQuad",
          loop: spins * 2 + 1,
          alternate: true,
          delay: column * COLUMN_STAGGER_MS + row * ROW_STAGGER_MS,
          onLoop: () => {
            flips++
            cell.textContent = flips >= spins * 2 ? char : (GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? char)
          },
          onComplete: () => {
            cell.textContent = char
          },
        }),
      )
    }
  }, [boardKey, reduced])

  React.useEffect(() => () => running.current.forEach((animation) => animation.cancel()), [])

  const grid = { gridTemplateColumns: `repeat(${width}, 1.3em)` }

  return (
    <div
      className={cn(
        "bg-ink text-paper ledger-focus overflow-x-auto p-3 font-(family-name:--f-mono) text-[clamp(13px,1.8vw,19px)] font-semibold",
        className,
      )}
      tabIndex={0}
      role="region"
      aria-label="Departures board"
    >
      <ul className="sr-only">
        {board.map((row, index) => (
          <li key={index}>{row}</li>
        ))}
      </ul>
      <div aria-hidden className="w-max">
        {columns.length > 0 && (
          <div className="mb-2 grid gap-[3px]" style={grid}>
            {columns.map((column) => (
              <span
                key={column.label}
                className="text-[10.5px] font-normal tracking-[.12em] whitespace-nowrap text-[color-mix(in_srgb,var(--paper)_70%,var(--ink))] uppercase"
                style={{ gridColumnStart: column.start + 1 }}
              >
                {column.label}
              </span>
            ))}
          </div>
        )}
        {firstBoard.map((row, rowIndex) => (
          <div key={rowIndex} className="mb-[3px] grid gap-[3px] perspective-[300px]" style={grid}>
            {Array.from(row, (char, column) => (
              <span
                key={column}
                ref={(element) => {
                  if (element) cells.current.set(`${rowIndex}:${column}`, element)
                }}
                className={cn(
                  "relative grid h-[1.75em] place-items-center bg-[color-mix(in_srgb,var(--paper)_10%,var(--ink))] whitespace-pre backface-hidden after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-(--ink)",
                  column >= width - accentCharacters && "text-accent-on-ink",
                )}
              >
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
