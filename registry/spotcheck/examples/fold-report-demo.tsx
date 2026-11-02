import { FoldReport, FoldRow, FoldSection } from "@/registry/spotcheck/components/spotcheck/fold-report"

// An invented incident.
const SECTIONS = [
  {
    title: "Timeline",
    rows: [
      ["09:12", "p95 on /chat crosses 2.4 s"],
      ["09:15", "Pager fires, on-call acknowledges"],
      ["09:31", "Reranker pods at 100% CPU"],
      ["09:48", "Traffic shifted to Mumbai"],
      ["10:05", "p95 back under 900 ms"],
    ],
  },
  {
    title: "Root cause",
    rows: [
      ["1", "A dataset sync re-embedded 812 docs at peak"],
      ["2", "Reranker shared nodes with the embed job"],
      ["3", "No CPU limit on the batch queue"],
    ],
  },
  {
    title: "Fix",
    rows: [
      ["Done", "Batch embeds moved to their own node pool"],
      ["Done", "CPU limits on every queue worker"],
      ["Done", "Syncs scheduled for 02:00 IST"],
    ],
  },
  {
    title: "Follow-ups",
    rows: [
      ["Infra", "Alert on reranker queue depth"],
      ["Platform", "Load test at 2× peak"],
      ["Ops", "Runbook for regional failover"],
    ],
  },
]

export function FoldReportDemo() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="border-ink border-b-(length:--rule) pb-2.5">
        <span className="spotcheck-label">INC-0921 · Sev 2 · 31 Oct</span>
        <div className="spotcheck-display text-[34px] leading-[.95]">Retrieval latency spike</div>
      </div>
      <FoldReport defaultOpen="Timeline">
        {SECTIONS.map(({ title, rows }) => (
          <FoldSection key={title} value={title} title={title} meta={`${rows.length} entries`}>
            {rows.map(([label, text]) => (
              <FoldRow key={text} label={label}>
                {text}
              </FoldRow>
            ))}
          </FoldSection>
        ))}
      </FoldReport>
    </div>
  )
}
