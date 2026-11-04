"use client"

import * as React from "react"
import { motion } from "motion/react"

import { useCopy } from "@/components/site/copy-button"
import { addCommand } from "@/lib/site"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/registry/spotcheck/hooks/use-reduced-motion"

export type TriedPart = { slug: string; title: string; url: string }

const LINE_RULE = "border-[color-mix(in_srgb,var(--paper)_30%,transparent)]"
const SMALL_BUTTON =
  "min-h-8 flex-none cursor-pointer border border-current px-2 font-(family-name:--f-mono) text-[11px] tracking-[.1em] uppercase"

function CopyCommand({ command, label = "Copy", className }: { command: string; label?: string; className?: string }) {
  const { copied, copy } = useCopy()

  return (
    <button type="button" aria-live="polite" onClick={() => copy(command)} className={className}>
      {copied ? "Copied" : label}
    </button>
  )
}

type TriedReceiptProps = {
  /** The parts the visitor tried, in page order. */
  tried: TriedPart[]
  /** Suggested instead when nothing was tried. */
  picks: string[]
  className?: string
}

/** The landing page's receipt: each part the visitor tried, with the command that installs it. */
export function TriedReceipt({ tried, picks, className }: TriedReceiptProps) {
  const reduced = useReducedMotion()
  const count = tried.length

  return (
    <div className={cn("flex w-full min-w-0 flex-col items-start gap-3.5", className)}>
      <motion.div
        data-testid="tried-receipt"
        // The negative insets leave room for the offset shadow.
        initial={reduced ? false : { clipPath: "inset(0 -10px 100% 0)" }}
        animate={{ clipPath: "inset(0 -10px -10px 0)" }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
        className="bg-ink text-paper w-full px-4.5 py-4 font-(family-name:--f-mono) text-[13px] shadow-[6px_6px_0_var(--accent-ink)]"
      >
        <div className="text-[15px] font-semibold">Run Receipt</div>
        <div className="mb-1.5 border-b border-dashed border-current pb-2 opacity-70">
          Spot check · {count > 0 ? `${count} ${count === 1 ? "part" : "parts"} tried` : "nothing tried yet"}
        </div>
        {count > 0 ? (
          <ul>
            {tried.map((part) => {
              const command = addCommand([part.url])
              return (
                <li key={part.slug} className={cn("border-b border-dashed py-1.5", LINE_RULE)}>
                  <div className="flex items-center justify-between gap-3">
                    <span>{part.title}</span>
                    <CopyCommand command={command} className={SMALL_BUTTON} />
                  </div>
                  <code className="mt-0.5 block text-[11.5px] [overflow-wrap:anywhere] opacity-80">{command}</code>
                </li>
              )
            })}
          </ul>
        ) : (
          <>
            <p className="py-1.5">Try a part above, then sign again. Or start with these five:</p>
            <ul>
              {picks.map((pick) => (
                <li key={pick} className="flex justify-between py-0.5">
                  <span>{pick}</span>
                  <span>Pick</span>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="mt-2 flex justify-between border-t-2 border-current pt-1.5 font-semibold">
          <span>Total</span>
          <span>{count > 0 ? `${count} ${count === 1 ? "part" : "parts"}` : "0 tried"}</span>
        </div>
      </motion.div>
      {count > 1 && (
        <CopyCommand
          command={addCommand(tried.map((part) => part.url))}
          label={`Copy all ${count} as one command`}
          className="border-ink hover:bg-ink hover:text-paper min-h-11 cursor-pointer border-(length:--rule) px-4 font-(family-name:--f-mono) text-xs tracking-[.1em] uppercase"
        />
      )}
    </div>
  )
}
