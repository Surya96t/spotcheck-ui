"use client"

import { Radio } from "@base-ui/react/radio"
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group"

import { cn } from "@/lib/utils"

export type RadioOption = { value: string; label: string }

type RadioGroupProps = {
  /** Names the group for screen readers. */
  label: string
  options: RadioOption[]
  /** The selected option, when you control it. */
  value?: string
  /** The starting option, when it manages itself. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
}

export function RadioGroup({ label, options, value, defaultValue, onValueChange, className }: RadioGroupProps) {
  return (
    <BaseRadioGroup
      aria-label={label}
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next) => onValueChange?.(next as string)}
      className={cn("flex flex-col gap-2", className)}
    >
      {options.map((option) => (
        <label key={option.value} className="inline-flex cursor-pointer items-center gap-2.5 text-sm">
          <Radio.Root
            value={option.value}
            className="spotcheck-focus border-ink bg-paper grid size-5 flex-none place-items-center border-(length:--rule)"
          >
            <Radio.Indicator className="bg-accent-ink block size-2.5" />
          </Radio.Root>
          {option.label}
        </label>
      ))}
    </BaseRadioGroup>
  )
}
