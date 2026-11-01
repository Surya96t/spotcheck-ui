"use client"

import { Combobox as BaseCombobox } from "@base-ui/react/combobox"

import { cn } from "@/lib/utils"

type ComboboxProps = {
  /** Names the input for screen readers. */
  label: string
  options: string[]
  /** The selected option, when you control it. */
  value?: string | null
  /** The starting option, when it manages itself. */
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  /** Shown when nothing matches. */
  emptyText?: string
  className?: string
}

export function Combobox({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  emptyText = "No matches.",
  className,
}: ComboboxProps) {
  return (
    <BaseCombobox.Root
      items={options}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next as string | null)}
    >
      <BaseCombobox.InputGroup
        className={cn("border-ink relative flex min-w-40 border-(length:--rule)", className)}
      >
        <BaseCombobox.Input
          aria-label={label}
          placeholder={placeholder}
          className="placeholder:text-mute min-w-0 grow bg-transparent px-3 py-2 text-sm outline-none"
        />
        <BaseCombobox.Trigger
          aria-label="Show options"
          className="ledger-focus border-ink cursor-pointer border-l-(length:--rule) px-2.5 font-(family-name:--f-mono) text-xs"
        >
          ↓
        </BaseCombobox.Trigger>
      </BaseCombobox.InputGroup>
      <BaseCombobox.Portal>
        <BaseCombobox.Positioner sideOffset={4} className="z-50">
          <BaseCombobox.Popup className="border-ink bg-paper text-ink w-(--anchor-width) border-(length:--rule) shadow-[6px_6px_0_var(--ink)]">
            <BaseCombobox.Empty className="text-mute empty:hidden px-3 py-2 font-(family-name:--f-mono) text-xs">
              {emptyText}
            </BaseCombobox.Empty>
            <BaseCombobox.List className="max-h-[min(280px,var(--available-height))] overflow-auto empty:hidden">
              {(option: string) => (
                <BaseCombobox.Item
                  key={option}
                  value={option}
                  className="data-highlighted:bg-ink data-highlighted:text-paper flex cursor-pointer items-center justify-between gap-3 px-3 py-1.5 text-sm"
                >
                  {option}
                  <BaseCombobox.ItemIndicator aria-hidden>✓</BaseCombobox.ItemIndicator>
                </BaseCombobox.Item>
              )}
            </BaseCombobox.List>
          </BaseCombobox.Popup>
        </BaseCombobox.Positioner>
      </BaseCombobox.Portal>
    </BaseCombobox.Root>
  )
}
