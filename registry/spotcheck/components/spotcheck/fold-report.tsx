"use client"

import * as React from "react"
import { animate, stagger, utils } from "animejs"

import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/registry/spotcheck/hooks/use-reduced-motion"

const OPEN_MS = 520
const CLOSE_MS = 420
const CLOSE_DELAY_MS = 120
const ROW_OPEN_MS = 720
const ROW_CLOSE_MS = 260
const ROW_OPEN_STAGGER_MS = 75
const ROW_CLOSE_STAGGER_MS = 30
const OPEN_FROM_DEGREES = -100
const CLOSE_TO_DEGREES = 80

type FoldContextValue = {
  open: string | null
  toggle: (value: string) => void
}

const FoldContext = React.createContext<FoldContextValue | null>(null)

type FoldReportProps = Omit<React.ComponentProps<"div">, "defaultValue"> & {
  /** The section open at the start. */
  defaultOpen?: string
  /** The open section, when you control it. Use `null` for none. */
  open?: string | null
  /** Runs when a section opens or closes. */
  onOpenChange?: (open: string | null) => void
}

export function FoldReport({ defaultOpen, open, onOpenChange, className, children, ...props }: FoldReportProps) {
  const [internal, setInternal] = React.useState<string | null>(defaultOpen ?? null)
  const current = open !== undefined ? open : internal

  const context = React.useMemo(
    () => ({
      open: current,
      toggle: (value: string) => {
        const next = current === value ? null : value
        setInternal(next)
        onOpenChange?.(next)
      },
    }),
    [current, onOpenChange],
  )

  return (
    <FoldContext.Provider value={context}>
      <div className={cn("flex min-w-0 flex-col", className)} {...props}>
        {children}
      </div>
    </FoldContext.Provider>
  )
}

type FoldSectionProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** Identifies the section. */
  value: string
  title: React.ReactNode
  /** A short note at the end of the header, such as a count. */
  meta?: React.ReactNode
}

export function FoldSection({ value, title, meta, className, children, ...props }: FoldSectionProps) {
  const context = React.useContext(FoldContext)
  if (!context) throw new Error("FoldSection must be inside FoldReport")
  const expanded = context.open === value

  const reduced = useReducedMotion()
  const baseId = React.useId()
  const body = React.useRef<HTMLDivElement>(null)
  const inner = React.useRef<HTMLDivElement>(null)
  const painted = React.useRef(expanded)
  const [startsHidden] = React.useState(!expanded)

  React.useLayoutEffect(() => {
    const panel = body.current
    if (!panel || !inner.current || painted.current === expanded) return
    painted.current = expanded
    const rows = inner.current.querySelectorAll<HTMLElement>("[data-fold-row]")

    utils.remove(panel)
    utils.remove(rows)

    const finish = () => {
      panel.style.height = ""
      rows.forEach((row) => {
        row.style.transform = ""
        row.style.opacity = ""
      })
    }

    if (reduced) {
      finish()
      panel.hidden = !expanded
      return
    }

    if (expanded) {
      // A close that gets interrupted reopens from where it had reached.
      const from = panel.hidden ? 0 : panel.offsetHeight
      panel.hidden = false
      // Rows wait out their stagger, so they start hidden rather than flashing into place.
      rows.forEach((row) => {
        row.style.opacity = "0"
      })
      animate(panel, {
        height: [from, inner.current.offsetHeight],
        duration: OPEN_MS,
        ease: "outQuart",
        onComplete: () => {
          panel.style.height = ""
        },
      })
      animate(rows, {
        rotateX: [OPEN_FROM_DEGREES, 0],
        opacity: [0, 1],
        duration: ROW_OPEN_MS,
        delay: stagger(ROW_OPEN_STAGGER_MS),
        ease: "outBack(1.2)",
        onComplete: finish,
      })
      return
    }

    animate(rows, {
      rotateX: [0, CLOSE_TO_DEGREES],
      opacity: [1, 0],
      duration: ROW_CLOSE_MS,
      delay: stagger(ROW_CLOSE_STAGGER_MS, { from: "last" }),
      ease: "inQuad",
    })
    animate(panel, {
      height: [panel.offsetHeight, 0],
      duration: CLOSE_MS,
      delay: CLOSE_DELAY_MS,
      ease: "inOutQuart",
      onComplete: () => {
        finish()
        panel.hidden = true
      },
    })
  }, [expanded, reduced])

  return (
    <div data-open={expanded || undefined} className={cn("group/fold", className)} {...props}>
      <h3>
        <button
          type="button"
          id={`${baseId}-header`}
          aria-expanded={expanded}
          aria-controls={`${baseId}-panel`}
          className="spotcheck-focus group-data-open/fold:border-ink grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto_1.4rem] items-end gap-2.5 border-b border-[color-mix(in_srgb,var(--ink)_30%,transparent)] pt-3 pb-1.5 text-left"
          onClick={() => context.toggle(value)}
        >
          <span className="spotcheck-heading text-[21px] leading-none">{title}</span>
          {meta !== undefined && <span className="spotcheck-label">{meta}</span>}
          <span
            aria-hidden
            className="group-data-open/fold:text-accent-ink col-start-3 text-center font-(family-name:--f-mono) text-xl leading-none transition-transform duration-300 group-data-open/fold:rotate-45 motion-reduce:transition-none"
          >
            +
          </span>
        </button>
      </h3>
      <div
        ref={body}
        id={`${baseId}-panel`}
        role="region"
        aria-labelledby={`${baseId}-header`}
        hidden={startsHidden}
        className="overflow-hidden"
      >
        <div ref={inner} className="pt-0.5 pb-2.5 perspective-[700px]">
          {children}
        </div>
      </div>
    </div>
  )
}

type FoldRowProps = React.ComponentProps<"div"> & {
  /** The short note on the left, such as a time. */
  label?: React.ReactNode
}

export function FoldRow({ label, className, children, ...props }: FoldRowProps) {
  return (
    <div
      data-fold-row
      className={cn(
        "bg-paper grid origin-top grid-cols-[4.6rem_minmax(0,1fr)] gap-2.5 border-b border-dashed border-[color-mix(in_srgb,var(--ink)_25%,transparent)] pt-2 pb-[3px] text-sm",
        className,
      )}
      {...props}
    >
      <span className="text-mute font-(family-name:--f-mono) text-[11.5px] tabular-nums">{label}</span>
      <span className="min-w-0">{children}</span>
    </div>
  )
}
