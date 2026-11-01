import { Button } from "@/registry/ledger/components/ledger/button"
import { KvRow } from "@/registry/ledger/components/ledger/kv-row"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/ledger/components/ledger/popover"

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button />}>Token usage</PopoverTrigger>
      <PopoverContent className="w-56">
        <KvRow label="Input" value="2,140" />
        <KvRow label="Output" value="412" />
      </PopoverContent>
    </Popover>
  )
}
