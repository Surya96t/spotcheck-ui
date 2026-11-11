"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const TICKS = [0, 0.5, 1]
const INDENT_REM = 0.9
const STATES = { ok: "bg-ink", running: "bg-accent-ink", error: "bg-bad" }

export type Span = {
  id: string
  /** The span this one ran inside. */
  parent?: string
  name: string
  /** Start time in milliseconds from the beginning of the run. */
  start: number
  end: number
  state?: keyof typeof STATES
}

export type FlatSpan = { span: Span; depth: number; hasChildren: boolean }

/** Depth-first rows, skipping anything inside a collapsed span. */
export function flattenSpans(spans: Span[], collapsed: ReadonlySet<string> = new Set()) {
  const rows: FlatSpan[] = []
  const visit = (parent: string | undefined, depth: number) => {
    for (const span of spans.filter((item) => item.parent === parent).toSorted((a, b) => a.start - b.start)) {
      const hasChildren = spans.some((item) => item.parent === span.id)
      rows.push({ span, depth, hasChildren })
      if (hasChildren && !collapsed.has(span.id)) visit(span.id, depth + 1)
    }
  }
  visit(undefined, 0)
  return rows
}

export const formatMs = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`)

type TraceWaterfallProps = {
  /** Names the chart for screen readers. */
  label: string
  spans: Span[]
  className?: string
}

export function TraceWaterfall({ label, spans, className }: TraceWaterfallProps) {
  const [collapsed, setCollapsed] = React.useState<ReadonlySet<string>>(new Set())
  const total = Math.max(...spans.map((span) => span.end), 1)
  const percent = (ms: number) => `${(ms / total) * 100}%`

  const toggle = (id: string) =>
    setCollapsed((current) => {
      const next = new Set(current)
      if (!next.delete(id)) next.add(id)
      return next
    })

  return (
    <div tabIndex={0} role="region" aria-label={label} className={cn("spotcheck-focus relative overflow-x-auto font-(family-name:--f-body)", className)}>
      <div className="min-w-[520px] font-(family-name:--f-mono) text-xs">
        <div aria-hidden className="border-ink grid grid-cols-[13rem_minmax(0,1fr)_4.5rem] gap-2.5 border-b-(length:--rule) pb-1">
          <span className="spotcheck-label">Span</span>
          <div className="relative h-4">
            {TICKS.map((tick) => (
              <span
                key={tick}
                className="spotcheck-label absolute -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
                style={{ left: `${tick * 100}%` }}
              >
                {formatMs(total * tick)}
              </span>
            ))}
          </div>
          <span className="spotcheck-label text-right">Time</span>
        </div>
        <ul className="m-0 list-none p-0">
          {flattenSpans(spans, collapsed).map(({ span, depth, hasChildren }) => {
            const open = !collapsed.has(span.id)
            return (
              <li
                key={span.id}
                data-span={span.id}
                className="grid grid-cols-[13rem_minmax(0,1fr)_4.5rem] items-center gap-2.5 border-b border-[color-mix(in_srgb,var(--ink)_18%,transparent)] py-1"
              >
                <div className="min-w-0 truncate" style={{ paddingLeft: `${depth * INDENT_REM}rem` }}>
                  {hasChildren ? (
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => toggle(span.id)}
                      className="spotcheck-focus cursor-pointer font-semibold"
                    >
                      <span aria-hidden>{open ? "− " : "+ "}</span>
                      {span.name}
                    </button>
                  ) : (
                    span.name
                  )}
                </div>
                <div className="bg-wash relative h-3">
                  <i
                    aria-hidden
                    className={cn(
                      "absolute inset-y-0 min-w-0.5 origin-left motion-safe:[animation:spotcheck-grow_.5s_cubic-bezier(.2,.8,.2,1)_both]",
                      STATES[span.state ?? "ok"],
                    )}
                    style={{ left: percent(span.start), width: percent(span.end - span.start) }}
                  />
                </div>
                <span className="text-right tabular-nums">
                  {formatMs(span.end - span.start)}
                  <span className="sr-only">, starting at {formatMs(span.start)}</span>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
