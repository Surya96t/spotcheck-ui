import * as React from "react"

import { cn } from "@/lib/utils"

const DIGITS = "0123456789"
const DURATION_MS = 900
const EASING = "cubic-bezier(.2,.9,.15,1)"

type RollNumberProps = Omit<React.ComponentProps<"span">, "children"> & {
  /** A number to format. Ignored when `text` is set. */
  value?: number
  /** Preformatted text such as "₹1,990". Digits roll, everything else stays still. */
  text?: string
  /** The locale used to format `value`. */
  locale?: string
  /** Passed to Intl.NumberFormat, for currency or decimal places. */
  formatOptions?: Intl.NumberFormatOptions
  /** Roll time in milliseconds. */
  duration?: number
}

export function RollNumber({
  value = 0,
  text,
  locale = "en-US",
  formatOptions,
  duration = DURATION_MS,
  className,
  style,
  ...props
}: RollNumberProps) {
  const label = text ?? new Intl.NumberFormat(locale, formatOptions).format(value)
  const chars = Array.from(label)

  return (
    <span
      className={cn("spotcheck-display relative inline-flex tabular-nums", className)}
      // Inline, because a text-size class passed in className would make tailwind-merge drop it.
      style={{ lineHeight: 1, ...style }}
      {...props}
    >
      <span className="sr-only">{label}</span>
      {chars.map((char, index) => {
        // Keys count from the right, so units stay in the same column as the number grows.
        const place = chars.length - index
        const digit = DIGITS.indexOf(char)

        if (digit === -1) {
          return (
            <span key={`static-${place}`} aria-hidden>
              {char}
            </span>
          )
        }

        return (
          <span key={`digit-${place}`} aria-hidden className="inline-block h-[1em] overflow-hidden">
            <span
              data-digit={digit}
              className="flex flex-col motion-reduce:transition-none"
              style={{
                transform: `translateY(${-digit * 10}%)`,
                transition: `transform ${duration}ms ${EASING}`,
              }}
            >
              {Array.from(DIGITS, (d) => (
                <span key={d} className="block h-[1em]">
                  {d}
                </span>
              ))}
            </span>
          </span>
        )
      })}
    </span>
  )
}
