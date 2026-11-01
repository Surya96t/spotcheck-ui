import Link from "next/link"

import { Demo } from "@/components/site/demos"
import { InstallCommand } from "@/components/site/install-command"
import { Tag } from "@/components/site/tag"
import { GROUPS, getComponents } from "@/lib/catalog"
import { BarTerrainDemo } from "@/registry/ledger/examples/bar-terrain-demo"

const PITCH =
  "Open source React components cut from a ledger: full-bleed grids, hard rules, type that sits on the baseline. Built for reviewing and auditing AI work, with real motion on everyday controls. Copy a file in and it's yours."

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="border-ink flex min-h-[76px] flex-col justify-end border-r-(length:--rule) px-3.5 pt-2.5 pb-2 last:border-r-0">
      <b className="ledger-display text-[34px] leading-none tabular-nums">{value}</b>
      <small className="ledger-label">{label}</small>
    </div>
  )
}

export default function Home() {
  const components = getComponents()

  return (
    <>
      <header className="border-ink grid border-b-(length:--rule) xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <h1 className="ledger-display border-ink flex min-h-60 items-end border-b-(length:--rule) px-4.5 pt-7 pb-4 text-[clamp(64px,11vw,168px)] leading-[.82] xl:border-r-(length:--rule) xl:border-b-0">
          <span>
            Ledger
            <br />
            <em className="text-accent-ink not-italic">/</em>UI
          </span>
        </h1>
        <div className="flex min-w-0 flex-col">
          <BarTerrainDemo className="border-ink h-62.5 border-b-(length:--rule)" />
          <p className="max-w-[44ch] grow p-4.5 text-base text-pretty">{PITCH}</p>
          <div className="border-ink grid grid-cols-3 border-t-(length:--rule)">
            <Stat value={components.length} label="Components" />
            <Stat value={3} label="Motion engines" />
            <Stat value={3} label="Skins" />
          </div>
          <InstallCommand name="roll-number" />
        </div>
      </header>

      {GROUPS.map((group) => {
        const members = components.filter(({ page }) => page.data.group === group.id)
        if (members.length === 0) return null
        return (
          <section key={group.id} aria-labelledby={`group-${group.id}`}>
            <div className="border-ink flex flex-col items-start justify-between gap-3 border-b-(length:--rule) px-4.5 pt-7.5 pb-2.5 md:flex-row md:items-end">
              <h2 id={`group-${group.id}`} className="ledger-display text-[clamp(36px,5vw,64px)] leading-[.85]">
                {group.name}
              </h2>
              <p className="text-mute max-w-[40ch] text-[13.5px] md:text-right">{group.blurb}</p>
            </div>
            {members.map(({ no, slug, page }) => (
              <article key={slug} className="border-ink border-b-(length:--rule)">
                <div className="flex items-end gap-3 border-b border-dashed border-[color-mix(in_srgb,var(--ink)_35%,transparent)] px-4 pt-4 pb-2">
                  <span className="text-mute font-(family-name:--f-mono) text-[11px] tabular-nums">{no}</span>
                  <h3 className="ledger-display grow text-2xl leading-none">
                    <Link href={`/components/${slug}`} className="hover:text-accent-ink">
                      {page.data.title}
                    </Link>
                  </h3>
                  <Tag>{page.data.engine}</Tag>
                </div>
                <p className="text-mute max-w-[62ch] px-4 pt-2 text-[13.5px]">{page.data.description}</p>
                <div className="min-w-0 px-4 py-5">
                  <Demo slug={slug} />
                </div>
              </article>
            ))}
          </section>
        )
      })}
    </>
  )
}
