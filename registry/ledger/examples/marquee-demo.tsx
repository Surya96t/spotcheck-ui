import { Marquee } from "@/registry/ledger/components/ledger/marquee"

const ITEMS = ["Ledger UI", "Open source", "React", "Copy · paste · own", "Brutal type", "MIT"]

export function MarqueeDemo() {
  return <Marquee items={ITEMS} className="-mx-4" />
}
