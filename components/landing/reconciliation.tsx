import { COMPARISONS } from "@/lib/compare"

export function Reconciliation() {
  return (
    <section aria-labelledby="reconciliation-title">
      <div className="border-ink flex flex-col items-start justify-between gap-3 border-b-(length:--rule) px-4.5 pt-10 pb-3 md:flex-row md:items-end">
        <h2 id="reconciliation-title" className="spotcheck-display text-[clamp(40px,7vw,104px)] leading-[.85]">
          How it reconciles
        </h2>
        <p className="text-mute max-w-[42ch] text-[13.5px] md:text-right">
          These are good libraries, and Spotcheck isn&apos;t a replacement for them. Here&apos;s where each one fits.
        </p>
      </div>
      <dl>
        {COMPARISONS.map((row) => (
          <div
            key={row.name}
            className="border-ink grid gap-x-4 gap-y-1 border-b-(length:--rule) px-4.5 py-3.5 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,2fr)]"
          >
            <dt className="spotcheck-heading text-lg leading-tight">{row.name}</dt>
            <dd className="text-mute text-pretty">{row.theirs}</dd>
            <dd className="text-pretty">{row.ours}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
