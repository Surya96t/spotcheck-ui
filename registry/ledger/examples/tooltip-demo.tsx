import { Button } from "@/registry/ledger/components/ledger/button"
import { Tooltip } from "@/registry/ledger/components/ledger/tooltip"

export function TooltipDemo() {
  return (
    <Tooltip content="Runs in the background">
      <Button>Queue run</Button>
    </Tooltip>
  )
}
