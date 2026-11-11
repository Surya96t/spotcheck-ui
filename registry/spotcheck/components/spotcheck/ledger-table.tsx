"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const MIN_COLUMN_WIDTH = 110
const CELL_RULE = "border-l border-[color-mix(in_srgb,var(--ink)_18%,transparent)]"
const RAIL = "border-ink w-[2.6rem] border-r-(length:--rule) pr-2 text-right font-(family-name:--f-mono) text-[11px] font-normal"

export type LedgerColumn<Row> = {
  key: keyof Row & string
  label: string
  /** Right-aligns the column with tabular digits. */
  numeric?: boolean
  /** Sets the column in the heavier display type. */
  emphasis?: boolean
  /** Custom cell content. Pass columns from a client component when you use it. */
  render?: (row: Row) => React.ReactNode
}

export type LedgerSort<Row> = { key: keyof Row & string; dir: "asc" | "desc" }

type LedgerTableProps<Row> = {
  /** Printed inside the table, and names it for screen readers. */
  title: string
  rows: Row[]
  columns: LedgerColumn<Row>[]
  /** The field that uniquely identifies a row. */
  rowKey: keyof Row & string
  defaultSort?: LedgerSort<Row>
  className?: string
}

export function sortRows<Row>(rows: Row[], sort: LedgerSort<Row> | undefined) {
  if (!sort) return rows
  const direction = sort.dir === "asc" ? 1 : -1
  return rows.toSorted((a, b) => {
    const left = a[sort.key]
    const right = b[sort.key]
    if (left === right) return 0
    return (left > right ? 1 : -1) * direction
  })
}

export function LedgerTable<Row>({ title, rows, columns, rowKey, defaultSort, className }: LedgerTableProps<Row>) {
  const [sort, setSort] = React.useState(defaultSort)
  const sorted = sortRows(rows, sort)

  const toggle = (key: keyof Row & string) => {
    setSort((current) => ({ key, dir: current?.key === key && current.dir === "desc" ? "asc" : "desc" }))
  }

  return (
    <div tabIndex={0} role="region" aria-label={title} className={cn("spotcheck-focus overflow-x-auto font-(family-name:--f-body)", className)}>
      <table className="w-full border-collapse tabular-nums" style={{ minWidth: columns.length * MIN_COLUMN_WIDTH }}>
        <caption className="sr-only">{title}</caption>
        <thead>
          <tr aria-hidden>
            <td className={cn(RAIL, "text-mute pt-6.5 pb-2.5 align-bottom")}>00</td>
            <td colSpan={columns.length} className="spotcheck-display px-3 pt-6.5 pb-2.5 align-bottom text-[42px] leading-[.9]">
              {title}
            </td>
          </tr>
          <tr>
            <th scope="col" className={cn(RAIL, "spotcheck-label border-b-(length:--rule) pt-2.5 pb-1.5 align-bottom")}>
              #
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={sort?.key === column.key ? (sort.dir === "asc" ? "ascending" : "descending") : undefined}
                className={cn(
                  "spotcheck-label border-ink border-b-(length:--rule) px-3 pt-2.5 pb-1.5 text-left align-bottom font-medium",
                  CELL_RULE,
                  sort?.key === column.key && "text-ink",
                  column.numeric && "text-right",
                )}
              >
                <button type="button" onClick={() => toggle(column.key)} className="spotcheck-focus cursor-pointer uppercase">
                  {column.label}
                  {sort?.key === column.key && <span aria-hidden>{sort.dir === "asc" ? " ↑" : " ↓"}</span>}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, index) => (
            <tr
              key={String(row[rowKey])}
              className="hover:bg-ink hover:text-paper group transition-colors duration-100 motion-reduce:transition-none"
            >
              <td className={cn(RAIL, "text-mute group-hover:text-paper pt-5.5 pb-1.5 align-bottom")}>
                {String(index + 1).padStart(2, "0")}
              </td>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={cn(
                    "px-3 pt-5.5 pb-1.5 align-bottom",
                    CELL_RULE,
                    column.numeric && "text-right",
                    column.emphasis && "spotcheck-heading text-xl leading-none",
                  )}
                >
                  {column.render ? column.render(row) : String(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
