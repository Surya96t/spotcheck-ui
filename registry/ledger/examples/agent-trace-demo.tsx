"use client"

import * as React from "react"

import { AgentTrace, type TraceStep } from "@/registry/ledger/components/ledger/agent-trace"
import { Button } from "@/registry/ledger/components/ledger/button"

const STEPS = [
  { id: "plan", tool: "plan", argument: "split question into 3 sub-queries", ms: 220, output: "3 sub-queries: policy window, partial refunds, payout timing" },
  { id: "search", tool: "search", argument: 'kb: "refund window approval"', ms: 640, output: "14 chunks from 5 files" },
  { id: "fetch", tool: "fetch", argument: "refund-policy.md", ms: 310, output: "2,140 tokens read" },
  { id: "rerank", tool: "rerank", argument: "top 14 → 5", ms: 180, output: "kept 5, dropped 9 below 0.42" },
  { id: "answer", tool: "answer", argument: "compose with citations", ms: 1450, output: "412 tokens, 3 citations" },
]
const SPEED = 0.9

export function AgentTraceDemo() {
  const [reached, setReached] = React.useState(0)
  const done = reached >= STEPS.length

  React.useEffect(() => {
    if (done) return
    const timer = setTimeout(() => setReached((current) => current + 1), (STEPS[reached]?.ms ?? 0) * SPEED)
    return () => clearTimeout(timer)
  }, [done, reached])

  const steps: TraceStep[] = STEPS.map((step, index) => ({
    ...step,
    state: index < reached ? "done" : index === reached ? "running" : "queued",
  }))

  return (
    <div className="flex flex-col items-start gap-3.5">
      <AgentTrace steps={steps} live={!done} className="w-full" />
      <Button onClick={() => setReached(0)}>Replay</Button>
    </div>
  )
}
