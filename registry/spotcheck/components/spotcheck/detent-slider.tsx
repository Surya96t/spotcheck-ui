"use client"

import * as React from "react"
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react"

import { cn } from "@/lib/utils"

const RELEASE_SPRING = { stiffness: 380, damping: 12 }
const PRESS_SPRING = { stiffness: 900, damping: 40 }
const THUMB_SPRING = { stiffness: 500, damping: 18 }
const MAX_TICKS = 41

export type DetentZone = { from: number; to: number; label: string }

type DetentSliderProps = {
  /** Names the control for screen readers and prints above the value. */
  label: string
  /** The lowest value. */
  min?: number
  /** The highest value. */
  max?: number
  /** Distance between detents. */
  step?: number
  /** The current value, when you control the slider. */
  value?: number
  /** The starting value, when the slider manages itself. */
  defaultValue?: number
  /** Runs when the slider lands on a new step, not on every pointer move. */
  onValueChange?: (value: number) => void
  /** Named ranges, such as Deterministic, Balanced and Creative. */
  zones?: DetentZone[]
  /** Values to print under the track. Defaults to the two ends. */
  marks?: number[]
  /** Formats the readout and marks. Pass it from a client component. */
  format?: (value: number) => string
  /** The spring used when landing on a step. */
  spring?: { stiffness: number; damping: number }
  /** Added to the outer element. */
  className?: string
}

function decimalsOf(step: number) {
  return (String(step).split(".")[1] ?? "").length
}

export function snapToStep(value: number, min: number, max: number, step: number) {
  const steps = Math.round((Math.min(max, Math.max(min, value)) - min) / step)
  return Math.min(max, Number((min + steps * step).toFixed(decimalsOf(step))))
}

export function findZone(zones: DetentZone[], value: number) {
  const distance = (zone: DetentZone) => Math.max(zone.from - value, value - zone.to, 0)
  return zones.reduce<DetentZone | undefined>(
    (best, zone) => (!best || distance(zone) < distance(best) ? zone : best),
    undefined,
  )
}

export function DetentSlider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onValueChange,
  zones = [],
  marks = [min, max],
  format = (v) => v.toFixed(decimalsOf(step)),
  spring = RELEASE_SPRING,
  className,
}: DetentSliderProps) {
  const reduced = useReducedMotion()
  const [internal, setInternal] = React.useState(defaultValue ?? min)
  const current = value ?? internal
  const [drag, setDrag] = React.useState<number | null>(null)
  const shown = drag ?? current

  const track = React.useRef<HTMLDivElement>(null)
  const fractionOf = (v: number) => (v - min) / (max - min)
  const progress = useMotionValue(fractionOf(current))
  const thumbLeft = useTransform(progress, (p) => `${p * 100}%`)

  const moveTo = React.useCallback(
    (fraction: number, options: { stiffness: number; damping: number } | null) => {
      if (!options || reduced) progress.jump(fraction)
      else animate(progress, fraction, { type: "spring", ...options })
    },
    [progress, reduced],
  )

  const commit = (next: number) => {
    setInternal(next)
    if (next !== current) onValueChange?.(next)
    moveTo(fractionOf(next), spring)
  }

  // Follows a controlled value that changes from outside the slider.
  const settled = React.useRef(current)
  React.useEffect(() => {
    if (settled.current !== current && drag === null) moveTo((current - min) / (max - min), spring)
    settled.current = current
  }, [current, drag, max, min, moveTo, spring])

  const fromPointer = (clientX: number) => {
    const rect = track.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return min
    const fraction = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    return min + fraction * (max - min)
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    const next = fromPointer(event.clientX)
    setDrag(next)
    moveTo(fractionOf(next), PRESS_SPRING)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (drag === null) return
    const next = fromPointer(event.clientX)
    setDrag(next)
    moveTo(fractionOf(next), null)
  }

  const onPointerEnd = () => {
    if (drag === null) return
    setDrag(null)
    commit(snapToStep(drag, min, max, step))
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: current + step,
      ArrowUp: current + step,
      ArrowLeft: current - step,
      ArrowDown: current - step,
      Home: min,
      End: max,
    }
    const next = moves[event.key]
    if (next === undefined) return
    event.preventDefault()
    commit(snapToStep(next, min, max, step))
  }

  const count = Math.round((max - min) / step) + 1
  const shownZone = findZone(zones, shown)
  const currentZone = findZone(zones, current)
  const reached = Math.round((shown - min) / step)

  return (
    <div className={cn("flex flex-col gap-3.5 font-(family-name:--f-body)", className)}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="spotcheck-label">{label}</div>
          <div className="spotcheck-display text-[64px] leading-[.9] tabular-nums">{format(shown)}</div>
        </div>
        {shownZone && (
          <div className="border-(length:--rule) border-ink px-2 py-[3px] font-(family-name:--f-mono) text-[11px] tracking-[.12em] uppercase">
            {shownZone.label}
          </div>
        )}
      </div>

      <div
        ref={track}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current}
        aria-valuetext={currentZone ? `${format(current)}, ${currentZone.label}` : format(current)}
        className="group relative mx-3 mt-2 h-14 cursor-pointer touch-pan-y outline-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onKeyDown={onKeyDown}
      >
        <div className="bg-ink absolute inset-x-0 top-[27px] h-0.5" />
        <motion.div
          data-part="fill"
          className="bg-accent-ink absolute inset-x-0 top-6 h-2 origin-left"
          style={{ scaleX: progress }}
        />
        {count <= MAX_TICKS &&
          Array.from({ length: count }, (_, tick) => (
            <i
              key={tick}
              className={cn(
                "absolute top-3.5 -ml-px h-7 w-0.5",
                tick <= reached ? "bg-ink" : "bg-[color-mix(in_srgb,var(--ink)_30%,transparent)]",
              )}
              style={{ left: `${(tick / (count - 1)) * 100}%` }}
            />
          ))}
        <motion.div className="pointer-events-none absolute inset-y-0 w-0" style={{ left: thumbLeft }}>
          <motion.span
            data-part="thumb"
            className="bg-ink border-paper group-focus-visible:bg-accent-ink absolute top-3.5 -left-3.5 block size-7 border-(length:--rule) shadow-[0_0_0_var(--rule)_var(--ink)] group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-(--accent-ink)"
            animate={drag === null ? { scale: 1, rotate: 0 } : { scale: 1.25, rotate: 45 }}
            transition={reduced ? { duration: 0 } : { type: "spring", ...THUMB_SPRING }}
          />
        </motion.div>
      </div>

      <div className="relative mx-3 h-4 font-(family-name:--f-mono) text-[10.5px] text-mute tabular-nums">
        {marks.map((mark) => (
          <span
            key={mark}
            className="absolute -translate-x-1/2 whitespace-nowrap"
            style={{ left: `${fractionOf(mark) * 100}%` }}
          >
            {format(mark)}
          </span>
        ))}
      </div>
    </div>
  )
}
