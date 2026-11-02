import { TraceWaterfall, type Span } from "@/registry/ledger/components/ledger/trace-waterfall"

const SPANS: Span[] = [
  { id: "run", name: "agent.run", start: 0, end: 2840 },
  { id: "plan", parent: "run", name: "plan", start: 40, end: 260 },
  { id: "retrieve", parent: "run", name: "retrieve", start: 280, end: 1240 },
  { id: "kb", parent: "retrieve", name: "search.kb", start: 300, end: 940 },
  { id: "web", parent: "retrieve", name: "search.tickets", start: 310, end: 1180 },
  { id: "rerank", parent: "retrieve", name: "rerank", start: 1050, end: 1230 },
  { id: "tool", parent: "run", name: "tool.refund_lookup", start: 1260, end: 1390, state: "error" },
  { id: "answer", parent: "run", name: "answer", start: 1400, end: 2840, state: "running" },
]

export function TraceWaterfallDemo() {
  return <TraceWaterfall label="Support answer, 2.84 seconds in total, retrieval ran two searches in parallel" spans={SPANS} />
}
