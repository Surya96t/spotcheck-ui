import type { Metadata } from "next"

import { PageTitle } from "@/components/site/page-title"
import { ROADMAP } from "@/lib/roadmap"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Roadmap",
  description: "What Spotcheck UI has shipped, what's next and what comes later.",
}

const STYLES: Record<string, { band: string; mark: string; glyph: string }> = {
  Now: { band: "bg-accent-ink text-on-accent", mark: "text-ok", glyph: "✓" },
  Next: { band: "bg-wash", mark: "text-warn", glyph: "●" },
  Later: { band: "text-mute", mark: "text-mute", glyph: "○" },
}

export default function RoadmapPage() {
  return (
    <>
      <PageTitle trail={[{ label: "Roadmap" }]} title="What's next" />
      <div className="grid md:grid-cols-3">
        {ROADMAP.map((column) => {
          const style = STYLES[column.title]
          return (
            <section
              key={column.title}
              aria-labelledby={`roadmap-${column.title}`}
              className="border-ink min-w-0 border-b-(length:--rule) md:border-r-(length:--rule) md:last:border-r-0"
            >
              <div className={cn("border-ink flex items-end justify-between border-b-(length:--rule) px-5 py-4", style?.band)}>
                <h2 id={`roadmap-${column.title}`} className="spotcheck-display text-6xl leading-none">
                  {column.title}
                </h2>
                <span className="pb-1 font-(family-name:--f-mono) text-[11px] tracking-[.1em] uppercase">{column.status}</span>
              </div>
              <ul>
                {column.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex justify-between gap-4 border-b border-dashed border-[color-mix(in_srgb,var(--ink)_22%,transparent)] px-5 py-4 last:border-b-0"
                  >
                    <div>
                      <div className="text-lg font-bold">{item.name}</div>
                      <div className="text-mute mt-0.5 text-[15px]">{item.note}</div>
                    </div>
                    <span aria-hidden className={cn("font-(family-name:--f-mono)", style?.mark)}>
                      {style?.glyph}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}
