"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const ROW = "grid grid-cols-[1.6rem_5.2rem_minmax(0,1fr)_4.4rem] items-end gap-2.5"

export type TraceStep = {
  id: string
  tool: string
  /** The main argument, shortened to one line. */
  argument: string
  state: "queued" | "running" | "done" | "error"
  /** How long it took, or is expected to take, in milliseconds. */
  ms?: number
  output?: React.ReactNode
}

/** Share of the run's time that's finished, from 0 to 1. */
export function traceProgress(steps: TraceStep[]) {
  const total = steps.reduce((sum, step) => sum + (step.ms ?? 0), 0)
  if (total === 0) return 0
  const finished = steps.filter((step) => step.state === "done" || step.state === "error")
  return finished.reduce((sum, step) => sum + (step.ms ?? 0), 0) / total
}

type AgentTraceProps = {
  steps: TraceStep[]
  /** Set while the run is going, so the summary reads as a step count. */
  live?: boolean
  className?: string
}

export function AgentTrace({ steps, live = false, className }: AgentTraceProps) {
  const [open, setOpen] = React.useState<string | null>(null)
  const progress = traceProgress(steps)
  const total = steps.reduce((sum, step) => sum + (step.ms ?? 0), 0)
  const running = steps.findIndex((step) => step.state === "running")

  return (
    <div className={cn("font-(family-name:--f-mono) text-[12.5px]", className)}>
      {steps.map((step) => {
        const expanded = open === step.id
        return (
          <div key={step.id} data-state={step.state} className={cn(step.state === "queued" && "text-mute")}>
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? null : step.id)}
              className={cn(
                ROW,
                "ledger-focus hover:bg-wash w-full cursor-pointer border-b border-[color-mix(in_srgb,var(--ink)_18%,transparent)] pt-2.5 pb-[5px] text-left",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "size-3 self-center border-(length:--rule)",
                  step.state === "done" && "border-ink bg-ink",
                  step.state === "running" && "border-accent-ink bg-accent-ink motion-safe:animate-pulse",
                  step.state === "error" && "border-bad bg-bad",
                  step.state === "queued" && "border-ink",
                )}
              />
              <span className="font-semibold uppercase">{step.tool}</span>
              <span className="min-w-0 truncate">{step.argument}</span>
              <span className="text-mute text-right tabular-nums">{step.state === "queued" ? "—" : `${step.ms ?? 0} ms`}</span>
              <span className="sr-only">{step.state}</span>
            </button>
            {expanded && (
              <div className="text-mute pt-1.5 pb-2.5 pl-[2.6rem]">
                → {step.state === "done" || step.state === "error" ? step.output : "Not finished yet"}
              </div>
            )}
          </div>
        )
      })}
      <div
        role="progressbar"
        aria-label="Run progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        className="bg-wash mt-3 h-1.5"
      >
        <div
          className="bg-accent-ink h-full transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div role="status" className="ledger-label mt-2">
        {live && running >= 0 ? `Step ${running + 1} of ${steps.length}` : `Done in ${(total / 1000).toFixed(2)} s`}
      </div>
    </div>
  )
}
