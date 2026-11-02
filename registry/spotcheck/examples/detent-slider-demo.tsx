"use client"

import { DetentSlider, type DetentZone } from "@/registry/spotcheck/components/spotcheck/detent-slider"

const ZONES: DetentZone[] = [
  { from: 0, to: 0.4, label: "Deterministic" },
  { from: 0.6, to: 1.2, label: "Balanced" },
  { from: 1.4, to: 2, label: "Creative" },
]

export function DetentSliderDemo() {
  return (
    <DetentSlider
      label="Temperature"
      min={0}
      max={2}
      step={0.2}
      defaultValue={0.8}
      zones={ZONES}
      marks={[0, 0.4, 0.8, 1.2, 1.6, 2]}
      format={(value) => value.toFixed(1)}
    />
  )
}
