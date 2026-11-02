import { Coverflow, type CoverflowItem } from "@/registry/spotcheck/components/spotcheck/coverflow"

// Invented datasets and scores.
const DATASETS = [
  { name: "support-qa", pairs: "2,400", score: 0.912, updated: "31 Oct" },
  { name: "tool-use", pairs: "1,180", score: 0.957, updated: "30 Oct" },
  { name: "invoices-ocr", pairs: "6,050", score: 0.884, updated: "28 Oct" },
  { name: "refund-intents", pairs: "920", score: 0.931, updated: "27 Oct" },
  { name: "pricing-faq", pairs: "410", score: 0.968, updated: "25 Oct" },
  { name: "legal-clauses", pairs: "3,300", score: 0.801, updated: "22 Oct" },
  { name: "hindi-support", pairs: "1,740", score: 0.846, updated: "20 Oct" },
  { name: "code-review", pairs: "2,050", score: 0.879, updated: "18 Oct" },
]

const ITEMS: CoverflowItem[] = DATASETS.map(({ name, pairs, score, updated }, index) => ({
  value: name,
  summary: `${name} · ${pairs} pairs · ${score} · updated ${updated}`,
  content: (
    <>
      <div className="flex justify-between">
        <span className="spotcheck-label">Dataset</span>
        <span className="spotcheck-label">
          {String(index + 1).padStart(2, "0")}/{String(DATASETS.length).padStart(2, "0")}
        </span>
      </div>
      <div className="spotcheck-display mt-1.5 text-[26px] leading-[.92] break-words md:text-[32px]">{name}</div>
      <div className="mt-auto">
        <div className="spotcheck-heading text-[28px] leading-none tabular-nums">{pairs}</div>
        <div className="spotcheck-label">graded pairs</div>
      </div>
      <div className="bg-wash mt-2 h-1.5">
        <div className="bg-accent-ink h-full" style={{ width: `${((score - 0.7) / 0.3) * 100}%` }} />
      </div>
      <div className="spotcheck-label">last score {score}</div>
    </>
  ),
}))

export function CoverflowDemo() {
  return <Coverflow label="Datasets" items={ITEMS} defaultValue="invoices-ocr" />
}
