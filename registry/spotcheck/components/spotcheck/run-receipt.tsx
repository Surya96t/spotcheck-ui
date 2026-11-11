"use client"

import * as React from "react"
import { animate, steps } from "animejs"

import { cn } from "@/lib/utils"
import { useInView } from "@/registry/spotcheck/hooks/use-in-view"
import { useReducedMotion } from "@/registry/spotcheck/hooks/use-reduced-motion"

const MS_PER_LINE = 110
const TEETH = 16
const TOOTH_DEPTH = 7

/** A zigzag bottom edge, as a clip-path. */
export function tornEdge(teeth = TEETH, depth = TOOTH_DEPTH) {
  const points = Array.from({ length: teeth * 2 + 1 }, (_, index) => {
    const x = (index / (teeth * 2)) * 100
    return `${100 - x}% ${index % 2 === 0 ? "100%" : `calc(100% - ${depth}px)`}`
  })
  return `polygon(0 0, 100% 0, ${points.join(", ")})`
}

export type ReceiptLine = { label: string; value: string }

type RunReceiptProps = {
  /** The run's name, printed at the top. */
  title: string
  /** A second line, such as the model and time. */
  meta?: string
  lines: ReceiptLine[]
  total: ReceiptLine
  /** Printed at the very bottom. */
  footer?: string
  className?: string
}

export function RunReceipt({ title, meta, lines, total, footer = "Thank you for running", className }: RunReceiptProps) {
  const host = React.useRef<HTMLDivElement>(null)
  const paper = React.useRef<HTMLDivElement>(null)
  const inView = useInView(host)
  const reduced = useReducedMotion()
  const printed = React.useRef(false)
  const count = lines.length + 4

  React.useEffect(() => {
    if (!inView || reduced || printed.current || !paper.current) return
    printed.current = true
    animate(paper.current, {
      translateY: ["-100%", "0%"],
      duration: count * MS_PER_LINE,
      ease: steps(count),
    })
  }, [count, inView, reduced])

  return (
    <div ref={host} className={cn("w-full max-w-80 font-(family-name:--f-body)", className)}>
      <div aria-hidden className="border-ink bg-ink relative z-10 h-2 border-(length:--rule)" />
      <div className="-mx-px overflow-hidden px-px pr-1.5 pb-1.5">
        <div ref={paper} data-testid="receipt-paper" className="drop-shadow-[4px_4px_0_var(--ink)]">
          <div
            className="bg-raise px-4 pt-4 pb-6 font-(family-name:--f-mono) text-xs"
            style={{ clipPath: tornEdge() }}
          >
            <div className="spotcheck-display text-center font-(family-name:--f-display) text-[26px] leading-none">
              {title}
            </div>
            {meta && <div className="spotcheck-label mt-1 text-center">{meta}</div>}
            <dl className="mt-3 border-y border-dashed border-[color-mix(in_srgb,var(--ink)_40%,transparent)] py-2">
              {lines.map((line) => (
                <div key={line.label} className="flex items-baseline justify-between gap-3 py-0.5">
                  <dt>{line.label}</dt>
                  <dd className="m-0 tabular-nums">{line.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-2 flex items-baseline justify-between gap-3">
              <span className="font-semibold uppercase">{total.label}</span>
              <b className="spotcheck-display text-[30px] leading-none tabular-nums">{total.value}</b>
            </div>
            <div className="spotcheck-label mt-3 text-center">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
