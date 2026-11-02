import * as React from "react"

import { cn } from "@/lib/utils"

type AppFrameProps = React.ComponentProps<"div"> & {
  /** Printed at the right of the window bar. */
  title?: string
}

export function AppFrame({ title, className, children, ...props }: AppFrameProps) {
  return (
    <div className={cn("border-ink bg-raise relative overflow-hidden border-(length:--rule)", className)} {...props}>
      <div className="border-ink text-mute flex items-center justify-between border-b-(length:--rule) px-2.5 py-1.5 font-(family-name:--f-mono) text-[11px]">
        <span aria-hidden className="flex gap-1">
          <i className="border-ink size-[9px] border-[1.5px]" />
          <i className="border-ink size-[9px] border-[1.5px]" />
          <i className="border-ink size-[9px] border-[1.5px]" />
        </span>
        <span>{title}</span>
      </div>
      {children}
    </div>
  )
}
