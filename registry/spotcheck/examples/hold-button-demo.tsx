"use client"

import * as React from "react"

import { HoldButton } from "@/registry/spotcheck/components/spotcheck/hold-button"

export function HoldButtonDemo() {
  const [count, setCount] = React.useState(0)

  return (
    <div className="flex flex-wrap items-center gap-4">
      <HoldButton onConfirm={() => setCount((current) => current + 1)}>Hold to delete</HoldButton>
      <span className="spotcheck-label" data-testid="hold-count">
        Confirmed {count} times
      </span>
    </div>
  )
}
