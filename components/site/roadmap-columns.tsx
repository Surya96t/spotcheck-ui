import { ROADMAP } from "@/lib/roadmap"
import { cn } from "@/lib/utils"

const STYLES: Record<string, { band: string; mark: string; glyph: string }> = {
  Now: { band: "bg-accent-ink text-on-accent", mark: "text-ok", glyph: "✓" },
  Next: { band: "bg-wash", mark: "text-warn", glyph: "●" },
  Later: { band: "text-mute", mark: "text-mute", glyph: "○" },
}

/** The same list on the landing page and at /roadmap. `notes` adds the line under each item. */
export function RoadmapColumns({ notes = false }: { notes?: boolean }) {
  return (
    <div data-cells className="grid md:grid-cols-3">
      {ROADMAP.map((column) => {
        const style = STYLES[column.title]
        return (
          <section
            key={column.title}
            aria-labelledby={`roadmap-${column.title}`}
            className="border-ink min-w-0 border-b-(length:--rule) md:border-r-(length:--rule) md:last:border-r-0"
          >
            <div className={cn("border-ink flex items-end justify-between border-b-(length:--rule) px-5 py-3", style?.band)}>
              <h3 id={`roadmap-${column.title}`} className={cn("spotcheck-display leading-none", notes ? "text-6xl" : "text-[34px]")}>
                {column.title}
              </h3>
              <span className="font-(family-name:--f-mono) text-[11px] tracking-[.1em] uppercase">{column.status}</span>
            </div>
            <ul>
              {column.items.map((item) => (
                <li
                  key={item.name}
                  className={cn(
                    "flex justify-between gap-4 border-b border-dashed border-[color-mix(in_srgb,var(--ink)_22%,transparent)] px-5 last:border-b-0",
                    notes ? "py-4" : "py-2.5 font-(family-name:--f-mono) text-[13.5px]",
                  )}
                >
                  {notes ? (
                    <div>
                      <div className="text-lg font-bold">{item.name}</div>
                      <div className="text-mute mt-0.5 text-[15px]">{item.note}</div>
                    </div>
                  ) : (
                    <span>{item.name}</span>
                  )}
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
  )
}
