import * as React from "react"

import { cn } from "@/lib/utils"

export function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "border-ink bg-paper text-ink inline-block border-[1.5px] border-b-[3px] px-1.5 py-px font-(family-name:--f-mono) text-[11px]",
        className,
      )}
      {...props}
    />
  )
}
