"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/registry/ledger/hooks/use-reduced-motion"

const GLYPHS = "█▓▒░/\\<>_#01"
const FRAMES_PER_CHARACTER = 2.4
const SETTLE_FRAMES = 3

/** The text at a given frame: settled on the left, glyphs on the right, spaces left alone. */
export function scrambleFrame(text: string, frame: number, random: () => number = Math.random) {
  return Array.from(text, (char, index) => {
    if (char === " " || index < frame / FRAMES_PER_CHARACTER) return char
    return GLYPHS[Math.floor(random() * GLYPHS.length)]
  }).join("")
}

type ScrambleTextProps = Omit<React.ComponentProps<"span">, "children"> & {
  text: string
  /** When it decodes. Pass an empty array to show the text with no effect. */
  trigger?: ("mount" | "hover")[]
}

export function ScrambleText({ text, trigger = ["mount", "hover"], className, ...props }: ScrambleTextProps) {
  // Null shows the real text, so a new `text` always appears even if nothing is playing.
  const [output, setOutput] = React.useState<string | null>(null)
  const reduced = useReducedMotion()
  const frame = React.useRef(0)
  const onMount = trigger.includes("mount")

  const play = React.useCallback(() => {
    cancelAnimationFrame(frame.current)
    if (reduced) return

    const lastFrame = text.length * FRAMES_PER_CHARACTER + SETTLE_FRAMES
    let count = 0
    const tick = () => {
      count++
      setOutput(count < lastFrame ? scrambleFrame(text, count) : null)
      if (count < lastFrame) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }, [reduced, text])

  React.useEffect(() => {
    if (onMount) play()
    return () => cancelAnimationFrame(frame.current)
  }, [onMount, play])

  return (
    <span
      className={cn("ledger-display relative inline-grid", className)}
      onMouseEnter={trigger.includes("hover") ? play : undefined}
      {...props}
    >
      <span className="sr-only">{text}</span>
      {/* The real text sets the size, so glyphs of other widths can't move the layout. */}
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {text}
      </span>
      {/* Zero size with a full minimum, so the glyphs fill the cell but can't widen it. */}
      <span aria-hidden className="col-start-1 row-start-1 h-0 min-h-full w-0 min-w-full overflow-hidden">
        {output ?? text}
      </span>
    </span>
  )
}
