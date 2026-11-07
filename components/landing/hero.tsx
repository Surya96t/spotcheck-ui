import Link from "next/link"
import type { CSSProperties } from "react"

import { InstallCommand } from "@/components/site/install-command"

import { HeroTerrain, type TerrainPart } from "./hero-terrain"

export function Hero({ parts }: { parts: TerrainPart[] }) {
  return (
    <section
      aria-labelledby="hero-title"
      className="landing-hero border-ink bg-paper @container relative h-[max(620px,min(800px,calc(100svh-58px)))] cursor-crosshair overflow-hidden border-b-(length:--rule)"
    >
      <HeroTerrain parts={parts} label="Bar Terrain, a 3D bar field. One bar lifts out and shows a component name." />
      <div aria-hidden className="landing-shade pointer-events-none absolute inset-0" />

      <div data-hero-copy className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="max-w-[1100px] px-4 pb-6 md:px-8">
          <p data-copy className="landing-enter spotcheck-label text-ink mb-4" style={{ "--line": 2 } as CSSProperties}>
            Open source · {parts.length} components · 3 skins
          </p>
          <h1 id="hero-title" className="spotcheck-display">
            <span className="landing-line">
              <span>Pick any part.</span>
            </span>
            <span className="landing-line" style={{ "--line": 1 } as CSSProperties}>
              <span>
                Look closely<em className="text-accent-ink not-italic">.</em>
              </span>
            </span>
          </h1>
          <p data-copy className="landing-enter mt-4 max-w-[40ch] text-xl leading-snug text-pretty" style={{ "--line": 3 } as CSSProperties}>
            {parts.length} React components with hard edges, real motion and 3D. Copy the code and it&apos;s yours.
          </p>
        </div>
        <div
          className="landing-enter border-ink pointer-events-auto flex flex-wrap items-stretch border-t-(length:--rule) bg-[color-mix(in_srgb,var(--paper)_88%,transparent)]"
          style={{ "--line": 4 } as CSSProperties}
        >
          <div className="border-ink flex min-w-0 flex-[1_1_100%] items-center md:flex-[1_1_560px] md:border-r-(length:--rule)">
            <InstallCommand name="chat-screen" plain />
          </div>
          <Link
            href="/components"
            className="bg-accent-ink text-on-accent flex min-h-13 flex-[1_1_100%] items-center justify-center px-10 font-(family-name:--f-mono) text-[13px] tracking-[.1em] uppercase md:min-h-17 md:flex-none"
          >
            Browse components →
          </Link>
        </div>
      </div>
    </section>
  )
}
