import { Tag } from "@/registry/spotcheck/components/spotcheck/tag"

export function TagDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Tag>motion.dev</Tag>
      <Tag>three.js</Tag>
      <Tag variant="accent">AI</Tag>
    </div>
  )
}
