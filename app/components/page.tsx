import type { Metadata } from "next"

import { ComponentIndex } from "@/components/site/component-index"
import { GROUPS, getComponents } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Components",
  description: "Every Ledger component, with its group and motion engine.",
}

export default function ComponentsPage() {
  const rows = getComponents().map(({ no, slug, page }) => ({
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
    </>
  )
}
