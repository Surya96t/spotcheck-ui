import type { Metadata } from "next"
import Link from "next/link"

import { HeroTerrain } from "@/components/landing/hero-terrain"
import { Breadcrumb } from "@/components/site/page-title"
import { PartPreview } from "@/components/site/part-preview"
import { GROUPS, getComponents } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Components",
  description: "Every Spotcheck component, with its group and motion engine.",
}

export default function ComponentsPage() {
  const components = getComponents()
  const groups = GROUPS.map((group) => ({
    ...group,
    members: components.filter(({ page }) => page.data.group === group.id),
  })).filter((group) => group.members.length > 0)

  return (
    <>
      <section
        aria-labelledby="page-title"
        className="border-ink bg-paper relative h-60 cursor-crosshair overflow-hidden border-b-(length:--rule) md:h-80"
      >
        <HeroTerrain label="Bar Terrain, a 3D bar field" />
        <div aria-hidden className="landing-shade pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-6 md:px-8">
          <div className="pointer-events-auto w-fit">
            <Breadcrumb trail={[{ label: "Components" }]} />
          </div>
          <h1 id="page-title" className="spotcheck-display mt-3.5 text-[clamp(52px,8.4vw,124px)] leading-[.88]">
            {components.length} parts. Pick one.
          </h1>
        </div>
      </section>

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
          <div className="border-ink flex flex-col items-start justify-between gap-2.5 border-b-(length:--rule) px-4 pt-9 pb-3 md:flex-row md:items-end md:px-8 md:pt-11">
            <h2 id={`group-${group.id}`} className="spotcheck-display text-[clamp(44px,5.6vw,84px)] leading-[.85]">
              {group.name}
            </h2>
            <p className="text-mute max-w-[40ch] text-[15px] md:text-right">{group.blurb}</p>
          </div>
          <div className="overflow-hidden">
            <div className="-mr-(--rule) grid grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
              {group.members.map(({ slug, page }, index) => (
                <Link
                  key={slug}
                  href={`/components/${slug}`}
                  className="group/part border-ink flex min-w-0 flex-col border-r-(length:--rule) border-b-(length:--rule)"
                >
                  <PartPreview slug={slug} seed={index} />
                  <div className="flex items-baseline justify-between gap-3 border-t border-dashed border-[color-mix(in_srgb,var(--ink)_22%,transparent)] px-3 py-2.5 md:px-4">
                    <h3 className="group-hover/part:text-accent-ink text-base leading-tight font-bold">{page.data.title}</h3>
                    <span className="spotcheck-label hidden whitespace-nowrap md:inline">{page.data.engine}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
