"use client"

import { Tabs as BaseTabs } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"

export const Tabs = BaseTabs.Root

type ClassName = { className?: string }

export function TabsList({ className, children, ...props }: Omit<BaseTabs.List.Props, "className"> & ClassName) {
  return (
    <BaseTabs.List
      className={cn("border-ink relative flex [scrollbar-width:none] overflow-x-auto border-b-(length:--rule)", className)}
      {...props}
    >
      {children}
      <BaseTabs.Indicator
        renderBeforeHydration
        className="bg-accent-ink absolute bottom-0 left-(--active-tab-left) h-[5px] w-(--active-tab-width) transition-[left,width] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none"
      />
    </BaseTabs.List>
  )
}

export function TabsTab({ className, ...props }: Omit<BaseTabs.Tab.Props, "className"> & ClassName) {
  return (
    <BaseTabs.Tab
      className={cn(
        "ledger-heading ledger-focus text-mute data-active:text-ink cursor-pointer px-3.5 pt-2 pb-2.5 text-lg whitespace-nowrap -outline-offset-2",
        className,
      )}
      {...props}
    />
  )
}

export function TabsPanel({ className, ...props }: Omit<BaseTabs.Panel.Props, "className"> & ClassName) {
  return <BaseTabs.Panel className={cn("ledger-focus pt-3.5", className)} {...props} />
}
