"use client"

import * as React from "react"
import { animate, useMotionValue } from "motion/react"

import { useReducedMotion } from "@/registry/spotcheck/hooks/use-reduced-motion"

const SPRING = { stiffness: 240, damping: 26 }
const MAX_VELOCITY = 12
const PROJECTION = 0.1
const RUBBER_BAND = 0.3
const TAP_DISTANCE = 5

/** Past either end the drag gives way, so the edge feels soft rather than a hard stop. */
export function rubberBand(position: number, count: number) {
  const last = count - 1
  if (position < 0) return position * RUBBER_BAND
  if (position > last) return last + (position - last) * RUBBER_BAND
  return position
}

/** Caps the throw, carries it forward, and rounds to the nearest item that exists. */
export function flickTarget(position: number, velocity: number, count: number) {
  const capped = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, velocity))
  return Math.max(0, Math.min(count - 1, Math.round(position + capped * PROJECTION)))
}

type FlickOptions = {
  /** How many items there are. */
  count: number
  /** The selected index. The position follows it when it changes from outside. */
  index: number
  /** Runs when a move lands on a different item. */
  onIndexChange: (index: number) => void
  /** Which way drags count. */
  axis: "x" | "y"
  /** Pixels of drag that move one item. A function can measure the element when it's called. */
  step: number | (() => number)
  /** Runs for a press that didn't move, with the event and the position when it began. */
  onTap?: (event: React.PointerEvent<HTMLElement>, position: number) => void
}

type Gesture = { start: number; from: number; last: number; time: number; velocity: number; moved: number }

/** Drag, throw and spring-to-nearest for lists that land on an item. Position is in items. */
export function useFlick({ count, index, onIndexChange, axis, step, onTap }: FlickOptions) {
  const reduced = useReducedMotion()
  const position = useMotionValue(index)
  const gesture = React.useRef<Gesture | null>(null)
  const motion = React.useRef<ReturnType<typeof animate> | null>(null)
  const goal = React.useRef(index)

  const moveTo = React.useCallback(
    (target: number, velocity = 0) => {
      goal.current = target
      motion.current?.stop()
      if (reduced) position.jump(target)
      else motion.current = animate(position, target, { type: "spring", ...SPRING, velocity })
    },
    [position, reduced],
  )

  const settle = React.useCallback(
    (target: number, velocity = 0) => {
      const next = Math.max(0, Math.min(count - 1, target))
      moveTo(next, velocity)
      if (next !== index) onIndexChange(next)
    },
    [count, index, moveTo, onIndexChange],
  )

  // Follows a selection that changes from outside the gesture.
  React.useEffect(() => {
    if (!gesture.current && goal.current !== index) moveTo(index)
  }, [index, moveTo])

  const stepSize = () => (typeof step === "function" ? step() : step)
  const along = (event: React.PointerEvent<HTMLElement>) => (axis === "x" ? event.clientX : event.clientY)

  const bind = {
    onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
      if (event.button !== 0) return
      event.currentTarget.setPointerCapture(event.pointerId)
      motion.current?.stop()
      const at = along(event)
      gesture.current = { start: at, from: position.get(), last: at, time: performance.now(), velocity: 0, moved: 0 }
    },
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
      const state = gesture.current
      if (!state) return
      const at = along(event)
      const now = performance.now()
      const size = stepSize()
      state.moved = Math.max(state.moved, Math.abs(at - state.start))
      state.velocity = (((state.last - at) / size) / (Math.max(1, now - state.time) / 1000)) * 0.6 + state.velocity * 0.4
      state.last = at
      state.time = now
      position.jump(rubberBand(state.from + (state.start - at) / size, count))
    },
    onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
      const state = gesture.current
      if (!state) return
      gesture.current = null
      if (state.moved < TAP_DISTANCE) {
        moveTo(index)
        onTap?.(event, state.from)
        return
      }
      settle(flickTarget(position.get(), state.velocity, count), state.velocity)
    },
    onPointerCancel: () => {
      if (!gesture.current) return
      gesture.current = null
      moveTo(index)
    },
  }

  return { position, settle, bind }
}
