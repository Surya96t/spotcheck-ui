"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { setAppearance } from "@/lib/appearance"
import { CommandPalette, type CommandGroup } from "@/registry/spotcheck/components/spotcheck/command-palette"

import type { ComponentLink, GuideLink } from "./nav-types"

const SKINS = ["ledger", "terminal", "folio"]
const THEMES = ["system", "light", "dark"]

const title = (word: string) => word[0]?.toUpperCase() + word.slice(1)

export function SiteSearch({ components, guides }: { components: ComponentLink[]; guides: GuideLink[] }) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const groups: CommandGroup[] = [
    {
      label: "Components",
      commands: components.map((component) => ({
        id: component.href,
        label: component.name,
        keywords: `${component.group} ${component.description}`,
        shortcut: component.no,
        onSelect: () => router.push(component.href),
      })),
    },
    {
      label: "Guides",
      commands: [
        ...guides.map((guide) => ({
          id: guide.href,
          label: guide.name,
          keywords: guide.description,
          onSelect: () => router.push(guide.href),
        })),
        { id: "/components", label: "All components", onSelect: () => router.push("/components") },
      ],
    },
    {
      label: "Appearance",
      commands: [
        ...SKINS.map((skin) => ({
          id: `skin-${skin}`,
          label: `Use ${title(skin)} skin`,
          onSelect: () => setAppearance("skin", skin),
        })),
        ...THEMES.map((theme) => ({
          id: `theme-${theme}`,
          label: `Use ${theme} theme`,
          onSelect: () => setAppearance("theme", theme),
        })),
      ],
    },
  ]

  return (
    <div className="flex min-w-0 grow items-center justify-end px-2 py-2 md:px-3.5">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-ink hover:bg-ink hover:text-paper flex cursor-pointer items-center gap-3 border-(length:--rule) px-2.5 py-1"
      >
        Search
        <kbd className="hidden text-[11px] md:inline">⌘K</kbd>
      </button>
      <CommandPalette groups={groups} open={open} onOpenChange={setOpen} label="Search" placeholder="Search components" />
    </div>
  )
}
