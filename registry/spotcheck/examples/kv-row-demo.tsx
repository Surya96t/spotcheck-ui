import { KvRow } from "@/registry/spotcheck/components/spotcheck/kv-row"

export function KvRowDemo() {
  return (
    <div className="max-w-80">
      <KvRow label="Context" value="200k" />
      <KvRow label="Input / 1M tokens" value="$3.00" />
      <KvRow label="p50 latency" value="840 ms" />
    </div>
  )
}
