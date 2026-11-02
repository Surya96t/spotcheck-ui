import Link from "next/link"

import { Demo } from "@/components/site/demos"
import { WhenSeen } from "@/components/site/when-seen"
import { Tag } from "@/registry/spotcheck/components/spotcheck/tag"

export type PartLink = { slug: string; title: string; engine: string }

const SPECIMENS = [
  { slug: "embedding-space", span: "xl:col-span-2" },
  { slug: "swipe-review", span: "" },
  { slug: "scramble-text", span: "" },
  { slug: "coverflow", span: "xl:col-span-2" },
  { slug: "fold-report", span: "" },
  { slug: "roll-number", span: "" },
]

export function Specimens({ parts, count }: { parts: Record<string, PartLink>; count: number }) {
  return (
    <section aria-labelledby="specimens-title">
      <div className="border-ink flex flex-wrap items-end justify-between gap-3 border-b-(length:--rule) px-4 pt-10 pb-3 md:px-8 md:pt-14">
        <h2 id="specimens-title" className="landing-mask spotcheck-display text-[clamp(52px,7.4vw,108px)] leading-[.88]">
          <span data-rise>Parts with weight</span>
        </h2>
        <Link
          href="/components"
          className="border-ink hover:bg-ink hover:text-paper flex min-h-11.5 items-center border-(length:--rule) px-5 font-(family-name:--f-mono) text-xs tracking-[.1em] uppercase"
        >
          Browse all {count} →
        </Link>
      </div>
      <div className="overflow-hidden">
        <div data-cells className="-mr-(--rule) grid grid-cols-[minmax(0,1fr)] md:grid-cols-2 xl:grid-cols-4">
          {SPECIMENS.map(({ slug, span }) => {
            const part = parts[slug]
            if (!part) return null
            return (
              <article key={slug} className={`landing-cell border-ink flex min-w-0 flex-col border-b-(length:--rule) ${span}`}>
                <div className="flex items-baseline justify-between gap-2.5 px-4 pt-3">
                  <h3 className="grow text-base leading-none font-bold">
                    <Link href={`/components/${slug}`} className="hover:text-accent-ink">
                      {part.title}
                    </Link>
                  </h3>
                  <Tag>{part.engine}</Tag>
                </div>
                <WhenSeen minHeight={280} className="flex min-w-0 grow flex-col justify-end p-4">
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
