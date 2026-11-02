"use client"

import * as React from "react"
import { Switch as BaseSwitch } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

type SwitchProps = Omit<BaseSwitch.Root.Props, "children" | "className"> & {
  /** The visible label. */
  children?: React.ReactNode
  className?: string
}

export function Switch({ children, className, ...props }: SwitchProps) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-2.5 font-(family-name:--f-mono) text-xs",
        className,
      )}
    >
      <BaseSwitch.Root
        className="spotcheck-focus border-ink bg-paper data-checked:bg-accent-ink relative h-6 w-[46px] flex-none border-(length:--rule) data-disabled:opacity-45"
        {...props}
      >
        <BaseSwitch.Thumb className="bg-ink data-checked:bg-paper absolute top-0.5 left-0.5 block size-4 transition-[left] duration-200 data-checked:left-6 motion-reduce:transition-none" />
      </BaseSwitch.Root>
      {children}
    </label>
  )
}
