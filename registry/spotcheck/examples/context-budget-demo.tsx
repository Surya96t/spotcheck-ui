"use client"

import * as React from "react"

import { ContextBudget } from "@/registry/spotcheck/components/spotcheck/context-budget"

const SEGMENTS = [
  { label: "System", tokens: 3200 },
  { label: "Tools", tokens: 9800 },
  { label: "History", tokens: 41200 },
  { label: "Files", tokens: 62400 },
]
const COMPACTED_SHARE = 0.35

export function ContextBudgetDemo() {
  const [segments, setSegments] = React.useState(SEGMENTS)

  return (
    <ContextBudget
      limit={200000}
      segments={segments}
      onCompact={() =>
        setSegments((current) =>
          current.map((segment) =>
            segment.label === "History" ? { ...segment, tokens: Math.round(segment.tokens * COMPACTED_SHARE) } : segment,
          ),
        )
      }
    />
  )
}
