import type { Metadata } from "next"
import Link from "next/link"

import { Demo } from "@/components/site/demos"
import { HoldAnchor } from "@/components/site/hold-anchor"
import { Breadcrumb } from "@/components/site/page-title"
import { WhenSeen } from "@/components/site/when-seen"
import { GROUPS, getComponents } from "@/lib/catalog"
import { Tag } from "@/registry/spotcheck/components/spotcheck/tag"

export const metadata: Metadata = {
  title: "Components",
  description: "Every Spotcheck component, live, with its group and motion engine.",
}

export default function ComponentsPage() {
  const components = getComponents()
  const groups = GROUPS.map((group) => ({
    ...group,
    members: components.filter(({ page }) => page.data.group === group.id),
  })).filter((group) => group.members.length > 0)

  return (
    <>
      <HoldAnchor />
      <header className="border-ink border-b-(length:--rule) px-4 pt-6 pb-5 md:px-8">
        <Breadcrumb trail={[{ label: "Components" }]} />
        <h1 className="spotcheck-display mt-4 text-[clamp(52px,8.4vw,124px)] leading-[.88]">
          {components.length} parts. Pick one.
        </h1>
      </header>

      <nav
        aria-label="Groups"
        className="border-ink bg-paper sticky top-[58px] z-20 flex overflow-x-auto border-b-(length:--rule) [scrollbar-width:none]"
      >
        {groups.map((group) => (
          <a
            key={group.id}
            href={`#${group.id}`}
            className="border-ink hover:bg-accent-ink hover:text-on-accent flex min-h-11 flex-none items-center gap-1.5 border-r-(length:--rule) px-3.5 font-(family-name:--f-mono) text-xs tracking-[.08em] uppercase"
          >
            {group.name}
            <span className="opacity-60">{group.members.length}</span>
          </a>
        ))}
      </nav>

      {groups.map((group) => (
        <section key={group.id} id={group.id} aria-labelledby={`group-${group.id}`} className="scroll-mt-[104px]">
          <div className="border-ink flex flex-col items-start justify-between gap-3 border-b-(length:--rule) px-4 pt-10 pb-3 md:flex-row md:items-end md:px-8">
            <h2 id={`group-${group.id}`} className="spotcheck-display text-[clamp(44px,5.6vw,84px)] leading-[.85]">
              {group.name}
            </h2>
            <p className="text-mute max-w-[40ch] text-[15px] md:text-right">{group.blurb}</p>
          </div>
          <div className="grid lg:grid-cols-2">
            {group.members.map(({ slug, page }) => (
              <article
                key={slug}
                className={`border-ink flex min-w-0 flex-col border-b-(length:--rule) lg:even:border-l-(length:--rule) ${
                  page.data.wide ? "lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-baseline justify-between gap-3 px-4 pt-3.5 md:px-5">
                  <h3 className="grow text-base leading-none font-bold">
                    <Link href={`/components/${slug}`} className="hover:text-accent-ink">
                      {page.data.title}
                    </Link>
                  </h3>
                  <Tag>{page.data.engine}</Tag>
                </div>
                <WhenSeen minHeight={220} className="min-w-0 px-4 py-5 md:px-5">
                  <Demo slug={slug} />
                </WhenSeen>
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
