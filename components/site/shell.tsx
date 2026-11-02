import type { ReactNode } from "react"

import { getComponents, getGuides } from "@/lib/catalog"

import { Rail } from "./rail"
import { TopBar } from "./top-bar"

export function getNavLinks() {
  return {
    components: getComponents().map(({ no, slug, page }) => ({
      no,
      name: page.data.title,
      href: `/components/${slug}`,
      group: page.data.group,
      description: page.data.description,
    })),
    guides: getGuides().map(({ no, slug, page }) => ({
      no,
      name: page.data.title,
      href: `/docs/${slug}`,
      description: page.data.description,
    })),
  }
}

export function Shell({ children }: { children: ReactNode }) {
  const links = getNavLinks()

  return (
    <div className="border-ink grid min-h-dvh border-x-(length:--rule) md:grid-cols-[13.5rem_minmax(0,1fr)]">
      <Rail components={links.components} guides={links.guides} />
      <div className="flex min-w-0 flex-col">
        <TopBar components={links.components} guides={links.guides} />
        <main id="content" className="min-w-0 grow">
          {children}
        </main>
      </div>
    </div>
  )
}
