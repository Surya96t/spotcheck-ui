import * as React from "react"

import { cn } from "@/lib/utils"

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div aria-hidden className={cn("bg-wash h-4 animate-pulse motion-reduce:animate-none", className)} {...props} />
}
