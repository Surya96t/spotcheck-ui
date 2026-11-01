import * as React from "react"

import { cn } from "@/lib/utils"

type ProgressProps = Omit<React.ComponentProps<"div">, "children"> & {
  /** Names the bar for screen readers and prints above it. */
  label: string
  /** How far along it is. Leave it out when the amount of work is unknown. */
  value?: number
  max?: number
}

export function Progress({ label, value, max = 100, className, ...props }: ProgressProps) {
  const percent = value === undefined ? null : Math.round((Math.min(max, Math.max(0, value)) / max) * 100)

  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      <div className="flex justify-between">
        <span className="ledger-label">{label}</span>
        {percent !== null && <span className="ledger-label tabular-nums">{percent}%</span>}
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        className="bg-wash h-1.5"
      >
        <div
          className={cn(
            "bg-accent-ink h-full transition-[width] duration-300 motion-reduce:transition-none",
            percent === null && "animate-pulse motion-reduce:animate-none",
          )}
          style={{ width: `${percent ?? 100}%` }}
        />
      </div>
    </div>
  )
}
