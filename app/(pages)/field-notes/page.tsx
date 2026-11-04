import type { Metadata } from "next"
import Link from "next/link"

import { PageTitle } from "@/components/site/page-title"
import { getFieldNotes } from "@/lib/catalog"
import { formatNoteDate } from "@/lib/field-notes"

export const metadata: Metadata = {
  title: "Field notes",
  description: "Notes on how the components were made, and why.",
}

export default function FieldNotesPage() {
  return (
    <>
      <PageTitle trail={[{ label: "Field notes" }]} title="Field notes">
        Notes on how the components were made, and why.
      </PageTitle>
      <div className="grid md:grid-cols-2">
        {getFieldNotes().map(({ slug, no, page }) => (
          <Link
            key={slug}
            href={`/field-notes/${slug}`}
            className="hover:bg-accent-ink hover:text-on-accent group border-ink flex min-h-64 flex-col justify-between gap-8 border-b-(length:--rule) p-5 md:border-r-(length:--rule) md:even:border-r-0 md:p-6"
          >
            <span className="spotcheck-label group-hover:text-on-accent">
              {no} · {formatNoteDate(page.data.date)}
            </span>
            <span>
              <span className="spotcheck-display block text-[clamp(40px,4.6vw,64px)] leading-[.92] text-balance">
                {page.data.title}
              </span>
              <span className="mt-2.5 block max-w-[52ch] text-pretty">{page.data.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
