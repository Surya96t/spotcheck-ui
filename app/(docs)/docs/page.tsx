import type { Metadata } from "next"
import Link from "next/link"

import { InstallCommand } from "@/components/site/install-command"
import { PageTitle } from "@/components/site/page-title"
import { getGuides } from "@/lib/catalog"

export const metadata: Metadata = {
  title: "Docs",
  description: "How Spotcheck UI works, and how to add your first component.",
}

const STEPS = [
  { no: "01", text: "Run one command. It uses the shadcn CLI you already have." },
  { no: "02", text: "The source lands in components/spotcheck, in your repo." },
  { no: "03", text: "It's yours. Change it, cut it down, ship it." },
]

export default function DocsPage() {
  return (
    <>
      <PageTitle trail={[{ label: "Docs" }]} title="Introduction">
        Spotcheck UI is a set of React components you copy into your own project. There&apos;s no package to install, so
        the code is yours to change.
      </PageTitle>

      <ol className="grid md:grid-cols-3">
        {STEPS.map((step) => (
          <li
            key={step.no}
            className="border-ink flex min-h-44 flex-col justify-between gap-4 border-b-(length:--rule) px-5 py-5 md:border-r-(length:--rule) md:last:border-r-0"
          >
            <span className="spotcheck-display text-accent-ink text-6xl leading-none">{step.no}</span>
            <span className="text-pretty">{step.text}</span>
          </li>
        ))}
      </ol>

      <section aria-labelledby="first-title" className="bg-wash border-ink border-b-(length:--rule) px-4 py-7 md:px-8">
        <h2 id="first-title" className="spotcheck-display mb-4 text-[46px] leading-none">
          Add your first component
        </h2>
        <InstallCommand name="chat-screen" />
      </section>

      <div className="grid md:grid-cols-2">
        {getGuides().map(({ slug, page }) => (
          <Link
            key={slug}
            href={`/docs/${slug}`}
            className="hover:bg-accent-ink hover:text-on-accent group border-ink flex min-h-56 flex-col justify-between gap-8 border-b-(length:--rule) p-5 md:border-r-(length:--rule) md:even:border-r-0"
          >
            <span className="spotcheck-label group-hover:text-on-accent">Guide</span>
            <span>
              <span className="spotcheck-display block text-6xl leading-none">{page.data.title}</span>
              <span className="mt-2 block text-pretty">{page.data.description}</span>
            </span>
          </Link>
        ))}
      </div>
    </>
  )
}
