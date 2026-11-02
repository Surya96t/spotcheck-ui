import Link from "next/link"

import { Demo } from "@/components/site/demos"
import { Tag } from "@/registry/spotcheck/components/spotcheck/tag"

import type { PartLink } from "./case-file"
import { WhenSeen } from "@/components/site/when-seen"

const SPECIMENS = [
  { slug: "detent-slider", span: "xl:col-span-2" },
  { slug: "hold-button", span: "" },
  { slug: "scrub-input", span: "" },
  { slug: "split-flap", span: "xl:col-span-2" },
  { slug: "magnetic-button", span: "" },
  { slug: "scramble-text", span: "" },
  { slug: "ripple-heatmap", span: "xl:col-span-2" },
  { slug: "draw-chart", span: "xl:col-span-2" },
]

export function Specimens({ parts }: { parts: Record<string, PartLink & { engine: string }> }) {
  return (
    <section aria-labelledby="specimens-title">
      <div className="border-ink flex flex-col items-start justify-between gap-3 border-b-(length:--rule) px-4.5 pt-10 pb-3 md:flex-row md:items-end">
        <h2 id="specimens-title" className="spotcheck-display text-[clamp(40px,7vw,104px)] leading-[.85]">
          Parts with weight
        </h2>
        <p className="text-mute max-w-[42ch] text-[13.5px] md:text-right">
          The everyday controls get real motion too. Try them. Each one falls back to a still frame under reduced motion.
        </p>
      </div>
      <div className="overflow-hidden">
        <div className="-mr-(--rule) grid grid-cols-[minmax(0,1fr)] md:grid-cols-2 xl:grid-cols-4">
          {SPECIMENS.map(({ slug, span }) => {
            const part = parts[slug]
            if (!part) return null
            return (
              <article
                key={slug}
                className={`landing-cell border-ink flex min-w-0 flex-col border-b-(length:--rule) ${span}`}
              >
                <div className="flex items-baseline gap-2.5 px-3.5 pt-3">
                  <span className="text-mute font-(family-name:--f-mono) text-[11px] tabular-nums">{part.no}</span>
                  <h3 className="spotcheck-heading grow text-base leading-none">
                    <Link href={`/components/${slug}`} className="hover:text-accent-ink">
                      {part.title}
                    </Link>
                  </h3>
                  <Tag>{part.engine}</Tag>
                </div>
                <WhenSeen minHeight={150} className="flex min-w-0 grow flex-col justify-end p-3.5">
                  <Demo slug={slug} />
                </WhenSeen>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
