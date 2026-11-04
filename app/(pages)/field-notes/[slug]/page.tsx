import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { mdxComponents } from "@/components/site/mdx"
import { PageTitle } from "@/components/site/page-title"
import { getFieldNotes } from "@/lib/catalog"
import { formatNoteDate } from "@/lib/field-notes"

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getFieldNotes().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const entry = getFieldNotes().find((note) => note.slug === slug)
  if (!entry) return {}
  return { title: entry.page.data.title, description: entry.page.data.description }
}

export default async function FieldNotePage({ params }: Params) {
  const { slug } = await params
  const entry = getFieldNotes().find((note) => note.slug === slug)
  if (!entry) notFound()

  const Body = entry.page.data.body

  return (
    <article>
      <PageTitle trail={[{ label: "Field notes", href: "/field-notes" }, { label: entry.page.data.title }]} title={entry.page.data.title}>
        {entry.page.data.description}
      </PageTitle>
      <div className="min-w-0 px-4 py-6 md:px-8">
        <p className="spotcheck-label mb-5">
          {entry.no} · <time dateTime={entry.page.data.date}>{formatNoteDate(entry.page.data.date)}</time>
        </p>
        <Body components={mdxComponents} />
      </div>
    </article>
  )
}
