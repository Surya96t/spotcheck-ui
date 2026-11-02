"use client"

import * as React from "react"

import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { CommandPalette, type CommandGroup } from "@/registry/spotcheck/components/spotcheck/command-palette"

export function CommandPaletteDemo() {
  const [open, setOpen] = React.useState(false)
  const [last, setLast] = React.useState("")

  const groups: CommandGroup[] = [
    {
      label: "Navigate",
      commands: [
        { id: "runs", label: "Go to runs", shortcut: "G R", onSelect: () => setLast("Go to runs") },
        { id: "datasets", label: "Go to datasets", shortcut: "G D", onSelect: () => setLast("Go to datasets") },
      ],
    },
    {
      label: "Actions",
      commands: [
        { id: "new", label: "New eval run", shortcut: "N", onSelect: () => setLast("New eval run") },
        { id: "compare", label: "Compare two runs", onSelect: () => setLast("Compare two runs") },
        { id: "export", label: "Export table as CSV", keywords: "download", onSelect: () => setLast("Export table as CSV") },
      ],
    },
  ]

  return (
    <div className="flex flex-col items-start gap-3.5">
      <Button variant="ink" onClick={() => setOpen(true)}>
        Open palette
      </Button>
      <span className="spotcheck-label" data-testid="palette-result">
        {last ? `Ran: ${last}` : "Arrows to move, Enter to run, Esc to close"}
      </span>
      <CommandPalette groups={groups} open={open} onOpenChange={setOpen} hotkey={false} />
    </div>
  )
}
