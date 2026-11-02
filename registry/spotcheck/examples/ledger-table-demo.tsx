"use client"

import { LedgerTable, type LedgerColumn } from "@/registry/spotcheck/components/spotcheck/ledger-table"
import { StatusPill } from "@/registry/spotcheck/components/spotcheck/status-pill"

type Run = { id: string; model: string; dataset: string; score: number; p50: number; status: "pass" | "drift" | "fail" }

const RUNS: Run[] = [
  { id: "R-2041", model: "atlas-l", dataset: "support-qa", score: 0.912, p50: 840, status: "pass" },
  { id: "R-2040", model: "atlas-m", dataset: "support-qa", score: 0.884, p50: 410, status: "pass" },
  { id: "R-2039", model: "atlas-s", dataset: "support-qa", score: 0.801, p50: 160, status: "drift" },
  { id: "R-2038", model: "local/32b", dataset: "support-qa", score: 0.742, p50: 1290, status: "fail" },
  { id: "R-2037", model: "atlas-l", dataset: "tool-use", score: 0.957, p50: 1120, status: "pass" },
]

const TONES = { pass: "ok", drift: "warn", fail: "bad" } as const

const COLUMNS: LedgerColumn<Run>[] = [
  { key: "id", label: "Run", emphasis: true },
  { key: "model", label: "Model" },
  { key: "dataset", label: "Dataset" },
  { key: "score", label: "Score", numeric: true, render: (run) => run.score.toFixed(3) },
  { key: "p50", label: "p50 ms", numeric: true, render: (run) => run.p50.toLocaleString("en-US") },
  { key: "status", label: "Status", render: (run) => <StatusPill tone={TONES[run.status]}>{run.status}</StatusPill> },
]

export function LedgerTableDemo() {
  return <LedgerTable title="Eval runs, Oct" rows={RUNS} columns={COLUMNS} rowKey="id" defaultSort={{ key: "score", dir: "desc" }} />
}
