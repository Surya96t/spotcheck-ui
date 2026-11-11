"use client"

import * as React from "react"
import { motion, type MotionValue, useTransform } from "motion/react"

import { cn } from "@/lib/utils"
import { useFlick } from "@/registry/spotcheck/hooks/use-flick"

const ROW_HEIGHT = 42
const ROW_ANGLE = 22
const RADIUS = Math.round(ROW_HEIGHT / 2 / Math.tan(((ROW_ANGLE / 2) * Math.PI) / 180))
const FADE_PER_ROW = 0.26
const LAST_LEGIBLE_ROW = 2
const WHEEL_STEP = 36

export type DrumOption = { value: string; label: string }

/** The row a wheel turn lands on, or null at the ends so the page can scroll again. */
export function wheelTarget(index: number, deltaY: number, count: number) {
  const next = index + Math.sign(deltaY)
  return next < 0 || next >= count || deltaY === 0 ? null : next
}

/** Rows fade as they turn away, and go by the row where they'd be too faint to read. */
export function rowOpacity(distance: number) {
  const faintest = 1 - LAST_LEGIBLE_ROW * FADE_PER_ROW
  if (distance <= LAST_LEGIBLE_ROW) return 1 - distance * FADE_PER_ROW
  return Math.max(0, faintest * (LAST_LEGIBLE_ROW + 1 - distance))
}

type DrumRowProps = {
  id: string
  index: number
  label: string
  selected: boolean
  position: MotionValue<number>
}

function DrumRow({ id, index, label, selected, position }: DrumRowProps) {
  const opacity = useTransform(position, (value) => rowOpacity(Math.abs(value - index)))

  return (
    <motion.div
      id={id}
      role="option"
      aria-selected={selected}
      className={cn(
        "spotcheck-heading absolute inset-0 flex items-center justify-center text-[25px] backface-hidden select-none",
        selected && "text-accent-ink",
      )}
      style={{ opacity, transform: `rotateX(${-index * ROW_ANGLE}deg) translateZ(${RADIUS}px)` }}
    >
      {label}
    </motion.div>
  )
}

type DrumPickerProps = {
  /** Names the list for screen readers. */
  label: string
  options: DrumOption[]
  /** The chosen option's value, when you control it. */
  value?: string
  /** The starting value, when the picker manages itself. */
  defaultValue?: string
  /** Runs when the wheel lands on a different row. */
  onValueChange?: (value: string) => void
  /** Added to the outer element. */
  className?: string
}

export function DrumPicker({ label, options, value, defaultValue, onValueChange, className }: DrumPickerProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? options[0]?.value)
  const current = value ?? internal
  const index = Math.max(
    0,
    options.findIndex((option) => option.value === current),
  )
  const count = options.length
  const baseId = React.useId()
  const wheel = React.useRef<HTMLDivElement>(null)
  const turned = React.useRef(0)

  const change = (next: number) => {
    const option = options[next]
    if (!option) return
    setInternal(option.value)
    onValueChange?.(option.value)
  }

  const { position, settle, bind } = useFlick({
    count,
    index,
    onIndexChange: change,
    axis: "y",
    step: ROW_HEIGHT,
    onTap: (event, from) => {
      const box = event.currentTarget.getBoundingClientRect()
      settle(Math.round(from + (event.clientY - (box.top + box.height / 2)) / ROW_HEIGHT))
    },
  })
  const rotateX = useTransform(position, (value) => value * ROW_ANGLE)

  React.useEffect(() => {
    const element = wheel.current
    if (!element) return
    // React's wheel listener is passive, and this one has to be able to cancel the page scroll.
    const onWheel = (event: WheelEvent) => {
      const next = wheelTarget(index, event.deltaY, count)
      if (next === null) {
        turned.current = 0
        return
      }
      event.preventDefault()
      turned.current += event.deltaY
      if (Math.abs(turned.current) < WHEEL_STEP) return
      turned.current = 0
      settle(next)
    }
    element.addEventListener("wheel", onWheel, { passive: false })
    return () => element.removeEventListener("wheel", onWheel)
  }, [count, index, settle])

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: count - 1 }
    const next = moves[event.key]
    if (next === undefined) return
    event.preventDefault()
    settle(next)
  }

  return (
    // The padding is the gutter: the wheel can't share vertical swipes, so phones scroll beside it.
    <div className={cn("min-w-0 pr-12 font-(family-name:--f-body) md:pr-0", className)}>
      <div
        ref={wheel}
        role="listbox"
        tabIndex={0}
        aria-label={label}
        aria-activedescendant={`${baseId}-${index}`}
        className="group spotcheck-focus border-ink bg-raise relative h-65 cursor-grab touch-none overflow-hidden border-(length:--rule) perspective-[900px] active:cursor-grabbing"
        onKeyDown={onKeyDown}
        {...bind}
      >
        <div className="border-ink group-focus-visible:bg-[color-mix(in_srgb,var(--accent-ink)_12%,transparent)] pointer-events-none absolute inset-x-0 top-1/2 -mt-[23px] h-[46px] border-y-(length:--rule)" />
        <motion.div
          data-part="wheel"
          className="absolute inset-x-0 top-1/2 -mt-[21px] h-[42px] transform-3d"
          style={{ rotateX }}
        >
          {options.map((option, row) => (
            <DrumRow
              key={option.value}
              id={`${baseId}-${row}`}
              index={row}
              label={option.label}
              selected={row === index}
              position={position}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
