import { Tag } from "@/registry/ledger/components/ledger/tag"

export function TagDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag>motion.dev</Tag>
      <Tag>three.js</Tag>
      <Tag variant="accent">AI</Tag>
    </div>
  )
}
