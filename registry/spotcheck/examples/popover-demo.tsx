import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { KvRow } from "@/registry/spotcheck/components/spotcheck/kv-row"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/spotcheck/components/spotcheck/popover"

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
