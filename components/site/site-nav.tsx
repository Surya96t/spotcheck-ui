"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { PRODUCTS, RESOURCES, type NavItem } from "@/lib/nav"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/registry/spotcheck/components/spotcheck/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/spotcheck/components/spotcheck/popover"
import { Sheet, SheetContent, SheetTrigger } from "@/registry/spotcheck/components/spotcheck/sheet"

import { AppearanceControls } from "./appearance-controls"
import type { ComponentLink, GuideLink } from "./nav-types"
import { SiteSearch } from "./site-search"

const CELL =
  "border-ink hover:bg-ink hover:text-paper data-popup-open:bg-ink data-popup-open:text-paper data-[current=true]:bg-ink data-[current=true]:text-paper flex h-14 cursor-pointer items-center gap-1.5 px-4.5 font-(family-name:--f-mono) text-xs tracking-[.08em] whitespace-nowrap uppercase"
const POPUP = "shadow-[6px_6px_0_var(--accent-ink)]"

function NavMenu({ label, items, current }: { label: string; items: NavItem[]; current: boolean }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className={`${CELL} border-r-(length:--rule)`} data-current={current}>
        {label} <span aria-hidden>▾</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`${POPUP} w-85 py-0`}>
        {items.map((item) => (
          <DropdownMenuItem
            key={item.href}
            render={<Link href={item.href} />}
            className="data-highlighted:bg-accent-ink data-highlighted:text-on-accent block border-b border-dashed border-[color-mix(in_srgb,var(--ink)_25%,transparent)] px-3.5 py-2.5 last:border-b-0"
          >
            <span className="block font-bold">{item.label}</span>
            <span className="block text-[13.5px] opacity-80">{item.note}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function PhoneMenu() {
  const [open, setOpen] = React.useState(false)
  const close = () => setOpen(false)
  const link = "hover:text-accent-ink flex min-h-11 items-center border-b border-dashed border-[color-mix(in_srgb,var(--ink)_25%,transparent)]"

  return (
    <Sheet open={open} onOpenChange={setOpen} swipeDirection="right">
      <SheetTrigger className={`${CELL} border-l-(length:--rule)`}>Menu</SheetTrigger>
      <SheetContent title="Menu">
        <nav aria-label="Menu" className="flex flex-col gap-5">
          <div>
            <div className="spotcheck-label mb-1">Products</div>
            {PRODUCTS.map((item) => (
              <Link key={item.href} href={item.href} onClick={close} className={link}>
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <div className="spotcheck-label mb-1">Resources</div>
            {RESOURCES.map((item) => (
              <Link key={item.href} href={item.href} onClick={close} className={link}>
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <Link href="/docs" onClick={close} className={link}>
              Docs
            </Link>
            <Link href="/support" onClick={close} className={link}>
              Support
            </Link>
          </div>
        </nav>
        <div className="mt-6">
          <AppearanceControls />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function SiteNav({ components, guides }: { components: ComponentLink[]; guides: GuideLink[] }) {
  const path = usePathname()
  const under = (...roots: string[]) => roots.some((root) => path === root || path.startsWith(`${root}/`))

  return (
    <header className="border-ink bg-paper sticky top-0 z-40 border-b-(length:--rule)">
      <nav aria-label="Main" className="flex items-stretch">
        <Link
          href="/"
          aria-label="Spotcheck UI home"
          className="spotcheck-display border-ink flex items-center border-r-(length:--rule) px-3.5 text-[27px] leading-none md:px-5"
        >
          Spotcheck<em className="text-accent-ink not-italic">/</em>UI
        </Link>
        <div className="hidden items-stretch lg:flex">
          <NavMenu label="Products" items={PRODUCTS} current={under("/components")} />
          <NavMenu label="Resources" items={RESOURCES} current={under("/roadmap", "/compare")} />
          <Link href="/docs" data-current={under("/docs")} className={`${CELL} border-r-(length:--rule)`}>
            Docs
          </Link>
          <Link href="/support" data-current={under("/support")} className={`${CELL} border-r-(length:--rule)`}>
            Support
          </Link>
        </div>
        <div className="grow" />
        <SiteSearch components={components} guides={guides} className={`${CELL} border-l-(length:--rule)`} />
        <div className="hidden lg:flex">
          <Popover>
            <PopoverTrigger className={`${CELL} border-l-(length:--rule)`}>
              Skin <span aria-hidden>▾</span>
            </PopoverTrigger>
            <PopoverContent align="end" className={`${POPUP} w-72`}>
              <AppearanceControls />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex lg:hidden">
          <PhoneMenu />
        </div>
      </nav>
    </header>
  )
}
