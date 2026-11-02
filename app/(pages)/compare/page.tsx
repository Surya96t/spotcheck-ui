import type { Metadata } from "next"

import { PageTitle } from "@/components/site/page-title"
import { COMPARISONS } from "@/lib/compare"

export const metadata: Metadata = {
  title: "Compare",
  description: "Where Spotcheck UI fits among other React component libraries.",
}

export default function ComparePage() {
  return (
    <>
      <PageTitle trail={[{ label: "Compare" }]} title="How it fits">
        Good libraries, and Spotcheck isn&apos;t a replacement. Here&apos;s where each one fits.
      </PageTitle>
      {COMPARISONS.map((row) => (
        <article
          key={row.name}
          className="border-ink grid gap-x-8 gap-y-3 border-b-(length:--rule) px-4 py-6 md:grid-cols-[3fr_3fr_4fr] md:items-baseline md:px-8"
        >
          <h2 className="spotcheck-display text-[58px] leading-none">{row.name}</h2>
          <div>
            <div className="spotcheck-label mb-1">What it does</div>
            <div className="text-[17px] text-pretty">{row.theirs}</div>
          </div>
          <div>
            <div className="spotcheck-label text-accent-ink mb-1">How Spotcheck fits</div>
            <div className="text-[17px] text-pretty">{row.ours}</div>
          </div>
        </article>
      ))}
    </>
  )
}
