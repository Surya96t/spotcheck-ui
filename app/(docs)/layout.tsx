import type { ReactNode } from "react"

import { DocsNav } from "@/components/site/docs-nav"
import { SiteFrame } from "@/components/site/site-frame"
import { getGuides } from "@/lib/catalog"

export default function DocsLayout({ children }: { children: ReactNode }) {
  const links = [
    { name: "Introduction", href: "/docs" },
    ...getGuides().map(({ slug, page }) => ({ name: page.data.title, href: `/docs/${slug}` })),
  ]

  return (
    <SiteFrame>
      <div className="flex h-full flex-col lg:flex-row">
        <DocsNav links={links} />
        <div className="min-w-0 grow">{children}</div>
      </div>
    </SiteFrame>
  )
}
