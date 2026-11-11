import * as React from "react"

import { cn } from "@/lib/utils"

const STAGGER_MS = 90

export type Entry = { id: string; title: string; meta: string }

type EntryListProps = Omit<React.ComponentProps<"ul">, "children"> & {
  entries: Entry[]
  /** Delay between rows, in milliseconds. */
  stagger?: number
}

export function EntryList({ entries, stagger = STAGGER_MS, className, ...props }: EntryListProps) {
  return (
    <ul className={cn("m-0 list-none p-0 font-(family-name:--f-body)", className)} {...props}>
      {entries.map((entry, index) => (
        <li
          key={entry.id}
          className="grid [animation:spotcheck-entry_.55s_cubic-bezier(.2,.8,.2,1)_both] grid-cols-[2.4rem_minmax(0,1fr)_auto] items-end gap-2.5 border-b border-[color-mix(in_srgb,var(--ink)_18%,transparent)] pt-3 pb-1 motion-reduce:animate-none"
          style={{ animationDelay: `${index * stagger}ms` }}
        >
          <span className="text-mute font-(family-name:--f-mono) text-[11px]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <b className="spotcheck-heading min-w-0 text-[19px] leading-tight">{entry.title}</b>
          <span className="text-mute font-(family-name:--f-mono) text-[11px]">{entry.meta}</span>
        </li>
      ))}
    </ul>
  )
}
