"use client"

import * as React from "react"

import { CommandPalette, type CommandGroup } from "@/registry/ledger/components/ledger/command-palette"

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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-ink text-paper border-ink cursor-pointer border-(length:--rule) px-4 py-2.5 font-(family-name:--f-mono) text-[12.5px] font-semibold tracking-[.06em] uppercase shadow-[4px_4px_0_var(--ink)] active:translate-x-1 active:translate-y-1 active:shadow-none"
      >
        Open palette
      </button>
      <span className="ledger-label" data-testid="palette-result">
        {last ? `Ran: ${last}` : "Arrows to move, Enter to run, Esc to close"}
      </span>
      <CommandPalette groups={groups} open={open} onOpenChange={setOpen} hotkey={false} />
    </div>
  )
}
