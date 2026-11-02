import * as React from "react"

import { cn } from "@/lib/utils"

const SPEED_SECONDS = 22
const SEPARATOR = "✶"

type MarqueeProps = Omit<React.ComponentProps<"div">, "children"> & {
  items: string[]
  /** Seconds for one full loop. */
  speed?: number
}

export function Marquee({ items, speed = SPEED_SECONDS, className, style, ...props }: MarqueeProps) {
  const loop = [...items, ...items]

  return (
    <div
      tabIndex={0}
      role="group"
      aria-label={items.join(", ")}
      className={cn(
        "group spotcheck-focus border-ink overflow-hidden border-y-(length:--rule) whitespace-nowrap",
        className,
      )}
      style={style}
      {...props}
    >
      <div
        aria-hidden
        className="inline-flex [animation:spotcheck-marquee_var(--marquee-speed)_linear_infinite] group-hover:[animation-play-state:paused] group-focus:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}
      >
        {loop.map((item, index) => (
          <span
            key={index}
            className="spotcheck-heading even:text-accent-ink px-4.5 py-2 text-[34px] leading-none"
          >
            {item} {SEPARATOR}
          </span>
        ))}
      </div>
    </div>
  )
}
