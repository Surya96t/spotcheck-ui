"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { buttonClass } from "@/registry/ledger/components/ledger/button"

const DURATION_MS = 1200
const HOLD_KEYS = [" ", "Enter"]

type HoldButtonProps = Omit<React.ComponentProps<"button">, "onClick"> & {
  /** How long to hold, in milliseconds. */
  duration?: number
  /** Runs once the hold completes. */
  onConfirm?: () => void
  /** Replaces the label after the hold completes. Pressing again resets the button. */
  confirmedLabel?: string
}

export function HoldButton({
  duration = DURATION_MS,
  onConfirm,
  confirmedLabel = "Done · press to reset",
  className,
  children,
  ...props
}: HoldButtonProps) {
  const [confirmed, setConfirmed] = React.useState(false)
  const fill = React.useRef<HTMLSpanElement>(null)
  const frame = React.useRef(0)
  const heldKey = React.useRef<string | null>(null)

  const paint = (progress: number) => {
    if (fill.current) fill.current.style.transform = `scaleX(${progress})`
  }

  const start = () => {
    if (confirmed) return
    const startedAt = performance.now()
    const step = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      paint(progress)
      if (progress < 1) {
        frame.current = requestAnimationFrame(step)
      } else {
        setConfirmed(true)
        onConfirm?.()
      }
    }
    frame.current = requestAnimationFrame(step)
  }

  const stop = () => {
    cancelAnimationFrame(frame.current)
    heldKey.current = null
    if (!confirmed) paint(0)
  }

  const reset = () => {
    setConfirmed(false)
    paint(0)
  }

  React.useEffect(() => () => cancelAnimationFrame(frame.current), [])

  return (
    <button
      type="button"
      className={buttonClass("outline", cn("overflow-hidden", confirmed && "text-on-accent", className))}
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onBlur={stop}
      onClick={() => confirmed && heldKey.current === null && reset()}
      onKeyDown={(event) => {
        if (!HOLD_KEYS.includes(event.key)) return
        event.preventDefault()
        if (event.repeat) return
        if (confirmed) return reset()
        heldKey.current = event.key
        start()
      }}
      onKeyUp={(event) => {
        if (event.key === heldKey.current) stop()
      }}
      {...props}
    >
      <span
        ref={fill}
        aria-hidden
        data-part="fill"
        className="bg-bad absolute inset-0 origin-left scale-x-0"
      />
      <span className="relative">{confirmed ? confirmedLabel : children}</span>
      <span role="status" className="sr-only">
        {confirmed ? "Confirmed" : ""}
      </span>
    </button>
  )
}
