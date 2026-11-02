"use client"

import * as React from "react"

const RADIANS_PER_PIXEL = 0.008

type OrbitDragOptions = {
  /** The starting angle in radians. */
  angle?: number
  /** Radians turned per pixel dragged. */
  speed?: number
  /** Runs on every change, so a scene that renders on demand can draw the new angle. */
  onChange?: (angle: number) => void
}

/** Turns horizontal drags into an angle. Vertical swipes stay with the page, through `pan-y`. */
export function useOrbitDrag({ angle = 0, speed = RADIANS_PER_PIXEL, onChange }: OrbitDragOptions = {}) {
  const rotation = React.useRef(angle)
  const dragging = React.useRef(false)
  const lastX = React.useRef(0)

  const release = React.useCallback(() => {
    dragging.current = false
  }, [])

  const bind = React.useMemo(
    () => ({
      style: { touchAction: "pan-y" },
      onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
        if (event.button !== 0) return
        event.currentTarget.setPointerCapture(event.pointerId)
        dragging.current = true
        lastX.current = event.clientX
      },
      onPointerMove: (event: React.PointerEvent<HTMLElement>) => {
        if (!dragging.current) return
        rotation.current += (event.clientX - lastX.current) * speed
        lastX.current = event.clientX
        onChange?.(rotation.current)
      },
      onPointerUp: release,
      onPointerCancel: release,
    }),
    [onChange, release, speed],
  )

  return { rotation, dragging, bind }
}
