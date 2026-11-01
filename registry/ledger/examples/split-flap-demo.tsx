"use client"

import * as React from "react"

import { Button } from "@/registry/ledger/components/ledger/button"
import { SplitFlap } from "@/registry/ledger/components/ledger/split-flap"

const BOARDS = [
  ["EMBED   SUPPORT-QA  OK", "RERANK  TOP-14      OK", "EVAL    TOOL-USE   RUN", "DEPLOY  ATLAS-M    HLD"],
  ["INGEST  INVOICES   RUN", "CHUNK   812 DOCS    OK", "EVAL    SUPPORT-QA  OK", "ROLLBK  ATLAS-S    ERR"],
  ["SYNC    CRM-LEADS   OK", "EMBED   PRICING    RUN", "JUDGE   200 PAIRS  RUN", "DEPLOY  ATLAS-L     OK"],
]
const COLUMNS = [
  { label: "Job", start: 0 },
  { label: "Target", start: 8 },
  { label: "State", start: 19 },
]

export function SplitFlapDemo() {
  const [board, setBoard] = React.useState(0)

  return (
    <div className="flex flex-col items-start gap-3.5">
      <SplitFlap rows={BOARDS[board] ?? []} columns={COLUMNS} accentCharacters={3} className="max-w-full" />
      <Button onClick={() => setBoard((current) => (current + 1) % BOARDS.length)}>Next board</Button>
    </div>
  )
}
