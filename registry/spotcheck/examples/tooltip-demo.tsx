import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { Tooltip } from "@/registry/spotcheck/components/spotcheck/tooltip"

export function TooltipDemo() {
  return (
    <Tooltip content="Runs in the background">
      <Button>Queue run</Button>
    </Tooltip>
  )
}
