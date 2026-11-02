"use client"

import * as React from "react"

type WhenSeenProps = {
  children: React.ReactNode
  /** Reserves the space, so the page doesn't jump when the part loads. */
  minHeight: number
  /** How far off screen to start. */
  margin?: string
  className?: string
}

/** Mounts a live part once it's near the screen, so a long page loads and plays in order. */
export function WhenSeen({ children, minHeight, margin = "200px", className }: WhenSeenProps) {
  const anchor = React.useRef<HTMLDivElement>(null)
  const [seen, setSeen] = React.useState(false)

  React.useEffect(() => {
    const element = anchor.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        setSeen(true)
        observer.disconnect()
      },
      { rootMargin: margin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [margin])

  return (
    <div ref={anchor} className={className} style={seen ? undefined : { minHeight }}>
      {seen && children}
    </div>
  )
}
