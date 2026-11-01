"use client"

import dynamic from "next/dynamic"

const DEMOS = {
  "roll-number": dynamic(() =>
    import("@/registry/ledger/examples/roll-number-demo").then((module) => module.RollNumberDemo),
  ),
  "detent-slider": dynamic(() =>
    import("@/registry/ledger/examples/detent-slider-demo").then((module) => module.DetentSliderDemo),
  ),
  "command-palette": dynamic(() =>
    import("@/registry/ledger/examples/command-palette-demo").then((module) => module.CommandPaletteDemo),
  ),
  "bar-terrain": dynamic(
    () => import("@/registry/ledger/examples/bar-terrain-demo").then((module) => module.BarTerrainDemo),
    { ssr: false },
  ),
}

export function Demo({ slug }: { slug: string }) {
  const Component = DEMOS[slug as keyof typeof DEMOS]
  if (!Component) throw new Error(`No demo for ${slug}. Add it to components/site/demos.tsx.`)
  return <Component />
}
