"use client"

import * as React from "react"

import { Button } from "@/registry/ledger/components/ledger/button"
import { ScrambleText } from "@/registry/ledger/components/ledger/scramble-text"

export function ScrambleTextDemo() {
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex flex-col items-start gap-3.5">
      <ScrambleText key={run} text="Ship the ledger" className="text-[clamp(34px,5vw,54px)] leading-[.95]" />
      <Button onClick={() => setRun((current) => current + 1)}>Replay</Button>
    </div>
  )
}
