import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { mdxComponents } from "@/components/site/mdx"
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
      <header className="border-ink border-b-(length:--rule) px-4 pt-7 pb-4">
        <span className="text-mute font-(family-name:--f-mono) text-[11px] tabular-nums">{entry.no}</span>
        <h1 className="ledger-display mt-3 text-[clamp(44px,7vw,96px)] leading-[.85]">{entry.page.data.title}</h1>
        <p className="text-mute mt-3 max-w-[62ch] text-pretty">{entry.page.data.description}</p>
      </header>
      <div className="min-w-0 px-4 py-6">
        <Body components={mdxComponents} />
      </div>
    </article>
  )
}
