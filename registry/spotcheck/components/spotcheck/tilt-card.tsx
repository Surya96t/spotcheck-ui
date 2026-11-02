"use client"

import * as React from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react"

import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/registry/spotcheck/hooks/use-reduced-motion"

const MAX_TILT_X = 18
const MAX_TILT_Y = 22
const SPRING = { stiffness: 200, damping: 16 }
const GLARE_RANGE = 14
const MAX_GLARE = 0.9
const HOVER_QUERY = "(hover: hover) and (pointer: fine)"

const TiltContext = React.createContext(false)

function subscribeToHover(onChange: () => void) {
  const media = window.matchMedia(HOVER_QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

function useCanHover() {
  return React.useSyncExternalStore(
    subscribeToHover,
    () => window.matchMedia(HOVER_QUERY).matches,
    () => false,
  )
}

/** Degrees to tilt for a pointer at fractions of the stage, from -0.5 to 0.5 on each side. */
export function tiltFor(pointerX: number, pointerY: number) {
  return { x: -pointerY * MAX_TILT_X, y: pointerX * MAX_TILT_Y }
}

type TiltCardProps = React.ComponentProps<"div">

export function TiltCard({ className, children, ...props }: TiltCardProps) {
  const reduced = useReducedMotion()
  const canHover = useCanHover()
  const flat = reduced || !canHover

  const stage = React.useRef<HTMLDivElement>(null)
  const targetX = useMotionValue(0)
  const targetY = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const rotateX = useSpring(targetX, SPRING)
  const rotateY = useSpring(targetY, SPRING)
  const glare = useTransform(() => Math.min(MAX_GLARE, (Math.abs(rotateX.get()) + Math.abs(rotateY.get())) / GLARE_RANGE))
  const background = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, color-mix(in srgb, var(--highlight) 42%, transparent), transparent 58%)`

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = stage.current?.getBoundingClientRect()
    if (flat || event.pointerType === "touch" || !box || box.width === 0) return
    const fractionX = (event.clientX - box.left) / box.width - 0.5
    const fractionY = (event.clientY - box.top) / box.height - 0.5
    const tilt = tiltFor(fractionX, fractionY)
    targetX.set(tilt.x)
    targetY.set(tilt.y)
    glareX.set((fractionX + 0.5) * 100)
    glareY.set((fractionY + 0.5) * 100)
  }

  const onPointerLeave = () => {
    targetX.set(0)
    targetY.set(0)
  }

  return (
    <TiltContext.Provider value={flat}>
      <div
        ref={stage}
        className={cn("grid min-w-0 touch-pan-y place-items-center px-2 pt-5.5 pb-2.5", !flat && "perspective-[900px]")}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <motion.div
          data-testid="tilt-card"
          className={cn(
            "border-ink bg-raise relative flex w-[min(300px,100%)] flex-col gap-3.5 border-(length:--rule) p-5 shadow-[8px_8px_0_var(--ink)]",
            !flat && "transform-3d",
            className,
          )}
          style={flat ? undefined : { rotateX, rotateY }}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {children}
          {!flat && (
            <motion.div
              aria-hidden
              data-part="glare"
              className="pointer-events-none absolute inset-0"
              style={{ opacity: glare, background }}
            />
          )}
        </motion.div>
      </div>
    </TiltContext.Provider>
  )
}

type TiltLayerProps = React.ComponentProps<"div"> & {
  /** How far the layer floats above the card, in pixels. */
  depth?: number
}

export function TiltLayer({ depth = 0, className, style, ...props }: TiltLayerProps) {
  const flat = React.useContext(TiltContext)

  return (
    <div
      className={cn(!flat && "transform-3d", className)}
      style={flat ? style : { ...style, transform: `translateZ(${depth}px)` }}
      {...props}
    />
  )
}
