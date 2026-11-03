import Link from "next/link"

import { RoadmapColumns } from "@/components/site/roadmap-columns"

export function WhatsNext() {
  return (
    <section aria-labelledby="roadmap-title">
      <div className="border-ink flex flex-wrap items-end justify-between gap-3 border-b-(length:--rule) px-4 pt-10 pb-3 md:px-8 md:pt-14">
        <h2 id="roadmap-title" className="landing-mask spotcheck-display text-[clamp(52px,7.4vw,108px)] leading-[.88]">
          <span data-rise>What&apos;s next</span>
        </h2>
        <Link
          href="/roadmap"
          className="border-ink hover:bg-ink hover:text-paper flex min-h-11.5 items-center border-(length:--rule) px-5 font-(family-name:--f-mono) text-xs tracking-[.1em] uppercase"
        >
          Full roadmap →
        </Link>
      </div>
      <RoadmapColumns />
    </section>
  )
}
