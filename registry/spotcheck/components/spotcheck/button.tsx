import * as React from "react"

import { cn } from "@/lib/utils"

const BASE =
  "spotcheck-focus border-ink relative inline-flex cursor-pointer items-center gap-2 border-(length:--rule) px-4 py-2.5 font-(family-name:--f-mono) text-[12.5px] font-semibold tracking-[.06em] uppercase shadow-[4px_4px_0_var(--ink)] transition-[translate,box-shadow] duration-75 enabled:active:translate-x-1 enabled:active:translate-y-1 enabled:active:shadow-none disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none"

const VARIANTS = {
  outline: "bg-paper text-ink",
  ink: "bg-ink text-paper",
  accent: "bg-accent-ink text-on-accent",
  ghost:
    "text-ink enabled:active:bg-wash border-dashed bg-transparent shadow-none enabled:active:translate-x-0 enabled:active:translate-y-0",
}

export type ButtonVariant = keyof typeof VARIANTS

/** The button's classes, for styling a link or another element as a button. */
export function buttonClass(variant: ButtonVariant = "outline", className?: string) {
  return cn(BASE, VARIANTS[variant], className)
}

type ButtonProps = React.ComponentProps<"button"> & {
  variant?: ButtonVariant
}

export function Button({ variant = "outline", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />
}
