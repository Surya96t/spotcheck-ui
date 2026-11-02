"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export type DocsLink = { name: string; href: string }

export function DocsNav({ links }: { links: DocsLink[] }) {
  const path = usePathname()

  return (
    <nav aria-label="Docs" className="border-ink flex-none border-b-(length:--rule) lg:w-60 lg:border-r-(length:--rule) lg:border-b-0">
      <div className="lg:sticky lg:top-[58px]">
        <div className="spotcheck-label px-4 pt-4 pb-2">Getting started</div>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={path === link.href ? "page" : undefined}
            className={cn(
              "hover:text-accent-ink flex min-h-10 items-center border-b border-dashed border-[color-mix(in_srgb,var(--ink)_20%,transparent)] px-4 font-(family-name:--f-mono) text-[12.5px]",
              path === link.href && "bg-accent-ink text-on-accent hover:text-on-accent font-semibold",
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  )
}
