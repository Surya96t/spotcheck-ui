import { Marquee } from "@/registry/spotcheck/components/spotcheck/marquee"

const ITEMS = ["Spotcheck UI", "Open source", "React", "Copy · paste · own", "Brutal type", "MIT"]

export function MarqueeDemo() {
  return <Marquee items={ITEMS} className="-mx-4" />
}
