import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { mdxComponents } from "@/components/site/mdx"
import { PageTitle } from "@/components/site/page-title"
import { getGuides } from "@/lib/catalog"

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getGuides().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const entry = getGuides().find((guide) => guide.slug === slug)
  if (!entry) return {}
  return { title: entry.page.data.title, description: entry.page.data.description }
}

export default async function GuidePage({ params }: Params) {
  const { slug } = await params
  const entry = getGuides().find((guide) => guide.slug === slug)
  if (!entry) notFound()

  const Body = entry.page.data.body

  return (
    <article>
      <PageTitle trail={[{ label: "Docs", href: "/docs" }, { label: entry.page.data.title }]} title={entry.page.data.title}>
        {entry.page.data.description}
      </PageTitle>
      <div className="min-w-0 px-4 py-6 md:px-8">
        <Body components={mdxComponents} />
      </div>
    </article>
  )
}
