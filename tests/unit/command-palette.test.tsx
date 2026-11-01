import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { CommandPalette, filterCommands, type CommandGroup } from "@/registry/ledger/components/ledger/command-palette"

const noop = () => {}
const GROUPS: CommandGroup[] = [
  {
    label: "Actions",
    commands: [
      { id: "new", label: "New eval run", onSelect: noop },
      { id: "export", label: "Export as CSV", keywords: "download", onSelect: noop },
      { id: "review", label: "Run review", onSelect: noop },
    ],
  },
  { label: "Models", commands: [{ id: "atlas", label: "Switch to atlas-l", onSelect: noop }] },
]

const labels = (groups: CommandGroup[]) => groups.flatMap((group) => group.commands.map((command) => command.label))

describe("filterCommands", () => {
  it("returns everything for an empty query", () => {
    expect(filterCommands(GROUPS, "  ")).toBe(GROUPS)
  })

  it("puts label starts ahead of label matches", () => {
    expect(labels(filterCommands(GROUPS, "run"))).toEqual(["Run review", "New eval run"])
  })

  it("matches keywords", () => {
    expect(labels(filterCommands(GROUPS, "download"))).toEqual(["Export as CSV"])
  })

  it("matches letters in order", () => {
    expect(labels(filterCommands(GROUPS, "nrn"))).toEqual(["New eval run"])
  })

  it("drops empty groups", () => {
    expect(filterCommands(GROUPS, "atlas").map((group) => group.label)).toEqual(["Models"])
  })
})

describe("CommandPalette", () => {
  it("toggles with the hotkey", () => {
    const onOpenChange = vi.fn()
    render(<CommandPalette groups={GROUPS} open={false} onOpenChange={onOpenChange} />)
    fireEvent.keyDown(window, { key: "k", metaKey: true })
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("binds nothing when hotkey is false", () => {
    const onOpenChange = vi.fn()
    render(<CommandPalette groups={GROUPS} open={false} onOpenChange={onOpenChange} hotkey={false} />)
    fireEvent.keyDown(window, { key: "k", metaKey: true })
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it("runs the highlighted command and closes", () => {
    const onSelect = vi.fn()
    const onOpenChange = vi.fn()
    const groups = [{ label: "A", commands: [{ id: "a", label: "First", onSelect: noop }, { id: "b", label: "Second", onSelect }] }]
    render(<CommandPalette groups={groups} open onOpenChange={onOpenChange} />)
    const input = screen.getByRole("combobox")
    fireEvent.keyDown(input, { key: "ArrowDown" })
    fireEvent.keyDown(input, { key: "Enter" })
    expect(onSelect).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
