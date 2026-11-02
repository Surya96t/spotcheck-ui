"use client"

import * as React from "react"

import { Button } from "@/registry/ledger/components/ledger/button"
import { RunReceipt } from "@/registry/ledger/components/ledger/run-receipt"

const LINES = [
  { label: "Input tokens", value: "2,140" },
  { label: "Output tokens", value: "412" },
  { label: "Cached tokens", value: "1,600" },
  { label: "Tool calls", value: "5" },
  { label: "Duration", value: "2.84 s" },
]

export function RunReceiptDemo() {
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex flex-col items-start gap-4">
      <RunReceipt key={run} title="Run R-2041" meta="atlas-l · 31 Oct 21:42" lines={LINES} total={{ label: "Total", value: "$0.0092" }} />
      <Button onClick={() => setRun((current) => current + 1)}>Print again</Button>
    </div>
  )
}
