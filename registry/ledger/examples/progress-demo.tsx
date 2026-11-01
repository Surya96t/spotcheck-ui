import { Progress } from "@/registry/ledger/components/ledger/progress"

export function ProgressDemo() {
  return (
    <div className="flex max-w-105 flex-col gap-4">
      <Progress label="Embedding documents" value={64} />
      <Progress label="Waiting for a worker" />
    </div>
  )
}
