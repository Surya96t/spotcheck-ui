"use client"

import * as React from "react"
import { animate, type JSAnimation } from "animejs"

import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/registry/spotcheck/hooks/use-reduced-motion"

const FACE_ANGLE = 90
const FACES = 4
const TURN_MS = 1100
const TURN_EASE = "outElastic(1, .8)"
const PULL_BACK = 0.22
const DEFAULT_WIDTH = 360

export type CubeFace = {
  value: string
  label: string
  content: React.ReactNode
}

/** Quarter turns from one face to another, the short way. Going from 0 to 3 is -1, not 3. */
export function shortestTurn(from: number, to: number) {
  const forward = ((to - from) % FACES + FACES) % FACES
  return forward === FACES - 1 ? -1 : forward
}

type CubeTabsProps = {
  /** Names the tab list for screen readers. */
  label: string
  /** Exactly four faces. Each one holds your own content. */
  faces: [CubeFace, CubeFace, CubeFace, CubeFace]
  /** The selected face's value, when you control it. */
  value?: string
  /** The starting value, when the tabs manage themselves. */
  defaultValue?: string
  /** Runs when a different face is selected. */
  onValueChange?: (value: string) => void
  /** Added to the outer element. */
  className?: string
}

export function CubeTabs({ label, faces, value, defaultValue, onValueChange, className }: CubeTabsProps) {
  const reduced = useReducedMotion()
  const [internal, setInternal] = React.useState(defaultValue ?? faces[0].value)
  const current = value ?? internal
  const index = Math.max(
    0,
    faces.findIndex((face) => face.value === current),
  )
  const baseId = React.useId()

  const box = React.useRef<HTMLDivElement>(null)
  const cube = React.useRef<HTMLDivElement>(null)
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([])
  const turn = React.useRef<JSAnimation | null>(null)
  const shown = React.useRef({ rotation: 0, width: DEFAULT_WIDTH })
  const landed = React.useRef(index)
  const target = React.useRef(index * -FACE_ANGLE)
  const [width, setWidth] = React.useState(DEFAULT_WIDTH)
  const [bar, setBar] = React.useState({ left: 0, width: 0 })

  const paint = React.useCallback((rotation: number, pull = 0) => {
    shown.current.rotation = rotation
    if (cube.current) {
      cube.current.style.transform = `translateZ(${-shown.current.width / 2 - pull}px) rotateY(${rotation}deg)`
    }
  }, [])

  React.useLayoutEffect(() => {
    const element = box.current
    if (!element) return
    const measure = () => {
      shown.current.width = element.clientWidth
      setWidth(element.clientWidth)
      paint(shown.current.rotation)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [paint])

  React.useLayoutEffect(() => {
    const tab = tabs.current[index]
    if (tab) setBar({ left: tab.offsetLeft, width: tab.offsetWidth })
  }, [index, width])

  // The last-landed face decides the direction, and rotation only ever accumulates from there.
  React.useLayoutEffect(() => {
    if (landed.current === index) return
    const from = shown.current.rotation
    const to = target.current - shortestTurn(landed.current, index) * FACE_ANGLE
    target.current = to
    landed.current = index
    cube.current?.setAttribute("data-rotation", String(to))

    turn.current?.cancel()
    if (reduced) return paint(to)

    const state = { rotation: from }
    turn.current = animate(state, {
      rotation: to,
      duration: TURN_MS,
      ease: TURN_EASE,
      onUpdate: () => {
        const progress = Math.min(1, Math.abs((state.rotation - from) / (to - from || 1)))
        paint(state.rotation, Math.sin(progress * Math.PI) * shown.current.width * PULL_BACK)
      },
      onComplete: () => paint(to),
    })
  }, [index, paint, reduced])

  React.useEffect(() => () => void turn.current?.cancel(), [])

  const select = (next: number) => {
    const face = faces[next]
    if (!face || next === index) return
    setInternal(face.value)
    onValueChange?.(face.value)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: (index + 1) % FACES,
      ArrowLeft: (index + FACES - 1) % FACES,
      Home: 0,
      End: FACES - 1,
    }
    const next = moves[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(next)
    tabs.current[next]?.focus()
  }

  return (
    <div className={cn("flex min-w-0 flex-col gap-3.5", className)}>
      <div
        role="tablist"
        aria-label={label}
        className="border-ink relative flex [scrollbar-width:none] overflow-x-auto border-b-(length:--rule)"
        onKeyDown={onKeyDown}
      >
        {faces.map((face, tab) => (
          <button
            key={face.value}
            ref={(element) => {
              tabs.current[tab] = element
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab}`}
            aria-selected={tab === index}
            aria-controls={`${baseId}-panel-${tab}`}
            tabIndex={tab === index ? 0 : -1}
            className="spotcheck-heading spotcheck-focus text-mute aria-selected:text-ink cursor-pointer px-2.5 pt-2 pb-2.5 text-base whitespace-nowrap -outline-offset-2 md:px-3.5 md:text-lg"
            onClick={() => select(tab)}
          >
            {face.label}
          </button>
        ))}
        <span
          aria-hidden
          className="bg-accent-ink absolute bottom-0 h-[5px] transition-[left,width] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] motion-reduce:transition-none"
          style={bar}
        />
      </div>
      <div ref={box} className="relative h-62.5 overflow-hidden perspective-[1300px]">
        <div
          ref={cube}
          data-testid="cube"
          data-rotation={0}
          className="absolute inset-0 transform-3d"
          style={{ transform: `translateZ(${-width / 2}px) rotateY(0deg)` }}
        >
          {faces.map((face, panel) => (
            <div
              key={face.value}
              role="tabpanel"
              id={`${baseId}-panel-${panel}`}
              aria-labelledby={`${baseId}-tab-${panel}`}
              aria-hidden={panel !== index}
              inert={panel !== index}
              className="border-ink bg-raise absolute inset-0 flex flex-col gap-0.5 border-(length:--rule) px-4 py-3.5 backface-hidden"
              style={{ transform: `rotateY(${panel * FACE_ANGLE}deg) translateZ(${width / 2}px)` }}
            >
              {face.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
