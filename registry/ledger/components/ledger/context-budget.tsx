import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/ledger/components/ledger/button"

const FILLS = ["var(--ink)", "var(--accent-ink)", "var(--mute)", "var(--wash)"]

export type BudgetSegment = { label: string; tokens: number }

type ContextBudgetProps = {
  /** The size of the context window, in tokens. */
  limit: number
  /** Where the tokens went, in display order. */
  segments: BudgetSegment[]
  /** Shows a Compact button. Pass it from a client component. */
  onCompact?: () => void
  compactLabel?: string
  className?: string
}

const compact = (tokens: number) => `${(tokens / 1000).toFixed(1)}k`

export function ContextBudget({ limit, segments, onCompact, compactLabel = "Compact history", className }: ContextBudgetProps) {
  const used = segments.reduce((sum, segment) => sum + segment.tokens, 0)
  const summary = segments.map((segment) => `${segment.label} ${compact(segment.tokens)}`).join(", ")

  return (
    <div className={cn("flex flex-col gap-3.5", className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="ledger-label">Context window</div>
          <div className="ledger-display text-[44px] leading-none tabular-nums">
            {used.toLocaleString("en-US")}{" "}
            <span className="text-mute text-[22px] font-medium">/ {limit.toLocaleString("en-US")}</span>
          </div>
        </div>
        {onCompact && <Button onClick={onCompact}>{compactLabel}</Button>}
      </div>
      <div
        role="img"
        aria-label={`${Math.round((used / limit) * 100)} percent of the context window used: ${summary}`}
        className="border-ink flex h-[34px] border-(length:--rule)"
      >
        {segments.map((segment, index) => (
          <div
            key={segment.label}
            className="border-ink h-full border-r-(length:--rule) transition-[width] duration-500 motion-reduce:transition-none"
            style={{ width: `${(segment.tokens / limit) * 100}%`, background: FILLS[index % FILLS.length] }}
          />
        ))}
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-x-3.5 gap-y-2">
        {segments.map((segment, index) => (
          <div key={segment.label} className="text-mute flex flex-col gap-0.5 font-(family-name:--f-mono) text-[11px]">
            <span>
              <i
                className="border-ink mr-1.5 inline-block size-2.5 border-[1.5px] align-[-1px]"
                style={{ background: FILLS[index % FILLS.length] }}
              />
              {segment.label}
            </span>
            <b className="ledger-heading text-ink text-[22px] leading-none tabular-nums">{compact(segment.tokens)}</b>
          </div>
        ))}
      </div>
    </div>
  )
}
