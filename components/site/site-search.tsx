"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { setAppearance } from "@/lib/appearance"
import { PRODUCTS, RESOURCES } from "@/lib/nav"
import { CommandPalette, type CommandGroup } from "@/registry/spotcheck/components/spotcheck/command-palette"

import type { ComponentLink, GuideLink } from "./nav-types"

const SKINS = ["ledger", "terminal", "folio"]
const THEMES = ["system", "light", "dark"]

const title = (word: string) => word[0]?.toUpperCase() + word.slice(1)

type SiteSearchProps = { components: ComponentLink[]; guides: GuideLink[]; className?: string }

export function SiteSearch({ components, guides, className }: SiteSearchProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  const groups: CommandGroup[] = [
    {
      label: "Components",
      commands: components.map((component) => ({
        id: component.href,
        label: component.name,
        keywords: `${component.group} ${component.description}`,
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
        ...[...PRODUCTS.slice(0, 1), ...RESOURCES].map((item) => ({
          id: item.href,
          label: item.label,
          keywords: item.note,
          onSelect: () => router.push(item.href),
        })),
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
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        Search
        <kbd className="text-mute hidden font-(family-name:--f-mono) lg:inline">⌘K</kbd>
      </button>
      <CommandPalette groups={groups} open={open} onOpenChange={setOpen} label="Search" placeholder="Search components" />
    </>
  )
}
