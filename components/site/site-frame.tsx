import type { ReactNode } from "react"

import { getComponents, getGuides } from "@/lib/catalog"

import { SiteFooter } from "./site-footer"
import { SiteNav } from "./site-nav"

function getNavLinks() {
  return {
    components: getComponents().map(({ slug, page }) => ({
      name: page.data.title,
      href: `/components/${slug}`,
      group: page.data.group,
      description: page.data.description,
    })),
    guides: getGuides().map(({ slug, page }) => ({
      name: page.data.title,
      href: `/docs/${slug}`,
      description: page.data.description,
    })),
  }
}

export function SiteFrame({ children }: { children: ReactNode }) {
  const links = getNavLinks()

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteNav components={links.components} guides={links.guides} />
      <main id="content" className="min-w-0 grow">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
