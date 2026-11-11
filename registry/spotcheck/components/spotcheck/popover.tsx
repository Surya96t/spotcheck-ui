"use client"

import { Popover as BasePopover } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"

export const Popover = BasePopover.Root
export const PopoverTrigger = BasePopover.Trigger
export const PopoverClose = BasePopover.Close

type PopoverContentProps = Omit<BasePopover.Popup.Props, "className"> & {
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  className?: string
}

export function PopoverContent({ side = "bottom", align = "start", className, ...props }: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner side={side} align={align} sideOffset={6} className="z-50">
        <BasePopover.Popup
          className={cn(
            "border-ink bg-paper text-ink max-w-[calc(100vw-2rem)] border-(length:--rule) p-3 font-(family-name:--f-body) shadow-[6px_6px_0_var(--ink)] outline-none",
            className,
          )}
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
}
