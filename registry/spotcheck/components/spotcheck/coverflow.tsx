"use client"

import * as React from "react"
import { motion, type MotionValue, useTransform } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { useFlick } from "@/registry/spotcheck/hooks/use-flick"

const MAX_CARD_WIDTH = 220
const CARD_FRACTION = 0.5
const OVERLAP = 0.62
const STACK = 0.3
const SIDE_DEPTH = 150
const STACK_DEPTH = 40
const SIDE_ANGLE = 55
const HIDDEN_AFTER = 3.6
const DEFAULT_WIDTH = 200

export type CoverflowItem = {
  value: string
  /** The card itself. Its text is what screen readers read. */
  content: React.ReactNode
  /** One line printed beside the buttons while this card is selected. */
  summary?: string
}

/** Places a card from its distance to the centre, in cards. Past one card they stack up. */
export function cardPose(distance: number, width: number) {
  const reach = Math.abs(distance)
  const side = Math.min(reach, 1)
  const beyond = Math.max(0, reach - 1)
  return {
    x: Math.sign(distance) * (side * width * OVERLAP + beyond * width * STACK),
    z: -side * SIDE_DEPTH - beyond * STACK_DEPTH,
    rotateY: -Math.max(-1, Math.min(1, distance)) * SIDE_ANGLE,
    zIndex: 100 - Math.round(reach * 10),
    opacity: reach > HIDDEN_AFTER ? 0 : 1,
  }
}

type CoverCardProps = {
  id: string
  index: number
  width: number
  count: number
  item: CoverflowItem
  selected: boolean
  position: MotionValue<number>
}

function CoverCard({ id, index, width, count, item, selected, position }: CoverCardProps) {
  const transform = useTransform(position, (value) => {
    const { x, z, rotateY } = cardPose(index - value, width)
    return `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) rotateY(${rotateY}deg)`
  })
  const zIndex = useTransform(position, (value) => cardPose(index - value, width).zIndex)
  const opacity = useTransform(position, (value) => cardPose(index - value, width).opacity)

  return (
    <motion.div
      id={id}
      role="option"
      aria-selected={selected}
      aria-posinset={index + 1}
      aria-setsize={count}
      data-index={index}
      className="border-ink bg-raise absolute top-1/2 left-1/2 flex h-[262px] w-[min(220px,50%)] flex-col gap-1 overflow-hidden border-(length:--rule) p-3.5 shadow-[6px_6px_0_var(--ink)] select-none will-change-transform"
      style={{ transform, zIndex, opacity }}
    >
      {selected && <span aria-hidden className="bg-accent-ink absolute inset-x-0 top-0 h-[7px]" />}
      {item.content}
    </motion.div>
  )
}

type CoverflowProps = {
  /** Names the list for screen readers. */
  label: string
  items: CoverflowItem[]
  /** The selected card's value, when you control it. */
  value?: string
  /** The starting value, when the shelf manages itself. */
  defaultValue?: string
  /** Runs when the shelf lands on a different card. */
  onValueChange?: (value: string) => void
  /** Added to the outer element. */
  className?: string
}

export function Coverflow({ label, items, value, defaultValue, onValueChange, className }: CoverflowProps) {
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.value)
  const current = value ?? internal
  const index = Math.max(
    0,
    items.findIndex((item) => item.value === current),
  )
  const count = items.length
  const baseId = React.useId()
  const stage = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(DEFAULT_WIDTH)

  React.useLayoutEffect(() => {
    const element = stage.current
    if (!element) return
    const measure = () => setWidth(Math.min(MAX_CARD_WIDTH, element.clientWidth * CARD_FRACTION))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const { position, settle, bind } = useFlick({
    count,
    index,
    onIndexChange: (next) => {
      const item = items[next]
      if (!item) return
      setInternal(item.value)
      onValueChange?.(item.value)
    },
    axis: "x",
    step: () => width * OVERLAP,
    onTap: (event) => {
      // The stage holds the pointer, so the card has to be found from the press point.
      const card = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>("[data-index]")
      if (card) settle(Number(card.dataset.index))
    },
  })

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: count - 1 }
    const next = moves[event.key]
    if (next === undefined) return
    event.preventDefault()
    settle(next)
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-3.5 font-(family-name:--f-body)", className)}>
      <div
        ref={stage}
        role="listbox"
        tabIndex={0}
        aria-label={label}
        aria-orientation="horizontal"
        aria-activedescendant={`${baseId}-${index}`}
        className="spotcheck-focus relative h-80 cursor-grab touch-pan-y overflow-hidden border border-dashed border-[color-mix(in_srgb,var(--ink)_40%,transparent)] perspective-[1100px] active:cursor-grabbing"
        onKeyDown={onKeyDown}
        {...bind}
      >
        {items.map((item, card) => (
          <CoverCard
            key={item.value}
            id={`${baseId}-${card}`}
            index={card}
            width={width}
            count={count}
            item={item}
            selected={card === index}
            position={position}
          />
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex gap-2">
          <Button aria-label="Previous" disabled={index === 0} onClick={() => settle(index - 1)}>
            <span aria-hidden>←</span>
          </Button>
          <Button aria-label="Next" disabled={index === count - 1} onClick={() => settle(index + 1)}>
            <span aria-hidden>→</span>
          </Button>
        </div>
        {items[index]?.summary && (
          <span className="spotcheck-label text-ink!" data-testid="coverflow-summary">
            {items[index].summary}
          </span>
        )}
      </div>
    </div>
  )
}
