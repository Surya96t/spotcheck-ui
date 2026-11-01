"use client"

import * as React from "react"
import { createTimeline, stagger, svg, type Timeline } from "animejs"

import { cn } from "@/lib/utils"
import { useInView } from "@/registry/ledger/hooks/use-in-view"
import { useReducedMotion } from "@/registry/ledger/hooks/use-reduced-motion"

const WIDTH = 520
const HEIGHT = 180
const LEFT = 24
const BOTTOM = 24
const TOP = 20
const POINT_SIZE = 7
const POINT_MS = 300
const POINT_STAGGER_MS = 55
const POINT_DROP = 8
const POINT_OVERLAP = "-=1100"

export function chartPoints(series: number[], max: number) {
  return series.map((value, index) => [
    LEFT + (index / Math.max(1, series.length - 1)) * (WIDTH - LEFT * 2),
    HEIGHT - BOTTOM - (value / max) * (HEIGHT - BOTTOM - TOP),
  ] as const)
}

type DrawChartProps = {
  series: number[]
  /** Summarises the trend for screen readers, such as "Accuracy rose from 38% to 83%". */
  label: string
  /** The heading above the number. */
  title?: string
  /** The top of the scale. Defaults to the highest value. */
  max?: number
  /** Values for the horizontal guide lines. */
  ticks?: number[]
  /** Formats the headline number. Pass it from a client component. */
  format?: (value: number) => string
  /** How long the line takes to draw, in milliseconds. */
  duration?: number
  className?: string
}

export function DrawChart({
  series,
  label,
  title,
  max = Math.max(...series),
  ticks = [],
  format = (value) => String(Math.round(value)),
  duration = 1300,
  className,
}: DrawChartProps) {
  const host = React.useRef<HTMLDivElement>(null)
  const line = React.useRef<SVGPathElement>(null)
  const dots = React.useRef<SVGGElement>(null)
  const headline = React.useRef<HTMLDivElement>(null)
  const inView = useInView(host)
  const reduced = useReducedMotion()
  const formatRef = React.useRef(format)
  const last = series.at(-1) ?? 0
  const points = chartPoints(series, max)
  const path = points.map(([x, y], index) => `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ")

  React.useEffect(() => {
    formatRef.current = format
  })

  React.useEffect(() => {
    if (!inView || reduced || !line.current || !dots.current) return
    const number = headline.current
    const counter = { value: 0 }
    const drawable = svg.createDrawable(line.current)
    const timeline: Timeline = createTimeline({ defaults: { ease: "inOutQuad" } })
      .add(drawable, { draw: ["0 0", "0 1"], duration })
      // translateY, because animating an SVG rect's `y` would overwrite its attribute.
      .add(
        dots.current.querySelectorAll("rect"),
        {
          opacity: [0, 1],
          translateY: [POINT_DROP, 0],
          duration: POINT_MS,
          delay: stagger(POINT_STAGGER_MS),
          ease: "outBack(2)",
        },
        POINT_OVERLAP,
      )
      .add(
        counter,
        {
          value: last,
          duration,
          ease: "outExpo",
          onUpdate: () => {
            if (number) number.textContent = formatRef.current(counter.value)
          },
        },
        0,
      )
    return () => {
      timeline.revert()
      if (number) number.textContent = formatRef.current(last)
    }
  }, [duration, inView, last, reduced])

  return (
    <div ref={host} className={cn("flex flex-col gap-3.5", className)}>
      <div>
        {title && <div className="ledger-label">{title}</div>}
        <div ref={headline} data-testid="draw-chart-value" className="ledger-display text-[64px] leading-[.9] tabular-nums">
          {format(last)}
        </div>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label} className="block h-auto w-full">
        {ticks.map((tick) => {
          const y = HEIGHT - BOTTOM - (tick / max) * (HEIGHT - BOTTOM - TOP)
          return (
            <g key={tick}>
              <line x1={LEFT} x2={WIDTH - LEFT} y1={y} y2={y} stroke="var(--wash)" strokeWidth="1" />
              <text x={LEFT - 6} y={y + 4} textAnchor="end" fontSize="10" fontFamily="var(--f-mono)" fill="var(--mute)">
                {tick}
              </text>
            </g>
          )
        })}
        <path ref={line} d={path} fill="none" stroke="var(--accent-ink)" strokeWidth="3" strokeLinejoin="round" />
        <g ref={dots}>
          {points.map(([x, y], index) => (
            <rect
              key={index}
              x={x - POINT_SIZE / 2}
              y={y - POINT_SIZE / 2}
              width={POINT_SIZE}
              height={POINT_SIZE}
              fill="var(--ink)"
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
