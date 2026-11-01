"use client"

import * as React from "react"

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

function useAppearance(key: "skin" | "theme", fallback: string) {
  return React.useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset[key] ?? fallback,
    () => fallback,
  )
}

function Control({ control }: { control: (typeof CONTROLS)[number] }) {
  const current = useAppearance(control.key, control.fallback)

  const choose = (option: string) => {
    document.documentElement.setAttribute(`data-${control.key}`, option)
    try {
      localStorage.setItem(`ledger-${control.key}`, option)
    } catch {
      // Storage can be blocked. The choice still applies for this page.
    }
  }

  return (
    <div className="border-ink flex items-center gap-2.5 border-r-(length:--rule) px-3.5 py-2.5 last:border-r-0">
      <span className="ledger-label">{control.label}</span>
      <div role="group" aria-label={control.label} className="border-ink inline-flex border-(length:--rule)">
        {control.options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={current === option}
            onClick={() => choose(option)}
            className={cn(
              "border-ink cursor-pointer border-l-(length:--rule) px-2.5 py-1 font-(family-name:--f-mono) text-xs capitalize first:border-l-0",
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

export function AppearanceControls() {
  return (
    <div className="border-ink bg-paper sticky top-0 z-10 flex flex-wrap border-b-(length:--rule)">
      {CONTROLS.map((control) => (
        <Control key={control.key} control={control} />
      ))}
    </div>
  )
}
