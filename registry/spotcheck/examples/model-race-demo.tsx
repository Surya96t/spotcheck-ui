"use client"

import * as React from "react"

import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { ModelRace, type RaceLane } from "@/registry/spotcheck/components/spotcheck/model-race"

const ANSWER = "Refunds over 30 days need manager approval. Store credit is instant, and card refunds take 5 to 7 business days."
const TICK_MS = 60
const MODELS = [
  { id: "l", model: "atlas-l", charsPerTick: 2, costPerChar: 0.00006 },
  { id: "m", model: "atlas-m", charsPerTick: 3, costPerChar: 0.00002 },
  { id: "s", model: "atlas-s", charsPerTick: 5, costPerChar: 0.000005 },
]

const lanesAt = (tick: number): RaceLane[] =>
  MODELS.map(({ id, model, charsPerTick, costPerChar }) => {
    const length = Math.min(ANSWER.length, tick * charsPerTick)
    const done = length === ANSWER.length
    const finishTick = Math.ceil(ANSWER.length / charsPerTick)
    return {
      id,
      model,
      text: ANSWER.slice(0, length),
      status: tick === 0 ? "waiting" : done ? "done" : "streaming",
      ms: Math.min(tick, finishTick) * TICK_MS,
      cost: length * costPerChar,
    }
  })

const LAST_TICK = Math.ceil(ANSWER.length / Math.min(...MODELS.map((model) => model.charsPerTick)))

export function ModelRaceDemo({ autoStart = false }: { autoStart?: boolean }) {
  const [tick, setTick] = React.useState(0)
  const [running, setRunning] = React.useState(autoStart)

  React.useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setTick((current) => current + 1), TICK_MS)
    return () => clearInterval(timer)
  }, [running])

  const finished = tick >= LAST_TICK

  return (
    <div className="flex flex-col items-start gap-3.5">
      <ModelRace lanes={lanesAt(Math.min(tick, LAST_TICK))} className="w-full" />
      <Button
        variant="ink"
        disabled={running && !finished}
        onClick={() => {
          setTick(0)
          setRunning(true)
        }}
      >
        Start race
      </Button>
    </div>
  )
}
