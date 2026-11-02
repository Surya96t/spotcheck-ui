import { Sparkline } from "@/registry/spotcheck/components/spotcheck/sparkline"

export function SparklineDemo() {
  return (
    <div className="grid max-w-105 grid-cols-2 gap-6">
      <Sparkline values={[30, 34, 33, 38, 41, 40, 44, 48]} label="Requests rose from 30k to 48k" />
      <Sparkline values={[1.6, 1.55, 1.5, 1.48, 1.42, 1.4, 1.35, 1.31]} label="Latency fell from 1.6s to 1.31s" />
    </div>
  )
}
