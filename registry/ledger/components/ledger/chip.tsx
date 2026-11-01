import * as React from "react"

import { cn } from "@/lib/utils"

type ChipProps = React.ComponentProps<"span"> & {
  /** Shows a remove button. Pass it from a client component. */
  onRemove?: () => void
  /** Names the remove button for screen readers. */
  removeLabel?: string
}

export function Chip({ onRemove, removeLabel = "Remove", className, children, ...props }: ChipProps) {
  return (
    <span
      className={cn(
        "border-ink bg-paper inline-flex items-center gap-1.5 border-[1.5px] py-0.5 pr-1 pl-2 font-(family-name:--f-mono) text-[11.5px]",
        !onRemove && "pr-2",
        className,
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="ledger-focus cursor-pointer px-1 text-[13px] leading-none"
        >
          ×
        </button>
      )}
    </span>
  )
}
