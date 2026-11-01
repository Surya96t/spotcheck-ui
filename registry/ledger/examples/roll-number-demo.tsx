"use client"

import * as React from "react"

import { RollNumber } from "@/registry/ledger/components/ledger/roll-number"

export function RollNumberDemo() {
  const [value, setValue] = React.useState(1284903)

  return (
    <div className="flex flex-col gap-3.5">
      <span className="ledger-label">Tokens processed today</span>
      <RollNumber data-testid="roll" value={value} className="text-[clamp(56px,8vw,92px)]" />
      <div>
        <button
          type="button"
          onClick={() => setValue((current) => (current * 7 + 13579) % 9000000)}
          className="border-ink cursor-pointer border-(length:--rule) px-4 py-2.5 font-(family-name:--f-mono) text-[12.5px] font-semibold tracking-[.06em] uppercase shadow-[4px_4px_0_var(--ink)] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          Randomize
        </button>
      </div>
    </div>
  )
}
