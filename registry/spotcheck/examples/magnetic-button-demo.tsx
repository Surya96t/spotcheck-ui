import { MagneticButton } from "@/registry/spotcheck/components/spotcheck/magnetic-button"

export function MagneticButtonDemo() {
  return (
    <div className="grid border border-dashed border-[color-mix(in_srgb,var(--ink)_40%,transparent)] sm:grid-cols-2">
      <MagneticButton>Start a run</MagneticButton>
      <MagneticButton variant="accent">Deploy ↗</MagneticButton>
    </div>
  )
}
