"use client"

import { setAppearance } from "@/lib/appearance"
import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { StatusPill } from "@/registry/spotcheck/components/spotcheck/status-pill"

const SKINS = [
  { id: "ledger", name: "Ledger", note: "Condensed grotesque, ink blue. The default." },
  { id: "terminal", name: "Terminal", note: "All monospace, amber on black." },
  { id: "folio", name: "Folio", note: "Serif italic display, oxblood." },
]

const ROWS = [
  { label: "atlas-l", score: "0.93" },
  { label: "atlas-m", score: "0.89" },
  { label: "atlas-s", score: "0.80" },
]

export function SkinSheet() {
  return (
    <section aria-labelledby="skins-title">
      <div className="border-ink flex flex-col items-start justify-between gap-3 border-b-(length:--rule) px-4.5 pt-10 pb-3 md:flex-row md:items-end">
        <h2 id="skins-title" className="spotcheck-display text-[clamp(40px,7vw,104px)] leading-[.85]">
          Three skins, one markup
        </h2>
        <p className="text-mute max-w-[42ch] text-[13.5px] md:text-right">
          A skin only swaps tokens, so all three run side by side here. Pick one and the whole page follows.
        </p>
      </div>
      <div className="grid md:grid-cols-3">
        {SKINS.map((skin) => (
          <article
            key={skin.id}
            data-skin={skin.id}
            className="landing-skin border-ink bg-paper text-ink flex min-w-0 flex-col gap-4 border-b-(length:--rule) p-4.5 font-(family-name:--f-body) md:border-r-(length:--rule) md:last:border-r-0"
          >
            <h3 className="spotcheck-display text-accent-ink text-[clamp(52px,7cqw,88px)] leading-[.9]">{skin.name}</h3>
            <p className="text-pretty">{skin.note}</p>
            <dl className="border-ink border-t-(length:--rule) text-sm">
              {ROWS.map((row) => (
                <div key={row.label} className="border-ink flex justify-between border-b border-dashed py-1.5">
                  <dt>{row.label}</dt>
                  <dd className="tabular-nums">{row.score}</dd>
                </div>
              ))}
            </dl>
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
