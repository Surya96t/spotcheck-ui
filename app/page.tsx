import Link from "next/link"

import { CaseFile } from "@/components/landing/case-file"
import { Finale } from "@/components/landing/finale"
import { Hero } from "@/components/landing/hero"
import { Reconciliation } from "@/components/landing/reconciliation"
import { SkinSheet } from "@/components/landing/skin-sheet"
import { Specimens } from "@/components/landing/specimens"
import { getNavLinks } from "@/components/site/shell"
import { TopBar } from "@/components/site/top-bar"
import { getComponents } from "@/lib/catalog"
import { Marquee } from "@/registry/spotcheck/components/spotcheck/marquee"

export default function Home() {
  const components = getComponents()
  const links = getNavLinks()
  const parts = Object.fromEntries(
    components.map(({ no, slug, page }) => [slug, { slug, no, title: page.data.title, engine: page.data.engine }]),
  )

  return (
    <div className="border-ink min-h-dvh border-x-(length:--rule)">
      <header className="contents">
        <TopBar components={links.components} guides={links.guides} compact>
          <Link
            href="/"
            className="spotcheck-display border-ink flex items-center border-r-(length:--rule) px-2.5 text-xl leading-none md:px-3.5 md:text-2xl"
          >
            Spotcheck<em className="text-accent-ink not-italic">/</em>UI
          </Link>
          <Link href="/components" className="border-ink hover:bg-ink hover:text-paper flex items-center border-r-(length:--rule) px-2.5 py-2 md:px-3.5">
            Components
          </Link>
          <Link href="/docs/installation" className="border-ink hover:bg-ink hover:text-paper hidden items-center border-r-(length:--rule) px-2.5 py-2 sm:flex md:px-3.5">
            Docs
          </Link>
        </TopBar>
      </header>
      <main id="content" className="min-w-0">
        <Hero count={components.length} />
        <CaseFile parts={parts} />
        <Marquee items={components.map(({ page }) => page.data.title)} className="border-ink border-b-(length:--rule)" />
        <Specimens parts={parts} />
        <SkinSheet />
        <Reconciliation />
        <Finale count={components.length} />
      </main>
    </div>
  )
}
