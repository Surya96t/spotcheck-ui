"use client"

import * as React from "react"

import { RippleHeatmap, type HeatCell } from "@/registry/ledger/components/ledger/ripple-heatmap"

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const HOURS = 24
const PEAK_REQUESTS = 4200

const VALUES = Array.from({ length: HOURS * DAYS.length }, (_, index) => {
  const hour = index % HOURS
  const weekday = Math.floor(index / HOURS) < 5 ? 1 : 0.45
  const curve = Math.exp(-(((hour - 14) / 4.2) ** 2)) * 0.9 + Math.exp(-(((hour - 10) / 2.5) ** 2)) * 0.4
  return Math.max(0.04, Math.min(1, curve * weekday + ((index * 37) % 11) / 80))
})

const describe = (cell: HeatCell) =>
  `${DAYS[cell.row]} ${String(cell.column).padStart(2, "0")}:00, ${Math.round(cell.value * PEAK_REQUESTS).toLocaleString("en-US")} requests`

export function RippleHeatmapDemo() {
  const [picked, setPicked] = React.useState<HeatCell | null>(null)

  return (
    <div className="flex flex-col gap-3.5">
      <RippleHeatmap
        label="Requests per hour by weekday"
        values={VALUES}
        rowLabels={DAYS}
        cellLabel={describe}
        onPick={setPicked}
      />
      <span role="status" className="ledger-label" data-testid="heat-pick">
        {picked ? describe(picked) : "Press a cell"}
      </span>
    </div>
  )
}
