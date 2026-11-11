"use client"

import * as React from "react"
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox"

import { cn } from "@/lib/utils"

type CheckboxProps = Omit<BaseCheckbox.Root.Props, "children" | "className"> & {
  /** The visible label. */
  children?: React.ReactNode
  className?: string
}

export function Checkbox({ children, className, ...props }: CheckboxProps) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2.5 font-(family-name:--f-body) text-sm", className)}>
      <BaseCheckbox.Root
        className="spotcheck-focus border-ink bg-paper data-checked:bg-ink data-checked:text-paper grid size-5 flex-none place-items-center border-(length:--rule) data-disabled:opacity-45"
        {...props}
      >
        <BaseCheckbox.Indicator className="text-xs leading-none font-bold">✓</BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {children}
    </label>
  )
}
