"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { RollNumber } from "@/registry/ledger/components/ledger/roll-number"

const PIXELS_PER_STEP = 6
const LARGE_STEP = 10

function decimalsOf(step: number) {
  return (String(step).split(".")[1] ?? "").length
}

/** Rounds to the step and clamps to the range, without float noise. */
export function snapValue(value: number, min: number, max: number, step: number) {
  const snapped = Number((Math.round(value / step) * step).toFixed(decimalsOf(step)))
  return Math.min(max, Math.max(min, snapped))
}

type ScrubInputProps = {
  /** Names the control for screen readers and prints above the value. */
  label: string
  /** The current value, when you control it. */
  value?: number
  /** The starting value, when it manages itself. */
  defaultValue?: number
  onValueChange?: (value: number) => void
  min?: number
  max?: number
  /** How much one step changes the value. */
  step?: number
  /** Printed after the value, such as "ms". */
  unit?: string
  className?: string
}

export function ScrubInput({
  label,
  value,
  defaultValue = 0,
  onValueChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  unit,
  className,
}: ScrubInputProps) {
  const [internal, setInternal] = React.useState(defaultValue)
  const [draft, setDraft] = React.useState<string | null>(null)
  const drag = React.useRef<{ x: number; start: number; moved: boolean } | null>(null)
  const control = React.useRef<HTMLDivElement>(null)
  const returnFocus = React.useRef(false)
  const current = value ?? internal
  const decimals = decimalsOf(step)

  const commit = (next: number) => {
    const snapped = snapValue(next, min, max, step)
    setInternal(snapped)
    if (snapped !== current) onValueChange?.(snapped)
  }

  const finishTyping = (save: boolean, keepFocus: boolean) => {
    const typed = Number(draft)
    if (save && draft?.trim() && Number.isFinite(typed)) commit(typed)
    returnFocus.current = keepFocus
    setDraft(null)
  }

  // The control only exists again after the render that closes the field.
  React.useEffect(() => {
    if (draft === null && returnFocus.current) control.current?.focus()
    returnFocus.current = false
  }, [draft])

  const onKeyDown = (event: React.KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowUp: current + step,
      ArrowRight: current + step,
      ArrowDown: current - step,
      ArrowLeft: current - step,
      PageUp: current + step * LARGE_STEP,
      PageDown: current - step * LARGE_STEP,
    }
    if (event.key === "Home" && Number.isFinite(min)) moves.Home = min
    if (event.key === "End" && Number.isFinite(max)) moves.End = max
    if (event.key === "Enter") {
      event.preventDefault()
      setDraft(current.toFixed(decimals))
      return
    }
    const next = moves[event.key]
    if (next === undefined) return
    event.preventDefault()
    commit(next)
  }

  return (
    <div className={cn("inline-flex flex-col gap-0.5", className)}>
      <span className="ledger-label">{label}</span>
      {draft === null ? (
        <div
          ref={control}
          role="spinbutton"
          tabIndex={0}
          aria-label={label}
          aria-valuenow={current}
          aria-valuemin={Number.isFinite(min) ? min : undefined}
          aria-valuemax={Number.isFinite(max) ? max : undefined}
          aria-valuetext={unit ? `${current.toFixed(decimals)} ${unit}` : undefined}
          className="ledger-focus flex cursor-ew-resize touch-pan-y items-baseline gap-1.5 select-none"
          onKeyDown={onKeyDown}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId)
            drag.current = { x: event.clientX, start: current, moved: false }
          }}
          onPointerMove={(event) => {
            if (!drag.current) return
            const steps = Math.round((event.clientX - drag.current.x) / PIXELS_PER_STEP)
            if (steps !== 0) drag.current.moved = true
            if (drag.current.moved) commit(drag.current.start + steps * step * (event.shiftKey ? LARGE_STEP : 1))
          }}
          onPointerUp={() => {
            // A press with no drag opens the field for typing.
            if (drag.current && !drag.current.moved) setDraft(current.toFixed(decimals))
            drag.current = null
          }}
          onPointerCancel={() => (drag.current = null)}
        >
          <RollNumber
            text={current.toFixed(decimals)}
            duration={350}
            className="border-ink border-b-(length:--rule) border-dashed text-[44px]"
          />
          {unit && <span className="text-mute font-(family-name:--f-mono) text-xs">{unit}</span>}
        </div>
      ) : (
        <input
          autoFocus
          inputMode="decimal"
          aria-label={label}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onFocus={(event) => event.target.select()}
          onBlur={() => finishTyping(true, false)}
          onKeyDown={(event) => {
            if (event.key === "Enter") finishTyping(true, true)
            if (event.key === "Escape") finishTyping(false, true)
          }}
          className="ledger-display border-accent-ink w-[6ch] border-b-(length:--rule) bg-transparent text-[44px] leading-none tabular-nums outline-none"
        />
      )}
    </div>
  )
}
