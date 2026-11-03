"use client"

import * as React from "react"
import { motion } from "motion/react"

import { Demo } from "@/components/site/demos"
import { WhenSeen } from "@/components/site/when-seen"
import { cn } from "@/lib/utils"
import { RunReceipt } from "@/registry/spotcheck/components/spotcheck/run-receipt"
import { StampApproval, type ToolCall } from "@/registry/spotcheck/components/spotcheck/stamp-approval"
import { StreamResponse } from "@/registry/spotcheck/components/spotcheck/stream-response"
import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { useInView } from "@/registry/spotcheck/hooks/use-in-view"
import { useReducedMotion } from "@/registry/spotcheck/hooks/use-reduced-motion"
import { useStream } from "@/registry/spotcheck/hooks/use-stream"
import { ModelRaceDemo } from "@/registry/spotcheck/examples/model-race-demo"

// The centre band of the screen, so a chapter is stamped while you're reading it.
const READING_BAND = "-40% 0px -45% 0px"

const CALL: ToolCall = {
  name: "shadcn_add",
  args: { components: "detent-slider, split-flap, tilt-card, diff-review, stamp-approval" },
  resolved: "Adds 5 components to your project.",
  risk: "low",
}

const RECEIPT = [
  { label: "Detent Slider", value: "Pass" },
  { label: "Split-Flap Board", value: "Pass" },
  { label: "Tilt Card", value: "Pass" },
  { label: "Diff Review", value: "Pass" },
  { label: "Stamp Approval", value: "Pass" },
]

function CheckedStamp({ show }: { show: boolean }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      aria-hidden={!show}
      data-testid="checked"
      data-checked={show}
      initial={false}
      animate={show ? { opacity: 1, scale: 1, rotate: -7 } : { opacity: 0, scale: 2.8, rotate: -18 }}
      transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 18 }}
      className="spotcheck-display text-ok mt-5 inline-block border-3 border-current px-3 pt-2 pb-1 text-[26px] leading-none"
    >
      Checked
    </motion.div>
  )
}

type ChapterProps = {
  index: number
  question: string
  note: string
  /** Stamps the chapter from outside instead of when it's reached. */
  checked?: boolean
  children: React.ReactNode
  className?: string
}

function Chapter({ index, question, note, checked, children, className }: ChapterProps) {
  const anchor = React.useRef<HTMLElement>(null)
  const reading = useInView(anchor, READING_BAND)
  const [reached, setReached] = React.useState(false)

  if (reading && !reached) setReached(true)

  return (
    <article
      ref={anchor}
      aria-labelledby={`check-${index}`}
      data-testid={`check-${index}`}
      className="border-ink flex flex-col border-b-(length:--rule) lg:min-h-[720px] lg:flex-row"
    >
      <div className="border-ink min-w-0 border-b-(length:--rule) px-4 pt-6 pb-7 md:px-8 lg:basis-5/13 lg:border-r-(length:--rule) lg:border-b-0">
        <div className="lg:sticky lg:top-[92px]">
          <div className="spotcheck-label mb-3">Check {String(index).padStart(2, "0")}</div>
          <h3 data-copy id={`check-${index}`} className="spotcheck-display text-[clamp(52px,6.4vw,96px)] leading-[.88]">
            {question}
          </h3>
          <p data-copy className="mt-3.5 max-w-[30ch] text-pretty">{note}</p>
          <CheckedStamp show={checked ?? reached} />
        </div>
      </div>
      <div className={cn("bg-wash flex min-w-0 flex-col justify-center gap-5 p-4 md:gap-6.5 md:p-10 lg:basis-8/13", className)}>
        {children}
      </div>
    </article>
  )
}

function Stage({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("border-ink bg-paper min-w-0 border-(length:--rule) p-4 shadow-[6px_6px_0_var(--ink)]", className)}>
      {children}
    </div>
  )
}

function Part({ slug, minHeight = 200, className }: { slug: string; minHeight?: number; className?: string }) {
  return (
    <WhenSeen minHeight={minHeight}>
      <Stage className={className}>
        <Demo slug={slug} />
      </Stage>
    </WhenSeen>
  )
}

const PAIR = "grid min-w-0 gap-5 md:grid-cols-2 md:gap-6.5"

function AnswerStage() {
  const stream = useStream("/api/demo/chat")
  const anchor = React.useRef<HTMLDivElement>(null)
  const inView = useInView(anchor, "-20% 0px")
  const { start, status } = stream

  React.useEffect(() => {
    if (inView && status === "idle") void start()
  }, [inView, start, status])

  return (
    <div ref={anchor}>
      <Stage>
        <div className="bg-ink text-paper mb-4 ml-auto w-fit max-w-[80%] px-3 py-2 text-sm">
          What changed in the refund policy this quarter?
        </div>
        <StreamResponse
          text={stream.text}
          sources={stream.sources}
          status={stream.status}
          error={stream.error}
          onStop={stream.stop}
          onRegenerate={() => void stream.regenerate()}
        />
      </Stage>
    </div>
  )
}

function SignStage({ onSigned }: { onSigned: (signed: boolean) => void }) {
  const [signed, setSigned] = React.useState(false)
  const [run, setRun] = React.useState(0)

  const change = (next: boolean) => {
    setSigned(next)
    onSigned(next)
  }

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] items-center gap-5 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <Stage>
        <StampApproval key={run} call={CALL} onApprove={() => change(true)} />
      </Stage>
      <div className="flex min-w-0 flex-col items-start gap-3">
        {signed ? (
          <>
            <RunReceipt title="Run Receipt" meta="Spot check · 5 parts" lines={RECEIPT} total={{ label: "Total", value: "5 of 5" }} className="w-full" />
            <Button
              variant="ghost"
              onClick={() => {
                change(false)
                setRun((current) => current + 1)
              }}
            >
              Reopen the file
            </Button>
          </>
        ) : (
          <div className="spotcheck-label border-ink flex min-h-60 w-full items-center justify-center border-(length:--rule) border-dashed p-4 text-center">
            The receipt prints when you sign
          </div>
        )}
      </div>
    </div>
  )
}

export function SpotCheck() {
  const [signed, setSigned] = React.useState(false)

  return (
    <section id="spot-check" aria-labelledby="check-title">
      <div className="border-ink flex flex-col items-start justify-between gap-3 border-b-(length:--rule) px-4 pt-10 pb-3 md:flex-row md:items-end md:px-8 md:pt-14">
        <h2 id="check-title" className="landing-mask spotcheck-display text-[clamp(52px,7.4vw,108px)] leading-[.88]">
          <span data-rise>Run a spot check</span>
        </h2>
        <p data-copy className="text-mute max-w-[30ch] text-[15px]">
          Five questions. Try each part yourself.
        </p>
      </div>

      <Chapter index={1} question="Does it feel right?" note="Controls with real weight under your hand.">
        <Part slug="detent-slider" />
        <div className={PAIR}>
          <Part slug="hold-button" minHeight={140} />
          <Part slug="magnetic-button" minHeight={140} />
        </div>
      </Chapter>

      <Chapter index={2} question="Does it move right?" note="Motion that shows what changed.">
        <Part slug="split-flap" />
        <div className={PAIR}>
          <Part slug="draw-chart" />
          <Part slug="ripple-heatmap" />
        </div>
      </Chapter>

      <Chapter index={3} question="Does it have depth?" note="3D inside everyday components.">
        <div className={PAIR}>
          <Part slug="tilt-card" minHeight={300} />
          <Part slug="drum-picker" minHeight={300} />
        </div>
        <Part slug="cube-tabs" />
      </Chapter>

      <Chapter index={4} question="Can you trust it?" note="Review what AI did before anyone relies on it.">
        <AnswerStage />
        <Part slug="trace-waterfall" minHeight={240} />
        <WhenSeen minHeight={260} margin="-20% 0px">
          <Stage>
            <ModelRaceDemo autoStart />
          </Stage>
        </WhenSeen>
        <Part slug="diff-review" minHeight={420} />
      </Chapter>

      <Chapter index={5} question="Can you ship it?" note="Sign it off. The code is yours." checked={signed}>
        <SignStage onSigned={setSigned} />
      </Chapter>
    </section>
  )
}
