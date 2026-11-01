import { Button } from "@/registry/ledger/components/ledger/button"
import { KvRow } from "@/registry/ledger/components/ledger/kv-row"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/registry/ledger/components/ledger/sheet"

export function SheetDemo() {
  return (
    <Sheet swipeDirection="right">
      <SheetTrigger render={<Button />}>Run details</SheetTrigger>
      <SheetContent title="R-2041" description="support-qa on atlas-l">
        <KvRow label="Score" value="0.912" />
        <KvRow label="p50" value="840 ms" />
        <SheetClose render={<Button className="mt-4" />}>Close</SheetClose>
      </SheetContent>
    </Sheet>
  )
}
