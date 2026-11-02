"use client"

import * as React from "react"

import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { RollNumber } from "@/registry/spotcheck/components/spotcheck/roll-number"

export function RollNumberDemo() {
  const [value, setValue] = React.useState(1284903)

  return (
    <div className="flex flex-col gap-3.5">
      <span className="spotcheck-label">Tokens processed today</span>
      <RollNumber data-testid="roll" value={value} className="text-[clamp(56px,8vw,92px)]" />
      <div>
        <Button onClick={() => setValue((current) => (current * 7 + 13579) % 9000000)}>Randomize</Button>
      </div>
    </div>
  )
}
