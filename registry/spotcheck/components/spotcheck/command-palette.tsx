"use client"

import * as React from "react"
import { Dialog } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"

const PLACEHOLDER = "Type a command"

export type Command = {
  id: string
  label: string
  /** Extra words to match, which are never shown. */
  keywords?: string
  /** A key hint printed at the end of the row. */
  shortcut?: string
  onSelect: () => void
}

export type CommandGroup = { label: string; commands: Command[] }

type CommandPaletteProps = {
  /** The commands, in display order. */
  groups: CommandGroup[]
  /** Whether the palette is showing. */
  open: boolean
  /** Runs when the palette should open or close. */
  onOpenChange: (open: boolean) => void
  /** Opens with Cmd or Ctrl plus this key. Pass false to bind no key. */
  hotkey?: string | false
  /** Names the dialog for screen readers. */
  label?: string
  /** Text shown in the empty input. */
  placeholder?: string
}

function isSubsequence(query: string, text: string) {
  let found = 0
  for (const char of text) {
    if (char === query[found]) found++
    if (found === query.length) return true
  }
  return false
}

/** Keeps the matching commands, with direct matches ahead of loose ones in each group. */
export function filterCommands(groups: CommandGroup[], query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return groups

  const rank = (command: Command) => {
    const label = command.label.toLowerCase()
    if (label.startsWith(needle)) return 0
    if (label.includes(needle)) return 1
    if (command.keywords?.toLowerCase().includes(needle)) return 2
    return isSubsequence(needle, label) ? 3 : null
  }

  return groups
    .map((group) => ({
      ...group,
      commands: group.commands
        .map((command) => ({ command, score: rank(command) }))
        .filter((entry): entry is { command: Command; score: number } => entry.score !== null)
        .sort((a, b) => a.score - b.score)
        .map((entry) => entry.command),
    }))
    .filter((group) => group.commands.length > 0)
}

export function CommandPalette({
  groups,
  open,
  onOpenChange,
  hotkey = "k",
  label = "Command palette",
  placeholder = PLACEHOLDER,
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState("")
  const [activeIndex, setActiveIndex] = React.useState(0)
  const input = React.useRef<HTMLInputElement>(null)
  const list = React.useRef<HTMLDivElement>(null)
  const id = React.useId()

  const visible = filterCommands(groups, query)
  const commands = visible.flatMap((group) => group.commands)
  const active = commands[activeIndex]
  const optionId = (index: number) => `${id}-option-${index}`

  React.useEffect(() => {
    if (!hotkey) return
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === hotkey) {
        event.preventDefault()
        onOpenChange(!open)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [hotkey, onOpenChange, open])

  React.useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" })
  }, [activeIndex])

  const changeOpen = (next: boolean) => {
    if (next) {
      setQuery("")
      setActiveIndex(0)
    }
    onOpenChange(next)
  }

  const run = (command: Command) => {
    onOpenChange(false)
    command.onSelect()
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const last = commands.length - 1
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((index) => Math.min(last, index + 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((index) => Math.max(0, index - 1))
    } else if (event.key === "Enter" && active) {
      event.preventDefault()
      run(active)
    }
  }

  let index = -1

  return (
    <Dialog.Root open={open} onOpenChange={changeOpen}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--ink)_30%,transparent)]" />
        <Dialog.Popup
          initialFocus={input}
          className="border-ink bg-paper text-ink fixed top-[12dvh] left-1/2 z-50 w-[min(520px,calc(100vw-2rem))] -translate-x-1/2 border-(length:--rule) shadow-[8px_8px_0_var(--ink)] transition-[translate,opacity] duration-150 outline-none data-starting-style:-translate-y-2 data-starting-style:opacity-40 motion-reduce:transition-none"
        >
          <Dialog.Title className="sr-only">{label}</Dialog.Title>
          <input
            ref={input}
            role="combobox"
            aria-expanded
            aria-autocomplete="list"
            aria-label={placeholder}
            aria-controls={`${id}-list`}
            aria-activedescendant={active ? optionId(activeIndex) : undefined}
            value={query}
            placeholder={placeholder}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={onKeyDown}
            className="border-ink placeholder:text-mute w-full border-b-(length:--rule) bg-transparent px-3.5 py-3 text-lg outline-none"
            style={{ fontFamily: "var(--f-display)", fontStretch: "80%" }}
          />
          <div
            ref={list}
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            className="max-h-[min(320px,60dvh)] overflow-auto py-1"
          >
            {visible.map((group) => (
              <div key={group.label} role="group" aria-label={group.label}>
                <div
                  aria-hidden
                  className="spotcheck-label px-3.5 pt-2 pb-0.5"
                >
                  {group.label}
                </div>
                {group.commands.map((command) => {
                  index++
                  const current = index
                  return (
                    <div
                      key={command.id}
                      id={optionId(current)}
                      role="option"
                      aria-selected={current === activeIndex}
                      onPointerMove={() => setActiveIndex(current)}
                      onClick={() => run(command)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-3 px-3.5 py-[7px] text-sm",
                        current === activeIndex && "bg-ink text-paper",
                      )}
                    >
                      <span>{command.label}</span>
                      {command.shortcut && (
                        <kbd className="border-[1.5px] border-current px-1.5 font-(family-name:--f-mono) text-[11px]">
                          {command.shortcut}
                        </kbd>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
            {commands.length === 0 && (
              <p className="text-mute p-3.5 font-(family-name:--f-mono) text-xs">
                No command matches “{query}”.
              </p>
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
