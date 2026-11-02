"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { StatusPill } from "@/registry/spotcheck/components/spotcheck/status-pill"

const COLLAPSE = { type: "spring", stiffness: 420, damping: 36 } as const
const LINE_STYLES = {
  add: "border-ok bg-[color-mix(in_srgb,var(--ok)_10%,transparent)]",
  remove: "border-bad bg-[color-mix(in_srgb,var(--bad)_10%,transparent)]",
  context: "border-transparent",
}
const PREFIXES = { add: "+", remove: "−", context: " " }
const SPOKEN = { add: "Added: ", remove: "Removed: ", context: "" }

export type DiffLine = { kind: keyof typeof LINE_STYLES; text: string }
export type DiffHunk = { id: string; file: string; summary?: string; lines: DiffLine[] }
export type HunkDecision = "accepted" | "rejected"

type DiffReviewProps = {
  hunks: DiffHunk[]
  /** Runs on every decision, with null when one is undone. */
  onDecide?: (id: string, decision: HunkDecision | null) => void
  className?: string
}

export function reviewCounts(hunks: DiffHunk[], decisions: Record<string, HunkDecision>) {
  const reviewed = hunks.filter((hunk) => decisions[hunk.id]).length
  return { reviewed, remaining: hunks.length - reviewed }
}

export function DiffReview({ hunks, onDecide, className }: DiffReviewProps) {
  const [decisions, setDecisions] = React.useState<Record<string, HunkDecision>>({})
  const reduced = useReducedMotion()
  const { reviewed, remaining } = reviewCounts(hunks, decisions)

  const decide = (id: string, decision: HunkDecision | null) => {
    setDecisions((current) => {
      const next = { ...current }
      if (decision) next[id] = decision
      else delete next[id]
      return next
    })
    onDecide?.(id, decision)
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span role="status" className="spotcheck-label" data-testid="review-count">
          {reviewed} of {hunks.length} reviewed
        </span>
        <Button
          variant="ghost"
          disabled={remaining === 0}
          onClick={() => hunks.filter((hunk) => !decisions[hunk.id]).forEach((hunk) => decide(hunk.id, "accepted"))}
        >
          Accept {remaining} left
        </Button>
      </div>
      {hunks.map((hunk) => {
        const decision = decisions[hunk.id]
        return (
          <section key={hunk.id} aria-label={hunk.file} className="border-ink border-(length:--rule)">
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
              <div className="min-w-0">
                <div className="truncate font-(family-name:--f-mono) text-xs font-semibold">{hunk.file}</div>
                {hunk.summary && <div className="text-mute text-[13px]">{hunk.summary}</div>}
              </div>
              {decision ? (
                <div className="flex items-center gap-3">
                  <StatusPill tone={decision === "accepted" ? "ok" : "bad"}>{decision}</StatusPill>
                  <Button variant="ghost" className="px-2 py-1" onClick={() => decide(hunk.id, null)}>
                    Undo
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button aria-label={`Reject change to ${hunk.file}`} className="px-2.5 py-1.5" onClick={() => decide(hunk.id, "rejected")}>
                    Reject
                  </Button>
                  <Button
                    variant="accent"
                    aria-label={`Accept change to ${hunk.file}`}
                    className="px-2.5 py-1.5"
                    onClick={() => decide(hunk.id, "accepted")}
                  >
                    Accept
                  </Button>
                </div>
              )}
            </div>
            <AnimatePresence initial={false}>
              {!decision && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={reduced ? { duration: 0 } : COLLAPSE}
                  className="overflow-hidden"
                >
                  <pre
                    tabIndex={0}
                    className="spotcheck-focus border-ink overflow-x-auto border-t-(length:--rule) py-1.5 font-(family-name:--f-mono) text-[12.5px] leading-[1.55]"
                  >
                    {hunk.lines.map((line, index) => (
                      <div key={index} className={cn("border-l-4 pr-3 pl-2", LINE_STYLES[line.kind])}>
                        <span aria-hidden>{PREFIXES[line.kind]} </span>
                        <span className="sr-only">{SPOKEN[line.kind]}</span>
                        {line.text}
                      </div>
                    ))}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )
      })}
    </div>
  )
}
