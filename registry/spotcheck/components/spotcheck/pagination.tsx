"use client"

import { cn } from "@/lib/utils"

const SIBLINGS = 1

/** Page numbers to show, with "gap" where a run of pages is skipped. */
export function pageRange(page: number, pageCount: number) {
  const pages: (number | "gap")[] = []
  for (let current = 1; current <= pageCount; current++) {
    const shown = current === 1 || current === pageCount || Math.abs(current - page) <= SIBLINGS
    if (shown) pages.push(current)
    else if (pages.at(-1) !== "gap") pages.push("gap")
  }
  return pages
}

const CELL =
  "spotcheck-focus border-ink min-w-9 border-l-(length:--rule) px-2.5 py-1.5 text-center first:border-l-0"

type PaginationProps = {
  /** The current page, counted from 1. */
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, pageCount, onPageChange, className }: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "border-ink inline-flex border-(length:--rule) font-(family-name:--f-mono) text-xs tabular-nums",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={cn(CELL, "cursor-pointer disabled:cursor-not-allowed disabled:opacity-45")}
      >
        ←
      </button>
      {pageRange(page, pageCount).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} aria-hidden className={cn(CELL, "text-mute")}>
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-label={`Page ${item}`}
            aria-current={item === page ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={cn(CELL, "cursor-pointer", item === page && "bg-ink text-paper")}
          >
            {item}
          </button>
        ),
      )}
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= pageCount}
        onClick={() => onPageChange(page + 1)}
        className={cn(CELL, "cursor-pointer disabled:cursor-not-allowed disabled:opacity-45")}
      >
        →
      </button>
    </nav>
  )
}
