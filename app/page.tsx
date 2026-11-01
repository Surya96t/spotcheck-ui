import type { ReactNode } from "react"

import { AppearanceControls } from "@/components/site/appearance-controls"
import { BarTerrainDemo } from "@/registry/ledger/examples/bar-terrain-demo"
import { DetentSliderDemo } from "@/registry/ledger/examples/detent-slider-demo"
import { RollNumberDemo } from "@/registry/ledger/examples/roll-number-demo"

function Spec({ no, name, tag, children }: { no: string; name: string; tag: string; children: ReactNode }) {
  return (
    <section className="border-ink flex min-w-0 flex-col border-b-(length:--rule) lg:border-r-(length:--rule) lg:last:border-r-0">
      <div className="flex items-end gap-3 border-b border-dashed border-[color-mix(in_srgb,var(--ink)_35%,transparent)] px-4 pt-4 pb-2">
        <span className="text-mute font-(family-name:--f-mono) text-[11px] tabular-nums">{no}</span>
        <h2 className="ledger-display grow text-2xl leading-none">{name}</h2>
        <span className="border-ink border-[1.5px] px-1.5 py-0.5 font-(family-name:--f-mono) text-[10px] tracking-[.12em] uppercase">
          {tag}
        </span>
      </div>
      <div className="min-w-0 grow px-4 py-5">{children}</div>
    </section>
  )
}

export default function Home() {
  return (
    <div className="border-ink mx-4 min-h-dvh border-x-(length:--rule)">
      <AppearanceControls />
      <header className="border-ink grid border-b-(length:--rule) lg:grid-cols-[1.6fr_1fr]">
        <h1 className="ledger-display border-ink flex items-end border-b-(length:--rule) px-4.5 pt-7 pb-4 text-[clamp(64px,11vw,168px)] leading-[.82] lg:border-r-(length:--rule) lg:border-b-0">
          <span>
            Ledger
            <br />
            <em className="text-accent-ink not-italic">/</em>UI
          </span>
        </h1>
        <BarTerrainDemo className="h-72 lg:h-auto lg:min-h-80" />
      </header>
      <div className="grid lg:grid-cols-2">
        <Spec no="L-01" name="Roll Number" tag="Motion">
          <RollNumberDemo />
        </Spec>
        <Spec no="L-02" name="Detent Slider" tag="motion.dev">
          <DetentSliderDemo />
        </Spec>
      </div>
    </div>
  )
}
