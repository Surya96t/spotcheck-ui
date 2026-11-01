import { StatusPill } from "@/registry/ledger/components/ledger/status-pill"

export function StatusPillDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <StatusPill tone="ok">pass</StatusPill>
      <StatusPill tone="warn">drift</StatusPill>
      <StatusPill tone="bad">fail</StatusPill>
      <StatusPill>queued</StatusPill>
    </div>
  )
}
