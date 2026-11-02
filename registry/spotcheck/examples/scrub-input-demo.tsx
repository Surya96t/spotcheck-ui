import { ScrubInput } from "@/registry/spotcheck/components/spotcheck/scrub-input"

export function ScrubInputDemo() {
  return (
    <div className="flex flex-wrap gap-8">
      <ScrubInput label="Max tokens" defaultValue={1200} min={0} max={4000} step={50} />
      <ScrubInput label="Top P" defaultValue={0.9} min={0} max={1} step={0.05} />
      <ScrubInput label="Timeout" defaultValue={30} min={1} max={120} unit="s" />
    </div>
  )
}
