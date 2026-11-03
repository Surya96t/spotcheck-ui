"use client"

import * as React from "react"
import { animate, stagger } from "animejs"
import { scroll } from "motion"

import { useReducedMotion } from "@/registry/spotcheck/hooks/use-reduced-motion"

const MAX_SKEW = 14
const SPEED_EASE = 0.08

function once(element: Element, run: () => void, threshold = 0.1) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      observer.disconnect()
      run()
    },
    { threshold },
  )
  observer.observe(element)
  return () => observer.disconnect()
}

/** Page-level motion. Everything it moves is already in place, so nothing is lost without it. */
export function PageMotion() {
  const reduced = useReducedMotion()
  const progress = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (reduced) return
    const stops: (() => void)[] = []

    for (const element of document.querySelectorAll<HTMLElement>("[data-rise]")) {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.9) continue
      element.style.transform = "translateY(108%)"
      stops.push(
        once(element.parentElement ?? element, () =>
          animate(element, { translateY: ["108%", "0%"], duration: 900, ease: "outExpo" }),
        ),
      )
    }

    for (const box of document.querySelectorAll<HTMLElement>("[data-cells]")) {
      const items = [...box.children] as HTMLElement[]
      if (box.getBoundingClientRect().top < window.innerHeight * 0.9) continue
      for (const item of items) item.style.opacity = "0"
      stops.push(
        once(
          box,
          () =>
            animate(items, {
              opacity: [0, 1],
              translateY: [34, 0],
              duration: 650,
              delay: stagger(70),
              ease: "outQuad",
              onComplete: () => items.forEach((item) => (item.style.transform = "")),
            }),
          0.05,
        ),
      )
    }

    const line = progress.current
    if (line) stops.push(scroll((amount: number) => (line.style.transform = `scaleX(${amount})`)))

    // The ticker keeps its CSS loop. Scrolling speeds it up and leans it over.
    const ticker = document.querySelector<HTMLElement>("[data-ticker]")
    const loop = ticker?.querySelector<HTMLElement>("[aria-hidden]")
    let lastY = window.scrollY
    let speed = 0
    let frame = 0
    const tick = () => {
      speed += (Math.abs(window.scrollY - lastY) - speed) * SPEED_EASE
      lastY = window.scrollY
      if (loop) {
        for (const animation of loop.getAnimations()) animation.playbackRate = 1 + speed / 6
        loop.style.transform = ""
        loop.parentElement?.style.setProperty("transform", `skewX(${-Math.min(MAX_SKEW, speed / 2).toFixed(2)}deg)`)
      }
      frame = requestAnimationFrame(tick)
    }
    if (loop) frame = requestAnimationFrame(tick)
    stops.push(() => cancelAnimationFrame(frame))

    return () => stops.forEach((stop) => stop())
  }, [reduced])

  return (
    <div
      ref={progress}
      aria-hidden
      className="bg-accent-ink pointer-events-none fixed inset-x-0 top-14 z-50 h-0.5 origin-left scale-x-0 motion-reduce:hidden"
    />
  )
}
