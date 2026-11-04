import { Finale } from "@/components/landing/finale"
import { Hero } from "@/components/landing/hero"
import { PageMotion } from "@/components/landing/page-motion"
import { SkinSheet } from "@/components/landing/skin-sheet"
import { Specimens } from "@/components/landing/specimens"
import { SpotCheck } from "@/components/landing/spot-check"
import { WhatsNext } from "@/components/landing/whats-next"
import { SiteFrame } from "@/components/site/site-frame"
import { getComponents } from "@/lib/catalog"
import { registryItemUrl } from "@/lib/site"
import { Marquee } from "@/registry/spotcheck/components/spotcheck/marquee"

const TICKER = ["Bar Terrain", "Detent Slider", "Split-Flap Board", "Tilt Card", "Diff Review", "Coverflow", "Model Race", "Scramble Text"]

export default function Home() {
  const components = getComponents()
  const parts = Object.fromEntries(
    components.map(({ slug, page }) => [slug, { slug, title: page.data.title, engine: page.data.engine }]),
  )

  const installs = Object.fromEntries(
    components.map(({ slug, page }) => [slug, { title: page.data.title, url: registryItemUrl(slug) }]),
  )

  return (
    <SiteFrame>
      <PageMotion />
      <Hero parts={components.map(({ page }) => ({ title: page.data.title, engine: page.data.engine }))} />
      {/* The ticker skews while the page scrolls, so its corners are clipped at the screen edge. */}
      <div className="overflow-x-clip">
        <Marquee
          data-ticker
          items={TICKER}
          speed={42}
          className="bg-accent-ink text-on-accent border-ink border-t-0 border-b-(length:--rule) [&_span]:text-on-accent!"
        />
      </div>
      <SpotCheck parts={installs} />
      <Specimens parts={parts} count={components.length} />
      <SkinSheet />
      <WhatsNext />
      <Finale />
    </SiteFrame>
  )
}
