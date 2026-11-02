"use client"

import { setAppearance } from "@/lib/appearance"
import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { StatusPill } from "@/registry/spotcheck/components/spotcheck/status-pill"

const SKINS = [
  { id: "ledger", name: "Ledger", note: "Condensed grotesque, ink blue." },
  { id: "terminal", name: "Terminal", note: "All monospace, amber on black." },
  { id: "folio", name: "Folio", note: "Serif italic display, oxblood." },
]

export function SkinSheet() {
  return (
    <section aria-labelledby="skins-title">
      <div className="border-ink flex flex-col items-start justify-between gap-3 border-b-(length:--rule) px-4 pt-10 pb-3 md:flex-row md:items-end md:px-8 md:pt-14">
        <h2 id="skins-title" className="landing-mask spotcheck-display text-[clamp(52px,7.4vw,108px)] leading-[.88]">
          <span data-rise>Three skins, one markup</span>
        </h2>
        <p data-copy className="text-mute max-w-[26ch] text-[15px]">
          Pick one and the page follows.
        </p>
      </div>
      <div data-cells className="grid md:grid-cols-3">
        {SKINS.map((skin) => (
          <article
            key={skin.id}
            data-skin={skin.id}
            className="landing-skin border-ink bg-paper text-ink flex min-w-0 flex-col gap-4 border-b-(length:--rule) p-4.5 font-(family-name:--f-body) md:border-r-(length:--rule) md:last:border-r-0"
          >
            <h3 className="spotcheck-display text-accent-ink text-[clamp(52px,7cqw,88px)] leading-[.9]">{skin.name}</h3>
            <p data-copy className="text-pretty">{skin.note}</p>
            <div className="mt-auto flex flex-wrap items-center gap-3">
              <Button variant="accent" onClick={() => setAppearance("skin", skin.id)}>
                Use {skin.name}
              </Button>
              <StatusPill tone="ok">Passing</StatusPill>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
