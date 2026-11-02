import { Button } from "@/registry/spotcheck/components/spotcheck/button"

export function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="ink">Deploy</Button>
      <Button variant="accent">Run eval</Button>
      <Button>Export CSV</Button>
      <Button variant="ghost">Cancel</Button>
      <Button disabled>Disabled</Button>
    </div>
  )
}
