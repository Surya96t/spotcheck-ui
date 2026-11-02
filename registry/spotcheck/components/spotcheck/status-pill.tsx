import * as React from "react"

import { cn } from "@/lib/utils"

const TONES = { ok: "text-ok", warn: "text-warn", bad: "text-bad", neutral: "text-mute" }

type StatusPillProps = React.ComponentProps<"span"> & {
  tone?: keyof typeof TONES
}

export function StatusPill({ tone = "neutral", className, ...props }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-(family-name:--f-mono) text-[11px] tracking-[.08em] uppercase before:size-2 before:bg-current before:content-['']",
        TONES[tone],
        // A ledger-table row inverts on hover, so the tone gives way to the row's colour.
        "[tr:hover_&]:text-inherit",
        className,
      )}
      {...props}
    />
  )
}
