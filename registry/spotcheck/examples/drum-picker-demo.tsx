"use client"

import * as React from "react"

import { DrumPicker } from "@/registry/spotcheck/components/spotcheck/drum-picker"
import { KvRow } from "@/registry/spotcheck/components/spotcheck/kv-row"
import { RollNumber } from "@/registry/spotcheck/components/spotcheck/roll-number"

// Invented models and prices.
const MODELS = [
  { name: "atlas-l", context: "200k", price: "$3.00", latency: "840" },
  { name: "atlas-m", context: "200k", price: "$0.80", latency: "410" },
  { name: "atlas-s", context: "128k", price: "$0.25", latency: "160" },
  { name: "atlas-mini", context: "64k", price: "$0.08", latency: "90" },
  { name: "coder-l", context: "256k", price: "$2.40", latency: "910" },
  { name: "vision-m", context: "128k", price: "$1.10", latency: "700" },
  { name: "judge-xl", context: "32k", price: "$1.20", latency: "620" },
  { name: "embed-v3", context: "8k", price: "$0.02", latency: "40" },
  { name: "local/32b", context: "32k", price: "$0.00", latency: "1,290" },
  { name: "local/8b", context: "16k", price: "$0.00", latency: "380" },
]

const OPTIONS = MODELS.map(({ name }) => ({ value: name, label: name }))

export function DrumPickerDemo() {
  const [value, setValue] = React.useState("atlas-m")
  const model = MODELS.find(({ name }) => name === value) ?? MODELS[0]!

  return (
    <div className="grid min-w-0 items-center gap-5.5 md:grid-cols-2">
      <DrumPicker label="Model" options={OPTIONS} value={value} onValueChange={setValue} />
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="spotcheck-label">Selected model</div>
        <div data-testid="drum-name" className="spotcheck-display mb-1.5 text-5xl leading-[.9] break-words">
          {model.name}
        </div>
        <KvRow label="Context" value={<RollNumber text={model.context} className="text-xl" />} />
        <KvRow label="Input / 1M tokens" value={<RollNumber text={model.price} className="text-xl" />} />
        <KvRow label="p50 latency, ms" value={<RollNumber text={model.latency} className="text-xl" />} />
        <div className="spotcheck-label mt-2.5">Drag, scroll, or use ↑ ↓</div>
      </div>
    </div>
  )
}
