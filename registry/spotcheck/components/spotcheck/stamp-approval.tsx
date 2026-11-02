"use client"

import * as React from "react"
import { motion, useAnimate, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { Tag } from "@/registry/spotcheck/components/spotcheck/tag"

const STAMP_SPRING = { type: "spring", stiffness: 520, damping: 19 } as const
const STAMP_START_SCALE = 2.6
const IMPACT_DELAY_MS = 140
const STAMP_TILT = { approved: [-26, -8], denied: [18, 6] }

type Decision = "approved" | "denied"
type Args = Record<string, string>

export type ToolCall = {
  name: string
  args: Args
  /** What the call will actually do, in plain words. People should approve this, not the raw call. */
  resolved: string
  risk?: "low" | "high"
}

type StampApprovalProps = {
  call: ToolCall
  /** Argument names a person may change before approving. */
  editable?: string[]
  /** Runs with the final arguments, including any edits. */
  onApprove?: (args: Args) => void
  onDeny?: () => void
  className?: string
}

export function StampApproval({ call, editable = [], onApprove, onDeny, className }: StampApprovalProps) {
  const [args, setArgs] = React.useState(call.args)
  const [decision, setDecision] = React.useState<Decision | null>(null)
  const [card, animateCard] = useAnimate<HTMLDivElement>()
  const status = React.useRef<HTMLParagraphElement>(null)
  const reduced = useReducedMotion()
  const risky = call.risk === "high"

  const decide = (next: Decision) => {
    setDecision(next)
    if (next === "approved") onApprove?.(args)
    else onDeny?.()
    if (!reduced) {
      setTimeout(() => animateCard(card.current, { y: [0, 5, 0], scale: [1, 0.985, 1] }, { duration: 0.22 }), IMPACT_DELAY_MS)
    }
  }

  // The buttons are gone after a decision, so focus moves to the result.
  React.useEffect(() => {
    if (decision) status.current?.focus()
  }, [decision])

  return (
    <div className={cn("flex flex-col gap-3.5", className)}>
      <div
        ref={card}
        className="border-ink bg-raise relative max-w-160 overflow-hidden border-(length:--rule) px-4 pt-3.5 pb-4 font-(family-name:--f-mono) text-[13px]"
      >
        <div className="mb-2.5 flex flex-wrap justify-between gap-2 border-b border-dashed border-[color-mix(in_srgb,var(--ink)_40%,transparent)] pb-2">
          <span className="spotcheck-label">Agent request · needs approval</span>
          <Tag variant={risky ? "accent" : "outline"}>{risky ? "High risk" : "Low risk"}</Tag>
        </div>
        <p className="mb-3 font-(family-name:--f-body) text-base text-pretty">{call.resolved}</p>
        <div className="spotcheck-heading text-[26px] leading-none">
          {call.name}
          <span className="text-mute">(</span>
        </div>
        <table className="my-2 ml-4.5 border-collapse">
          <tbody>
            {Object.entries(args).map(([name, value]) => (
              <tr key={name}>
                <th scope="row" className="text-mute py-[3px] pr-3.5 text-left align-bottom font-normal">
                  {name}
                </th>
                <td className="py-[3px] align-bottom">
                  {editable.includes(name) && !decision ? (
                    <input
                      aria-label={`Edit ${name}`}
                      value={value}
                      onChange={(event) => setArgs((current) => ({ ...current, [name]: event.target.value }))}
                      className="spotcheck-focus border-ink w-full min-w-40 border-b border-dashed bg-transparent"
                    />
                  ) : (
                    value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="spotcheck-heading text-mute text-[26px] leading-none">)</div>
        {decision && (
          <motion.div
            aria-hidden
            data-testid="stamp"
            data-stamp={decision}
            initial={reduced ? false : { opacity: 0, scale: STAMP_START_SCALE, rotate: STAMP_TILT[decision][0] }}
            animate={{ opacity: 1, scale: 1, rotate: STAMP_TILT[decision][1] }}
            transition={STAMP_SPRING}
            className={cn(
              "spotcheck-display pointer-events-none absolute top-[38%] right-4.5 border-4 border-double border-current px-3.5 py-1.5 text-[32px] leading-none tracking-[.06em] md:text-[44px]",
              decision === "approved" ? "text-accent-ink" : "text-bad",
            )}
          >
            {decision}
          </motion.div>
        )}
      </div>
      {decision ? (
        <p ref={status} tabIndex={-1} role="status" className="spotcheck-label outline-none">
          {decision === "approved" ? "Approved. The tool call was released to the agent." : "Denied. The agent was told to stop."}
        </p>
      ) : (
        <div className="flex flex-wrap gap-4">
          <Button variant="accent" onClick={() => decide("approved")}>
            Approve
          </Button>
          <Button onClick={() => decide("denied")}>Deny</Button>
        </div>
      )}
    </div>
  )
}
