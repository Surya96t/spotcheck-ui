"use client"

import * as React from "react"

import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { DrawChart } from "@/registry/spotcheck/components/spotcheck/draw-chart"

const SERIES = [38, 41, 40, 47, 44, 52, 58, 55, 63, 61, 70, 76, 74, 83]

export function DrawChartDemo() {
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex flex-col items-start gap-3.5">
      <DrawChart
        key={run}
        title="Answer accuracy, 14 weeks"
        label="Accuracy rose from 38% to 83% over 14 weeks"
        series={SERIES}
        max={90}
        ticks={[0, 30, 60, 90]}
        format={(value) => `${Math.round(value)}%`}
        className="w-full"
      />
      <Button onClick={() => setRun((current) => current + 1)}>Redraw</Button>
    </div>
  )
}
