"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import type { BarPick, HeightSource, TerrainCamera } from "@/registry/spotcheck/components/spotcheck/bar-terrain"

const BarTerrain = dynamic(
  () => import("@/registry/spotcheck/components/spotcheck/bar-terrain").then((module) => module.BarTerrain),
  { ssr: false },
)

const CAMERA: TerrainCamera = { fov: 34, position: [10, 9.5, 21], near: 0.1, far: 200 }
const LOOK_AT: [number, number, number] = [4.5, 0.2, 0]
const FADE = { near: 16, far: 52 }
const PEAK = 2.4
const WIDE_GRID = { cols: 110, rows: 64 }
const SMALL_GRID = { cols: 60, rows: 40 }
const SMALL_SCREEN = "(width < 48rem)"

const source: HeightSource = (col, row, time) =>
  0.12 +
  1.7 * Math.pow(0.5 + 0.5 * Math.sin(col * 0.36 + time * 0.8) * Math.cos(row * 0.47 - time * 0.55), 2.4) +
  2.2 * Math.pow(0.5 + 0.5 * Math.sin(col * 0.085 + time * 0.22) * Math.cos(row * 0.12 - time * 0.17), 2)

export type TerrainPart = { title: string; engine: string }

/** Bar Terrain behind a page title. When `parts` is set, the lifted bar shows a component's name. */
export function HeroTerrain({ parts, label }: { parts?: TerrainPart[]; label: string }) {
  // Only the client-only BarTerrain reads this, so it can't cause a hydration mismatch.
  const [grid] = React.useState(() => (typeof window !== "undefined" && window.matchMedia(SMALL_SCREEN).matches ? SMALL_GRID : WIDE_GRID))
  const tag = React.useRef<HTMLDivElement>(null)
  const name = React.useRef<HTMLSpanElement>(null)
  const engine = React.useRef<HTMLSpanElement>(null)
  const shown = React.useRef(-1)

  const onPick = React.useCallback(
    (pick: BarPick | null) => {
      const element = tag.current
      if (!element || !parts?.length) return
      if (!pick) {
        element.style.opacity = "0"
        return
      }
      const index = (pick.col * 7 + pick.row * 13) % parts.length
      const part = parts[index]
      if (part && index !== shown.current) {
        shown.current = index
        if (name.current) name.current.textContent = part.title
        if (engine.current) engine.current.textContent = part.engine
      }
      element.style.transform = `translate(${pick.x.toFixed(1)}px, ${pick.y.toFixed(1)}px)`
      element.style.opacity = String(Math.max(0, Math.min(1, (pick.strength - 0.5) * 3)))
    },
    [parts],
  )

  return (
    <>
      <BarTerrain
        cols={grid.cols}
        rows={grid.rows}
        source={source}
        camera={CAMERA}
        lookAt={LOOK_AT}
        fade={FADE}
        peak={PEAK}
        pointerRadius={0.9}
        pointerLift={5}
        pauseWhenSlow
        autoPick={Boolean(parts)}
        onPick={parts ? onPick : undefined}
        label={label}
        className="absolute inset-0 h-auto"
      />
      {parts && (
        <div ref={tag} aria-hidden className="pointer-events-none absolute top-0 left-0 opacity-0 will-change-transform">
          <div className="border-ink bg-paper absolute bottom-0 left-0 -translate-x-1/2 -translate-y-5.5 border-(length:--rule) px-2.5 py-1.5 font-(family-name:--f-mono) text-[12.5px] whitespace-nowrap shadow-[4px_4px_0_var(--accent-ink)]">
            <span ref={name} className="font-semibold" />
            <span ref={engine} className="text-mute ml-2" />
          </div>
          <div className="bg-ink absolute bottom-0 -left-px h-5.5 w-0.5" />
        </div>
      )}
    </>
  )
}
