"use client"

import * as React from "react"
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { buttonClass, type ButtonVariant } from "@/registry/ledger/components/ledger/button"

const FOLLOW_SPRING = { stiffness: 260, damping: 17 }
const RELEASE_SPRING = { stiffness: 170, damping: 8 }
const PRESS_SPRING = { stiffness: 700, damping: 22 }
const LIFT_SPRING = { stiffness: 500, damping: 9 }
const PRESSED_SCALE = 0.88

type MagneticButtonProps = {
  children: React.ReactNode
  variant?: ButtonVariant
  /** How far the button leans, as a share of the pointer's distance. */
  strength?: number
  /** How far the label leans, which should be less than `strength` so it lags. */
  labelStrength?: number
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  /** Added to the hover zone around the button. */
  className?: string
}

export function MagneticButton({
  children,
  variant = "ink",
  strength = 0.32,
  labelStrength = 0.12,
  onClick,
  disabled,
  className,
}: MagneticButtonProps) {
  const reduced = useReducedMotion()
  const button = React.useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const labelX = useMotionValue(0)
  const labelY = useMotionValue(0)
  const scale = useMotionValue(1)

  const lean = (dx: number, dy: number, spring: { stiffness: number; damping: number }) => {
    if (reduced) return
    const options = { type: "spring", ...spring } as const
    animate(x, dx * strength, options)
    animate(y, dy * strength, options)
    animate(labelX, dx * labelStrength, options)
    animate(labelY, dy * labelStrength, options)
  }

  const press = (to: number, spring: { stiffness: number; damping: number }) => {
    if (!reduced) animate(scale, to, { type: "spring", ...spring })
  }

  return (
    <div
      className={cn("grid place-items-center p-11", className)}
      onPointerMove={(event) => {
        const rect = button.current?.getBoundingClientRect()
        if (!rect || event.pointerType === "touch") return
        lean(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2), FOLLOW_SPRING)
      }}
      onPointerLeave={() => lean(0, 0, RELEASE_SPRING)}
    >
      <motion.button
        ref={button}
        type="button"
        disabled={disabled}
        onClick={onClick}
        onPointerDown={() => press(PRESSED_SCALE, PRESS_SPRING)}
        onPointerUp={() => press(1, LIFT_SPRING)}
        onPointerCancel={() => press(1, LIFT_SPRING)}
        style={{ x, y, scale }}
        className={buttonClass(variant, "px-5.5 py-4 text-sm will-change-transform enabled:active:translate-x-0 enabled:active:translate-y-0 enabled:active:shadow-[4px_4px_0_var(--ink)]")}
      >
        <motion.span className="inline-block" style={{ x: labelX, y: labelY }}>
          {children}
        </motion.span>
      </motion.button>
    </div>
  )
}
