import * as React from "react"

import { cn } from "@/lib/utils"

const WIDTH = 160
const HEIGHT = 34
const PADDING = 3
const MARKER = 6

type SparklineProps = Omit<React.ComponentProps<"svg">, "children" | "values"> & {
  values: number[]
  /** Describes the trend for screen readers. Leave it out if the numbers are printed nearby. */
  label?: string
}

export function sparklinePoints(values: number[]) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const range = max - min || 1
  return values.map((value, index) => [
    (index / Math.max(1, values.length - 1)) * WIDTH,
    HEIGHT - PADDING - ((value - min) / range) * (HEIGHT - PADDING * 2),
  ] as const)
}

export function Sparkline({ values, label, className, ...props }: SparklineProps) {
  const points = sparklinePoints(values)
  const last = points.at(-1)
  const path = points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("block h-[34px] w-full", className)}
      {...props}
    >
      <path d={path} fill="none" stroke="var(--ink)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
      {last && (
        <rect x={last[0] - MARKER / 2} y={last[1] - MARKER / 2} width={MARKER} height={MARKER} fill="var(--accent-ink)" />
      )}
    </svg>
  )
}
