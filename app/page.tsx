import { CaseFile } from "@/components/landing/case-file"
import { Finale } from "@/components/landing/finale"
import { Hero } from "@/components/landing/hero"
import { Reconciliation } from "@/components/landing/reconciliation"
import { SkinSheet } from "@/components/landing/skin-sheet"
import { Specimens } from "@/components/landing/specimens"
import { SiteFrame } from "@/components/site/site-frame"
import { getComponents } from "@/lib/catalog"
import { Marquee } from "@/registry/spotcheck/components/spotcheck/marquee"

export default function Home() {
  const components = getComponents()
  const parts = Object.fromEntries(
    components.map(({ no, slug, page }) => [slug, { slug, no, title: page.data.title, engine: page.data.engine }]),
  )

  return (
    <SiteFrame>
      <Hero count={components.length} />
      <CaseFile parts={parts} />
      <Marquee items={components.map(({ page }) => page.data.title)} className="border-ink border-b-(length:--rule)" />
      <Specimens parts={parts} />
      <SkinSheet />
      <Reconciliation />
      <Finale count={components.length} />
    </SiteFrame>
  )
}
