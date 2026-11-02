"use client"

import * as React from "react"

import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { ScrambleText } from "@/registry/spotcheck/components/spotcheck/scramble-text"

export function ScrambleTextDemo() {
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex flex-col items-start gap-3.5">
      <ScrambleText key={run} text="Check the work" className="text-[clamp(34px,5vw,54px)] leading-[.95]" />
      <Button onClick={() => setRun((current) => current + 1)}>Replay</Button>
    </div>
  )
}
