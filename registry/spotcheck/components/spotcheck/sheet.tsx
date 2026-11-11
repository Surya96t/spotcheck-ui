"use client"

import * as React from "react"
import { Drawer } from "@base-ui/react/drawer"

import { cn } from "@/lib/utils"

export const Sheet = Drawer.Root
export const SheetTrigger = Drawer.Trigger
export const SheetClose = Drawer.Close

type SheetContentProps = {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function SheetContent({ title, description, className, children }: SheetContentProps) {
  return (
    <Drawer.Portal>
      <Drawer.Backdrop className="fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--ink)_30%,transparent)] opacity-[calc(1-var(--drawer-swipe-progress,0))] transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
      <Drawer.Viewport className="fixed inset-0 z-50 flex justify-end">
        <Drawer.Popup
          className={cn(
            "border-ink bg-paper text-ink h-full w-[min(24rem,calc(100vw-3rem))] touch-pan-y overflow-y-auto border-l-(length:--rule) p-5 font-(family-name:--f-body) [transform:translateX(var(--drawer-swipe-movement-x,0))] transition-transform duration-300 outline-none data-ending-style:[transform:translateX(100%)] data-starting-style:[transform:translateX(100%)] data-swiping:duration-0 motion-reduce:transition-none",
            className,
          )}
        >
          <Drawer.Content>
            <Drawer.Title className="spotcheck-heading text-2xl leading-none">{title}</Drawer.Title>
            {description && <Drawer.Description className="text-mute mt-2 text-sm">{description}</Drawer.Description>}
            {children && <div className="mt-4">{children}</div>}
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  )
}
