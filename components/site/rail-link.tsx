"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function RailLink({ no, name, href }: { no: string; name: string; href: string }) {
  const current = usePathname() === href
  const link = React.useRef<HTMLAnchorElement>(null)

  // On phones the rail is one long row, so bring the current page into view.
  React.useEffect(() => {
    const element = link.current
    const nav = element?.closest("nav")
    if (!current || !element || !nav || nav.scrollWidth <= nav.clientWidth) return
    nav.scrollTo({ left: element.offsetLeft - nav.clientWidth / 3 })
  }, [current])

  return (
    <Link
      ref={link}
      href={href}
      aria-current={current ? "page" : undefined}
      className={cn(
        "group hover:bg-ink hover:text-paper flex shrink-0 items-center gap-2.5 px-3 py-[5px] md:items-baseline",
        current && "bg-ink text-paper",
      )}
    >
      <span
        className={cn(
          "w-[2.6em] flex-none tabular-nums",
          current ? "text-paper" : "text-mute group-hover:text-paper",
        )}
      >
        {no}
      </span>
      <span>{name}</span>
    </Link>
  )
}
