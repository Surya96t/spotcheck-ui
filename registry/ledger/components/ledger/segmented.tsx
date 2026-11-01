"use client"

import * as React from "react"
import { Toggle } from "@base-ui/react/toggle"
import { ToggleGroup } from "@base-ui/react/toggle-group"

import { cn } from "@/lib/utils"

type SegmentedProps = {
  /** Names the group for screen readers. */
  label: string
  options: string[]
  /** The selected option, when you control it. */
  value?: string
  /** The starting option, when it manages itself. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function Segmented({ label, options, value, defaultValue, onValueChange, className }: SegmentedProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? options[0] ?? "")
  const current = value ?? internal

  return (
    <ToggleGroup
      aria-label={label}
      value={[current]}
      onValueChange={(pressed) => {
        // Pressing the selected option empties the group, but one option must stay selected.
        const next = pressed[0]
        if (next === undefined) return
        setInternal(next)
        onValueChange?.(next)
      }}
      className={cn("border-ink inline-flex border-(length:--rule)", className)}
    >
      {options.map((option) => (
        <Toggle
          key={option}
          value={option}
          className="ledger-focus border-ink data-pressed:bg-ink data-pressed:text-paper cursor-pointer border-l-(length:--rule) px-2.5 py-1 font-(family-name:--f-mono) text-xs first:border-l-0"
        >
          {option}
        </Toggle>
      ))}
    </ToggleGroup>
  )
}
