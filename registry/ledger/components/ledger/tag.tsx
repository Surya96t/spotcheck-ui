import * as React from "react"

import { cn } from "@/lib/utils"

type TagProps = React.ComponentProps<"span"> & {
  /** "accent" fills the tag, for the one tag on a surface that should stand out. */
  variant?: "outline" | "accent"
}

export function Tag({ variant = "outline", className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "border-ink border-[1.5px] px-1.5 py-0.5 font-(family-name:--f-mono) text-[10px] tracking-[.12em] whitespace-nowrap uppercase",
        variant === "accent" && "bg-accent-ink text-on-accent border-accent-ink",
        className,
      )}
      {...props}
    />
  )
}
