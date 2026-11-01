"use client"

import * as React from "react"
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

type TooltipProps = {
  /** The tooltip text. */
  content: React.ReactNode
  /** One focusable element, such as a button. */
  children: React.ReactElement<Record<string, unknown>>
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={6} className="z-50">
          <BaseTooltip.Popup
            className={cn("bg-ink text-paper px-2 py-1 font-(family-name:--f-mono) text-[11.5px]", className)}
          >
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}
