import type { CubeFace } from "@/registry/spotcheck/components/spotcheck/cube-tabs"
import { CubeTabs } from "@/registry/spotcheck/components/spotcheck/cube-tabs"

// Invented metrics.
const METRICS = [
  { title: "Latency", value: "840", unit: "ms p50", bars: [62, 58, 66, 71, 64, 55, 52, 49], note: "Down 12% since the reranker moved in-region." },
  { title: "Cost", value: "$212", unit: "this week", bars: [40, 44, 47, 52, 55, 61, 66, 70], note: "Embeddings are 61% of spend." },
  { title: "Quality", value: "0.912", unit: "eval score", bars: [70, 72, 71, 78, 80, 83, 85, 91], note: "support-qa, 2,400 graded pairs." },
  { title: "Volume", value: "48.2k", unit: "requests / day", bars: [30, 34, 33, 38, 41, 40, 44, 48], note: "Peaks 14:00 to 16:00 IST." },
]

const FACES = METRICS.map(({ title, value, unit, bars, note }) => ({
  value: title,
  label: title,
  content: (
    <>
      <div className="flex justify-between">
        <span className="spotcheck-label">{title}</span>
        <span className="spotcheck-label">8 weeks</span>
      </div>
      <div className="spotcheck-display mt-1 text-[64px] leading-[.9] tabular-nums">{value}</div>
      <div className="spotcheck-label">{unit}</div>
      <div aria-hidden className="mt-auto flex h-15 items-end gap-1.5">
        {bars.map((bar, index) => (
          <i
            key={index}
            className={index === bars.length - 1 ? "bg-accent-ink flex-1" : "bg-ink flex-1"}
            style={{ height: `${bar}%` }}
          />
        ))}
      </div>
      <div className="text-mute pt-1.5 text-[12.5px]">{note}</div>
    </>
  ),
})) as [CubeFace, CubeFace, CubeFace, CubeFace]

export function CubeTabsDemo() {
  return <CubeTabs label="Metrics" faces={FACES} />
}
