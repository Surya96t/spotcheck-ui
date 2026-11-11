"use client"

import * as React from "react"
import { animate, spring, utils } from "animejs"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { useReducedMotion } from "@/registry/spotcheck/hooks/use-reduced-motion"

const THRESHOLD_PX = 110
const VISIBLE_CARDS = 3
const FLING_DISTANCE = 640
const FLING_ROTATION = 28
const FLING_MS = 420
const DRAG_ROTATION = 18
const RETURN_SPRING = { stiffness: 220, damping: 11 }

export type ReviewItem = { id: string; question: string; answer: string; meta: string }

/** Past the threshold a card flies off that way. Otherwise it returns. */
export function swipeOutcome(distance: number, threshold: number) {
  if (Math.abs(distance) <= threshold) return null
  return distance > 0 ? "accept" : "reject"
}

type SwipeReviewProps = {
  items: ReviewItem[]
  /** How far to drag before a card is decided, in pixels. */
  threshold?: number
  onAccept?: (item: ReviewItem) => void
  onReject?: (item: ReviewItem) => void
  className?: string
}

export function SwipeReview({ items, threshold = THRESHOLD_PX, onAccept, onReject, className }: SwipeReviewProps) {
  const reduced = useReducedMotion()
  const [position, setPosition] = React.useState(0)
  const [tally, setTally] = React.useState({ accepted: 0, rejected: 0 })
  const [distance, setDistance] = React.useState(0)
  const [flying, setFlying] = React.useState(false)
  const card = React.useRef<HTMLDivElement>(null)
  const dragStart = React.useRef<number | null>(null)

  const queue = items.slice(position, position + VISIBLE_CARDS)
  const current = queue[0]

  const settle = (outcome: "accept" | "reject") => {
    if (!current) return
    if (outcome === "accept") onAccept?.(current)
    else onReject?.(current)
    setTally((count) =>
      outcome === "accept" ? { ...count, accepted: count.accepted + 1 } : { ...count, rejected: count.rejected + 1 },
    )
    setPosition((index) => index + 1)
    setDistance(0)
    setFlying(false)
  }

  const fling = (outcome: "accept" | "reject") => {
    if (flying || !card.current) return
    if (reduced) return settle(outcome)
    setFlying(true)
    const direction = outcome === "accept" ? 1 : -1
    animate(card.current, {
      x: direction * FLING_DISTANCE,
      rotate: direction * FLING_ROTATION,
      opacity: 0,
      duration: FLING_MS,
      ease: "inQuad",
      onComplete: () => settle(outcome),
    })
  }

  const release = (cancelled: boolean) => {
    if (dragStart.current === null) return
    dragStart.current = null
    const outcome = cancelled ? null : swipeOutcome(distance, threshold)
    if (outcome) return fling(outcome)
    setDistance(0)
    if (!card.current) return
    if (reduced) utils.set(card.current, { x: 0, rotate: 0 })
    else animate(card.current, { x: 0, rotate: 0, ease: spring(RETURN_SPRING) })
  }

  return (
    <div className={cn("flex flex-col gap-3.5 font-(family-name:--f-body)", className)}>
      <div className="relative isolate grid h-75 place-items-center">
        {current ? (
          queue
            .toReversed()
            .map((item, reversedIndex, stack) => {
              const depth = stack.length - 1 - reversedIndex
              const top = depth === 0
              return (
                <div
                  key={item.id}
                  ref={top ? card : undefined}
                  data-testid={top ? "review-card" : undefined}
                  aria-hidden={!top}
                  className={cn(
                    "border-ink bg-raise absolute inset-x-[4%] top-3.5 bottom-6.5 flex flex-col gap-0.5 overflow-hidden border-(length:--rule) px-4 py-3.5 shadow-[6px_6px_0_var(--ink)] select-none md:inset-x-[12%]",
                    top && "cursor-grab touch-pan-y",
                  )}
                  style={top ? undefined : { transform: `translateY(${depth * 10}px) scale(${1 - depth * 0.04})`, zIndex: -depth }}
                  onPointerDown={
                    top
                      ? (event) => {
                          if (flying) return
                          event.currentTarget.setPointerCapture(event.pointerId)
                          dragStart.current = event.clientX
                        }
                      : undefined
                  }
                  onPointerMove={
                    top
                      ? (event) => {
                          if (dragStart.current === null || !card.current) return
                          const next = event.clientX - dragStart.current
                          setDistance(next)
                          utils.set(card.current, { x: next, rotate: next / DRAG_ROTATION })
                        }
                      : undefined
                  }
                  onPointerUp={top ? () => release(false) : undefined}
                  onPointerCancel={top ? () => release(true) : undefined}
                >
                  {top && (
                    <>
                      <span
                        aria-hidden
                        className="text-ok absolute top-3 right-3 rotate-6 border-[3px] border-current px-2 py-0.5 font-(family-name:--f-mono) text-sm font-semibold tracking-widest uppercase"
                        style={{ opacity: Math.max(0, Math.min(1, distance / threshold)) }}
                      >
                        Accept
                      </span>
                      <span
                        aria-hidden
                        className="text-bad absolute top-3 left-3 -rotate-6 border-[3px] border-current px-2 py-0.5 font-(family-name:--f-mono) text-sm font-semibold tracking-widest uppercase"
                        style={{ opacity: Math.max(0, Math.min(1, -distance / threshold)) }}
                      >
                        Reject
                      </span>
                    </>
                  )}
                  <div className="spotcheck-label">User asked</div>
                  <div className="spotcheck-heading text-2xl leading-tight text-balance normal-case">{item.question}</div>
                  <div className="spotcheck-label mt-2.5">Model answered</div>
                  <p className="mt-0.5 mb-2 max-w-[52ch] text-sm">{item.answer}</p>
                  <div className="spotcheck-label">{item.meta}</div>
                </div>
              )
            })
        ) : (
          <div className="flex flex-col items-center gap-2.5">
            <b className="spotcheck-display text-[40px]">Queue clear</b>
            <span className="spotcheck-label">
              {tally.accepted} accepted · {tally.rejected} rejected
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button disabled={!current || flying} onClick={() => fling("reject")}>
          ← Reject
        </Button>
        <Button variant="accent" disabled={!current || flying} onClick={() => fling("accept")}>
          Accept →
        </Button>
        <span role="status" className="spotcheck-label" data-testid="review-tally">
          {tally.accepted} accepted · {tally.rejected} rejected
        </span>
      </div>
    </div>
  )
}
