"use client"

import * as React from "react"
import { Dialog as BaseDialog } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"

export const Dialog = BaseDialog.Root
export const DialogTrigger = BaseDialog.Trigger
export const DialogClose = BaseDialog.Close

type DialogContentProps = Omit<BaseDialog.Popup.Props, "className" | "title" | "children"> & {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function DialogContent({ title, description, className, children, ...props }: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-[color-mix(in_srgb,var(--ink)_30%,transparent)]" />
      <BaseDialog.Popup
        className={cn(
          "border-ink bg-paper text-ink fixed top-[14dvh] left-1/2 z-50 max-h-[76dvh] w-[min(480px,calc(100vw-2rem))] -translate-x-1/2 overflow-auto border-(length:--rule) p-5 shadow-[8px_8px_0_var(--ink)] transition-[translate,opacity] duration-150 outline-none data-ending-style:opacity-0 data-starting-style:-translate-y-2 data-starting-style:opacity-40 motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        <BaseDialog.Title className="ledger-heading text-2xl leading-none">{title}</BaseDialog.Title>
        {description && (
          <BaseDialog.Description className="text-mute mt-2 text-sm">{description}</BaseDialog.Description>
        )}
        {children && <div className="mt-4">{children}</div>}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  )
}
