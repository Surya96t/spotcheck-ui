"use client"

import * as React from "react"

import { setAppearance } from "@/lib/appearance"
import { cn } from "@/lib/utils"

import type { ComponentLink, GuideLink } from "./nav-types"
import { SiteSearch } from "./site-search"

const CONTROLS = [
  { key: "skin", label: "Skin", options: ["ledger", "terminal", "folio"], fallback: "ledger" },
  { key: "theme", label: "Theme", options: ["system", "light", "dark"], fallback: "system" },
] as const

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributeFilter: ["data-skin", "data-theme"] })
  return () => observer.disconnect()
}

function Control({ control, compact }: { control: (typeof CONTROLS)[number]; compact: boolean }) {
  const current = React.useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset[control.key] ?? control.fallback,
    () => control.fallback,
  )

  return (
    <div className={cn("border-ink items-center gap-2.5 px-3.5 py-2 md:flex md:border-r-(length:--rule)", compact ? "hidden" : "flex")}>
      <span className="ledger-label">{control.label}</span>
      <div role="group" aria-label={control.label} className="border-ink inline-flex border-(length:--rule)">
        {control.options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={current === option}
            onClick={() => setAppearance(control.key, option)}
            className={cn(
              "border-ink cursor-pointer border-l-(length:--rule) px-2.5 py-1 capitalize first:border-l-0",
              current === option && "bg-ink text-paper",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

type TopBarProps = {
  components: ComponentLink[]
  guides: GuideLink[]
  /** Shown ahead of the controls. */
  children?: React.ReactNode
  /** Leaves the skin and theme controls out on phones. Search still offers both. */
  compact?: boolean
}

export function TopBar({ components, guides, children, compact = false }: TopBarProps) {
  return (
    <div className="border-ink bg-paper z-10 flex flex-wrap items-stretch border-b-(length:--rule) font-(family-name:--f-mono) text-xs md:sticky md:top-0">
      {children}
      {CONTROLS.map((control) => (
        <Control key={control.key} control={control} compact={compact} />
      ))}
      <SiteSearch components={components} guides={guides} />
    </div>
  )
}
