import type { Metadata } from "next"
import Link from "next/link"

import { ComponentIndex } from "@/components/site/component-index"
import { Demo } from "@/components/site/demos"
import { GROUPS, getComponents } from "@/lib/catalog"
import { Tag } from "@/registry/spotcheck/components/spotcheck/tag"

export const metadata: Metadata = {
  title: "Components",
  description: "Every Spotcheck component, with its group and motion engine.",
}

export default function ComponentsPage() {
  const components = getComponents()
  const rows = components.map(({ no, slug, page }) => ({
    no,
    name: page.data.title,
    href: `/components/${slug}`,
    group: GROUPS.find((group) => group.id === page.data.group)?.name ?? page.data.group,
    engine: page.data.engine,
    description: page.data.description,
  }))

  return (
    <>
      <h1 className="sr-only">All components</h1>
      <ComponentIndex rows={rows} />

      {GROUPS.map((group) => {
        const members = components.filter(({ page }) => page.data.group === group.id)
        if (members.length === 0) return null
        return (
          <section key={group.id} aria-labelledby={`group-${group.id}`}>
            <div className="border-ink flex flex-col items-start justify-between gap-3 border-b-(length:--rule) px-4.5 pt-7.5 pb-2.5 md:flex-row md:items-end">
              <h2 id={`group-${group.id}`} className="spotcheck-display text-[clamp(36px,5vw,64px)] leading-[.85]">
                {group.name}
              </h2>
              <p className="text-mute max-w-[40ch] text-[13.5px] md:text-right">{group.blurb}</p>
            </div>
            <div className="grid lg:grid-cols-2">
              {members.map(({ no, slug, page }) => (
                <article
                  key={slug}
                  className={`border-ink flex min-w-0 flex-col border-b-(length:--rule) lg:even:border-l-(length:--rule) ${
                    page.data.wide ? "lg:col-span-2" : ""
                  }`}
                >
                  <div className="flex items-end gap-3 border-b border-dashed border-[color-mix(in_srgb,var(--ink)_35%,transparent)] px-4 pt-4 pb-2">
                    <span className="text-mute font-(family-name:--f-mono) text-[11px] tabular-nums">{no}</span>
                    <h3 className="spotcheck-display grow text-2xl leading-none">
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
            </div>
          </section>
        )
      })}
    </>
  )
}
