"use client"

import dynamic from "next/dynamic"

// three.js is heavy, so it loads on the client after the page is ready.
const LinkedBars = dynamic(
  () => import("@/registry/spotcheck/components/spotcheck/linked-bars").then((module) => module.LinkedBars),
  { ssr: false },
)

const REGIONS = ["Mumbai", "Hyderabad", "Singapore", "Frankfurt", "Virginia", "Oregon"]
const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"]

// Invented numbers: thousands of requests per week.
const REQUESTS = REGIONS.map((_, row) =>
  WEEKS.map(
    (_, week) =>
      Math.round((14 + row * 3.4 + Math.sin(week * 0.8 + row) * 5 + week * (row % 2 ? 1.3 : 2.1) + ((row * 13 + week * 7) % 5)) * 10) /
      10,
  ),
)

export function LinkedBarsDemo() {
  return (
    <LinkedBars
      title="Requests per week, in thousands"
      label="3D bar chart of weekly requests for six regions. The table holds the same numbers."
      rows={REGIONS}
      columns={WEEKS}
      values={REQUESTS}
      format={(value) => value.toFixed(1)}
    />
  )
}
