import Link from "next/link"

import { GROUPS } from "@/lib/catalog"

import type { ComponentLink, GuideLink } from "./nav-types"
import { RailLink } from "./rail-link"

function GroupLabel({ children }: { children: string }) {
  return <div className="ledger-label hidden px-3 pt-3.5 pb-1 md:block">{children}</div>
}

export function Rail({ components, guides }: { components: ComponentLink[]; guides: GuideLink[] }) {
  return (
    <nav
      aria-label="Components"
      className="border-ink relative flex overflow-x-auto border-b-(length:--rule) font-(family-name:--f-mono) text-xs whitespace-nowrap md:sticky md:top-0 md:h-dvh md:flex-col md:overflow-x-hidden md:overflow-y-auto md:border-r-(length:--rule) md:border-b-0 md:whitespace-normal"
    >
      <Link
        href="/"
        className="ledger-display border-ink flex shrink-0 items-center border-r-(length:--rule) px-3 pt-3.5 pb-2.5 text-[28px] leading-[.9] md:block md:border-r-0 md:border-b-(length:--rule)"
      >
        Ledger
        <br />
        UI
      </Link>
      <RailLink no="All" name="All components" href="/components" />
      <GroupLabel>Guides</GroupLabel>
      {guides.map((guide) => (
        <RailLink key={guide.href} {...guide} />
      ))}
      {GROUPS.map((group) => {
        const members = components.filter((component) => component.group === group.id)
        if (members.length === 0) return null
        return (
          <div key={group.id} className="contents">
            <GroupLabel>{group.name}</GroupLabel>
            {members.map((component) => (
              <RailLink key={component.href} {...component} />
            ))}
          </div>
        )
      })}
      <div className="border-ink text-mute mt-auto hidden border-t-(length:--rule) p-3 text-[11px] md:block">
        v0.1 · MIT · React 19
      </div>
    </nav>
  )
}
