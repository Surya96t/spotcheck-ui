import * as React from "react"

import { cn } from "@/lib/utils"

type EvalMatrixProps = {
  /** Names the table for screen readers. */
  label: string
  /** Models, down the left. */
  rows: string[]
  /** Tasks, across the top. */
  cols: string[]
  /** Scores, one array per row. */
  values: number[][]
  /** The scores that map to no accent and full accent. */
  domain?: [number, number]
  className?: string
}

export function scoreShare(value: number, [low, high]: [number, number]) {
  return Math.round(Math.min(1, Math.max(0, (value - low) / (high - low))) * 100)
}

export function EvalMatrix({ label, rows, cols, values, domain = [0.6, 1], className }: EvalMatrixProps) {
  return (
    <div tabIndex={0} role="region" aria-label={label} className={cn("spotcheck-focus overflow-x-auto font-(family-name:--f-body)", className)}>
      <table className="w-full min-w-[420px] border-collapse font-(family-name:--f-mono) text-xs tabular-nums">
        <caption className="sr-only">{label}</caption>
        <thead>
          <tr>
            <td />
            {cols.map((col) => (
              <th key={col} scope="col" className="spotcheck-label px-2 py-1.5 text-right font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={row}>
              <th scope="row" className="px-2 py-1 text-left font-semibold whitespace-nowrap">
                {row}
              </th>
              {cols.map((col, colIndex) => {
                const value = values[rowIndex]?.[colIndex] ?? 0
                return (
                  <td
                    key={col}
                    className="border-paper border-[1.5px] p-0 text-right"
                    style={{ background: `color-mix(in srgb, var(--accent-ink) ${scoreShare(value, domain)}%, var(--wash))` }}
                  >
                    {/* A paper chip keeps the digits readable on any shade, in any skin. */}
                    <div className="px-2 pt-3.5 pb-1">
                      <span className="bg-paper px-1">{value.toFixed(2)}</span>
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
