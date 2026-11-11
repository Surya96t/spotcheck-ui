import * as React from "react"

import { cn } from "@/lib/utils"

type KvRowProps = Omit<React.ComponentProps<"div">, "children"> & {
  label: string
  value: React.ReactNode
}

export function KvRow({ label, value, className, ...props }: KvRowProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-end justify-between gap-2.5 border-b border-[color-mix(in_srgb,var(--ink)_18%,transparent)] pt-2 pb-[3px] font-(family-name:--f-body) text-[13.5px]",
        className,
      )}
      {...props}
    >
      <span className="text-mute font-(family-name:--f-mono) text-[11px] tracking-[.06em] uppercase">{label}</span>
      <b className="spotcheck-heading text-xl tabular-nums">{value}</b>
    </div>
  )
}
