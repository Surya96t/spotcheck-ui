"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/registry/spotcheck/hooks/use-reduced-motion"

const INTERVAL_MS = 1600
const BARS = 14
const BAR_DELAY_MS = 70

type ThinkingProps = {
  /** The labels to rotate through. */
  steps: string[]
  /** Time on each label, in milliseconds. */
  interval?: number
  className?: string
}

export function Thinking({ steps, interval = INTERVAL_MS, className }: ThinkingProps) {
  const [index, setIndex] = React.useState(0)
  const reduced = useReducedMotion()

  React.useEffect(() => {
    if (reduced || steps.length < 2) return
    const timer = setInterval(() => setIndex((current) => (current + 1) % steps.length), interval)
    return () => clearInterval(timer)
  }, [interval, reduced, steps.length])

  return (
    <div className={cn("flex flex-wrap items-end gap-4 font-(family-name:--f-body)", className)}>
      <div aria-hidden className="flex h-14 items-end gap-[3px]">
        {Array.from({ length: BARS }, (_, bar) => (
          <i
            key={bar}
            className="bg-ink h-1/2 w-1.5 nth-[3n]:bg-(--accent-ink) motion-safe:[animation:spotcheck-wave_1.1s_ease-in-out_infinite]"
            style={{ animationDelay: `${bar * BAR_DELAY_MS}ms` }}
          />
        ))}
      </div>
      <div>
        <div className="spotcheck-label">
          Working · {index + 1}/{steps.length}
        </div>
        <div role="status" className="spotcheck-display text-3xl leading-none">
          {steps[index]}
        </div>
      </div>
    </div>
  )
}
