"use client"

import { Menu } from "@base-ui/react/menu"

import { cn } from "@/lib/utils"

export const DropdownMenu = Menu.Root
export const DropdownMenuTrigger = Menu.Trigger

type ClassName = { className?: string }

export function DropdownMenuContent({ className, ...props }: Omit<Menu.Popup.Props, "className"> & ClassName) {
  return (
    <Menu.Portal>
      <Menu.Positioner sideOffset={6} align="start" className="z-50">
        <Menu.Popup
          className={cn(
            "border-ink bg-paper text-ink min-w-44 border-(length:--rule) py-1 shadow-[6px_6px_0_var(--ink)] outline-none",
            className,
          )}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  )
}

export function DropdownMenuItem({ className, ...props }: Omit<Menu.Item.Props, "className"> & ClassName) {
  return (
    <Menu.Item
      className={cn(
        "data-highlighted:bg-ink data-highlighted:text-paper data-disabled:text-mute cursor-pointer px-3 py-1.5 text-sm outline-none data-disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuSeparator() {
  return <div role="separator" className="bg-ink my-1 h-0.5" />
}
