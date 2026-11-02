"use client"

import * as React from "react"

import { setAppearance } from "@/lib/appearance"
import { cn } from "@/lib/utils"

const CONTROLS = [
  { key: "skin", label: "Skin", options: ["ledger", "terminal", "folio"], fallback: "ledger" },
  { key: "theme", label: "Theme", options: ["system", "light", "dark"], fallback: "system" },
] as const

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributeFilter: ["data-skin", "data-theme"] })
  return () => observer.disconnect()
}

function Control({ control }: { control: (typeof CONTROLS)[number] }) {
  const current = React.useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset[control.key] ?? control.fallback,
    () => control.fallback,
  )

  return (
    <div>
      <div className="spotcheck-label mb-1.5">{control.label}</div>
      <div role="group" aria-label={control.label} className="border-ink grid grid-cols-3 border-(length:--rule)">
        {control.options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={current === option}
            onClick={() => setAppearance(control.key, option)}
            className={cn(
              "border-ink hover:bg-wash min-h-10 cursor-pointer border-l-(length:--rule) px-2 font-(family-name:--f-mono) text-xs capitalize first:border-l-0",
              current === option && "bg-accent-ink text-on-accent hover:bg-accent-ink",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export function AppearanceControls() {
  return (
    <div className="flex flex-col gap-3">
      {CONTROLS.map((control) => (
        <Control key={control.key} control={control} />
      ))}
    </div>
  )
}
