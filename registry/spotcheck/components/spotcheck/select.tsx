"use client"

import { Select as BaseSelect } from "@base-ui/react/select"

import { cn } from "@/lib/utils"

export type SelectOption = { value: string; label: string }

type SelectProps = {
  /** Names the control for screen readers, unless it sits inside a Field. */
  label?: string
  options: SelectOption[]
  /** The selected value, when you control it. */
  value?: string
  /** The starting value, when it manages itself. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function Select({
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Choose",
  className,
}: SelectProps) {
  return (
    <BaseSelect.Root
      items={options}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => next !== null && onValueChange?.(next as string)}
    >
      <BaseSelect.Trigger
        aria-label={label}
        className={cn(
          "spotcheck-focus border-ink flex min-w-40 cursor-pointer items-center justify-between gap-3 border-(length:--rule) bg-transparent px-3 py-2 text-left font-(family-name:--f-body) text-sm",
          className,
        )}
      >
        <BaseSelect.Value placeholder={placeholder} />
        <BaseSelect.Icon aria-hidden className="font-(family-name:--f-mono) text-xs">
          ↓
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner alignItemWithTrigger={false} sideOffset={4} className="z-50">
          <BaseSelect.Popup className="border-ink bg-paper text-ink min-w-(--anchor-width) border-(length:--rule) font-(family-name:--f-body) shadow-[6px_6px_0_var(--ink)] outline-none">
            <BaseSelect.List className="max-h-[min(280px,var(--available-height))] overflow-auto py-1">
              {options.map((option) => (
                <BaseSelect.Item
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  className="data-highlighted:bg-ink data-highlighted:text-paper flex cursor-pointer items-center justify-between gap-3 px-3 py-1.5 text-sm outline-none"
                >
                  <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                  <BaseSelect.ItemIndicator aria-hidden>✓</BaseSelect.ItemIndicator>
                </BaseSelect.Item>
              ))}
            </BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  )
}
