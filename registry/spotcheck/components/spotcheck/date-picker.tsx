"use client"

import * as React from "react"
import { Popover } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"

const DAYS_SHOWN = 42
const DAYS_IN_WEEK = 7

export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

export function addMonths(date: Date, months: number) {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1)
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay))
}

export function sameDay(a: Date | null | undefined, b: Date | null | undefined) {
  return Boolean(a && b) && a?.toDateString() === b?.toDateString()
}

/** Six weeks starting on the Monday on or before the first of the month. */
export function monthGrid(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const start = addDays(first, -((first.getDay() + 6) % DAYS_IN_WEEK))
  return Array.from({ length: DAYS_SHOWN }, (_, index) => addDays(start, index))
}

type CalendarProps = {
  /** The selected date. */
  value?: Date | null
  onValueChange?: (date: Date) => void
  /** The month to open on when nothing is selected. Pass it for stable server rendering. */
  defaultMonth?: Date
  locale?: string
  className?: string
}

export function Calendar({ value, onValueChange, defaultMonth, locale = "en-GB", className }: CalendarProps) {
  const [focused, setFocused] = React.useState(() => value ?? defaultMonth ?? new Date())
  const grid = React.useRef<HTMLDivElement>(null)
  const moved = React.useRef(false)

  const days = monthGrid(focused)
  const week = days.slice(0, DAYS_IN_WEEK)
  const heading = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(focused)
  const dayName = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const fullDate = new Intl.DateTimeFormat(locale, { dateStyle: "full" })

  React.useEffect(() => {
    if (!moved.current) return
    moved.current = false
    grid.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus()
  }, [focused])

  const onKeyDown = (event: React.KeyboardEvent) => {
    const weekday = (focused.getDay() + 6) % DAYS_IN_WEEK
    const targets: Record<string, Date> = {
      ArrowLeft: addDays(focused, -1),
      ArrowRight: addDays(focused, 1),
      ArrowUp: addDays(focused, -DAYS_IN_WEEK),
      ArrowDown: addDays(focused, DAYS_IN_WEEK),
      Home: addDays(focused, -weekday),
      End: addDays(focused, DAYS_IN_WEEK - 1 - weekday),
      PageUp: addMonths(focused, -1),
      PageDown: addMonths(focused, 1),
    }
    const target = targets[event.key]
    if (!target) return
    event.preventDefault()
    moved.current = true
    setFocused(target)
  }

  return (
    <div className={cn("w-[17.5rem] max-w-full font-(family-name:--f-body)", className)}>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setFocused(addMonths(focused, -1))}
          className="spotcheck-focus cursor-pointer px-2 font-(family-name:--f-mono)"
        >
          ←
        </button>
        <span aria-live="polite" className="spotcheck-heading text-lg leading-none">
          {heading}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setFocused(addMonths(focused, 1))}
          className="spotcheck-focus cursor-pointer px-2 font-(family-name:--f-mono)"
        >
          →
        </button>
      </div>
      <div ref={grid} role="grid" aria-label={heading} onKeyDown={onKeyDown}>
        <div role="row" className="grid grid-cols-7">
          {week.map((day) => (
            <span key={day.toDateString()} role="columnheader" className="spotcheck-label py-1 text-center">
              {dayName.format(day)}
            </span>
          ))}
        </div>
        {Array.from({ length: DAYS_SHOWN / DAYS_IN_WEEK }, (_, row) => (
          <div key={row} role="row" className="grid grid-cols-7">
            {days.slice(row * DAYS_IN_WEEK, (row + 1) * DAYS_IN_WEEK).map((day) => {
              const selected = sameDay(day, value)
              const inMonth = day.getMonth() === focused.getMonth()
              return (
                <button
                  key={day.toDateString()}
                  type="button"
                  role="gridcell"
                  aria-selected={selected}
                  aria-label={fullDate.format(day)}
                  tabIndex={sameDay(day, focused) ? 0 : -1}
                  onClick={() => {
                    setFocused(day)
                    onValueChange?.(day)
                  }}
                  className={cn(
                    "spotcheck-focus hover:bg-wash aspect-square cursor-pointer font-(family-name:--f-mono) text-xs tabular-nums",
                    !inMonth && "text-mute",
                    selected && "bg-ink text-paper hover:bg-ink",
                  )}
                >
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

type DatePickerProps = {
  /** Names the control for screen readers. */
  label: string
  /** The selected date, when you control it. */
  value?: Date | null
  /** The starting date, when it manages itself. */
  defaultValue?: Date | null
  onValueChange?: (date: Date) => void
  /** The month to open on when nothing is selected. */
  defaultMonth?: Date
  placeholder?: string
  locale?: string
  className?: string
}

export function DatePicker({
  label,
  value,
  defaultValue = null,
  onValueChange,
  defaultMonth,
  placeholder = "Pick a date",
  locale = "en-GB",
  className,
}: DatePickerProps) {
  const [internal, setInternal] = React.useState(defaultValue)
  const [open, setOpen] = React.useState(false)
  const current = value === undefined ? internal : value
  const text = current ? new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(current) : placeholder

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label={`${label}: ${text}`}
        className={cn(
          "spotcheck-focus border-ink flex min-w-40 cursor-pointer items-center justify-between gap-3 border-(length:--rule) px-3 py-2 text-left font-(family-name:--f-body) text-sm",
          className,
        )}
      >
        <span className="tabular-nums">{text}</span>
        <span aria-hidden className="font-(family-name:--f-mono) text-xs">
          ↓
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={6} align="start" className="z-50">
          <Popover.Popup className="border-ink bg-paper text-ink border-(length:--rule) p-3 font-(family-name:--f-body) shadow-[6px_6px_0_var(--ink)] outline-none">
            <Calendar
              value={current}
              defaultMonth={defaultMonth}
              locale={locale}
              onValueChange={(date) => {
                setInternal(date)
                onValueChange?.(date)
                setOpen(false)
              }}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  )
}
