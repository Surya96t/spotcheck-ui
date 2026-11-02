"use client"

import Link from "next/link"
import * as React from "react"

import { Demo } from "@/components/site/demos"
import { cn } from "@/lib/utils"
import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { RollNumber } from "@/registry/spotcheck/components/spotcheck/roll-number"
import { RunReceipt } from "@/registry/spotcheck/components/spotcheck/run-receipt"
import { StampApproval, type ToolCall } from "@/registry/spotcheck/components/spotcheck/stamp-approval"
import { StatusPill } from "@/registry/spotcheck/components/spotcheck/status-pill"
import { StreamResponse } from "@/registry/spotcheck/components/spotcheck/stream-response"
import { useInView } from "@/registry/spotcheck/hooks/use-in-view"
import { useStream } from "@/registry/spotcheck/hooks/use-stream"
import { ModelRaceDemo } from "@/registry/spotcheck/examples/model-race-demo"

import { WhenSeen } from "./when-seen"

export type PartLink = { slug: string; no: string; title: string }

const ENTRIES = [
  { title: "Answer", note: "3 citations", spend: 0.0031 },
  { title: "Trace", note: "1 failed call", spend: 0.0058 },
  { title: "Grades", note: "3 models", spend: 0.0071 },
  { title: "Diff", note: "3 changes", spend: 0.0083 },
  { title: "Sign-off", note: "Hold to stamp", spend: 0.0092 },
]

const SPEND_FORMAT = { style: "currency", currency: "USD", minimumFractionDigits: 4 } as const
// The centre band of the screen, so an entry posts when you're reading it.
const READING_BAND = "-40% 0px -55% 0px"

const CALL: ToolCall = {
  name: "send_email",
  args: { to: "finance@example.com", subject: "Q3 refund summary", attach: "refunds-q3.csv · 41 rows" },
  resolved: "Emails 41 refund rows to finance@example.com.",
  risk: "high",
}

const RECEIPT = [
  { label: "Input tokens", value: "2,140" },
  { label: "Output tokens", value: "412" },
  { label: "Cached tokens", value: "1,600" },
  { label: "Tool calls", value: "5" },
  { label: "Duration", value: "2.84 s" },
]

type EntryProps = {
  index: number
  title: string
  body: string
  parts: PartLink[]
  onReach: (index: number) => void
  children: React.ReactNode
}

function Entry({ index, title, body, parts, onReach, children }: EntryProps) {
  const anchor = React.useRef<HTMLElement>(null)
  const reading = useInView(anchor, READING_BAND)

  React.useEffect(() => {
    if (reading) onReach(index)
  }, [index, onReach, reading])

  return (
    <article
      ref={anchor}
      aria-labelledby={`entry-${index}`}
      data-testid={`entry-${index + 1}`}
      className="border-ink grid min-w-0 grid-cols-[minmax(0,1fr)] border-b-(length:--rule) xl:min-h-[86dvh] xl:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]"
    >
      <div className="border-ink flex flex-col justify-end border-b-(length:--rule) p-4.5 xl:border-r-(length:--rule) xl:border-b-0">
        <div className="xl:sticky xl:bottom-6">
          <span className="spotcheck-label mb-2 block">Entry {String(index + 1).padStart(2, "0")}</span>
          <h3 id={`entry-${index}`} className="spotcheck-display text-[clamp(44px,6vw,92px)] leading-[.86]">
            {title}
          </h3>
          <p className="mt-3 max-w-[38ch] text-pretty">{body}</p>
          <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-(family-name:--f-mono) text-xs">
            {parts.map((part) => (
              <li key={part.slug}>
                <Link href={`/components/${part.slug}`} className="underline underline-offset-2 hover:text-accent-ink">
                  {part.no} {part.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-wash flex min-w-0 flex-col justify-center gap-5 p-4 md:p-7">{children}</div>
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
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
      <Stage>
        <StampApproval key={run} call={CALL} editable={["subject"]} onApprove={() => change(true)} />
      </Stage>
      <div className="flex min-w-0 flex-col items-start gap-3">
        {signed ? (
          <>
            <RunReceipt
              title="Run R-2041"
              meta="atlas-l · 31 Oct 21:42"
              lines={RECEIPT}
              total={{ label: "Total", value: "$0.0092" }}
              className="w-full"
            />
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

function Margin({ reached, signed }: { reached: number; signed: boolean }) {
  const open = signed ? 0 : ENTRIES.length - reached
  const spend = ENTRIES[reached]?.spend ?? 0

  return (
    <aside
      aria-label="Running tally"
      className="border-ink bg-paper sticky top-0 z-[5] flex min-w-0 flex-col border-b-(length:--rule) lg:top-12 lg:h-[calc(100dvh-3rem)] lg:self-start lg:border-b-0"
    >
      <div className="spotcheck-label border-ink hidden border-b-(length:--rule) p-3.5 lg:block">Running tally · R-2041</div>
      <ol className="hidden grow font-(family-name:--f-mono) text-xs lg:block">
        {ENTRIES.map((entry, index) => {
          const posted = index < reached || signed
          return (
            <li
              key={entry.title}
              aria-current={index === reached && !signed ? "step" : undefined}
              className={cn(
                "border-ink flex items-baseline justify-between gap-2 border-b border-dashed px-3.5 py-3",
                index === reached && !signed && "bg-accent-ink text-on-accent",
                index > reached && !signed && "text-mute",
              )}
            >
              <span>
                {String(index + 1).padStart(2, "0")} {entry.title}
              </span>
              <span className="text-[11px]">{posted ? "Posted" : entry.note}</span>
            </li>
          )
        })}
      </ol>
      <div className="border-ink grid grid-cols-[auto_1fr] items-center gap-x-5 px-3.5 py-2 lg:grid-cols-1 lg:gap-3 lg:border-t-(length:--rule) lg:py-3.5">
        <div className="flex items-center justify-between gap-3 lg:items-end">
          <span className="spotcheck-label">Open items</span>
          <RollNumber value={open} className="spotcheck-display text-2xl leading-none lg:text-[44px]" />
        </div>
        <div className="flex items-center justify-between gap-3 lg:items-end">
          <span className="spotcheck-label">Spend</span>
          <RollNumber
            value={spend}
            formatOptions={SPEND_FORMAT}
            className="font-(family-name:--f-mono) text-sm tabular-nums lg:text-lg"
          />
        </div>
        <div className="hidden lg:block" data-testid="spotcheck-state">
          {signed ? <StatusPill tone="ok">Books closed</StatusPill> : <StatusPill tone="warn">In review</StatusPill>}
        </div>
      </div>
    </aside>
  )
}

export function CaseFile({ parts }: { parts: Record<string, PartLink> }) {
  const [reached, setReached] = React.useState(0)
  const [signed, setSigned] = React.useState(false)
  const reach = React.useCallback((index: number) => setReached((current) => Math.max(current, index)), [])
  const pick = (...slugs: string[]) => slugs.flatMap((slug) => parts[slug] ?? [])

  return (
    <section id="case-file" aria-labelledby="case-file-title" className="@container">
      <div className="border-ink flex flex-col items-start justify-between gap-3 border-b-(length:--rule) px-4.5 pt-10 pb-3 md:flex-row md:items-end">
        <h2 id="case-file-title" className="spotcheck-display text-[clamp(40px,7vw,104px)] leading-[.85]">
          One run, audited
        </h2>
        <p className="text-mute max-w-[42ch] text-[13.5px] md:text-right">
          A support agent answers a refund question. Everything below is a real component, working the same case.
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="border-ink order-2 min-w-0 lg:order-1 lg:border-r-(length:--rule)">
          <Entry
            index={0}
            title="It answers"
            body="A real AI SDK stream. Markdown renders as it arrives, every claim links to a source, and screen readers get sentences instead of tokens."
            parts={pick("stream-response", "chat-screen")}
            onReach={reach}
          >
            <AnswerStage />
          </Entry>

          <Entry
            index={1}
            title="It shows its working"
            body="Every step, with its timing. The red bar is a lookup that failed, and the answer went out anyway. You'd want to know that."
            parts={pick("agent-trace", "trace-waterfall")}
            onReach={reach}
          >
            <WhenSeen minHeight={320} margin="0px">
              <Stage>
                <Demo slug="agent-trace" />
              </Stage>
            </WhenSeen>
            <WhenSeen minHeight={240}>
              <Stage>
                <Demo slug="trace-waterfall" />
              </Stage>
            </WhenSeen>
          </Entry>

          <Entry
            index={2}
            title="You grade it"
            body="Scores by model and task, then the same answer from three models, racing on speed and cost."
            parts={pick("eval-matrix", "model-race")}
            onReach={reach}
          >
            <WhenSeen minHeight={260}>
              <Stage>
                <Demo slug="eval-matrix" />
              </Stage>
            </WhenSeen>
            <WhenSeen minHeight={260} margin="-20% 0px">
              <Stage>
                <ModelRaceDemo autoStart />
              </Stage>
            </WhenSeen>
          </Entry>

          <Entry
            index={3}
            title="You review the change"
            body="The agent wants to change the policy. Accept or reject each hunk by mouse or keyboard, and nothing lands by default."
            parts={pick("diff-review")}
            onReach={reach}
          >
            <WhenSeen minHeight={420}>
              <Stage>
                <Demo slug="diff-review" />
              </Stage>
            </WhenSeen>
          </Entry>

          <Entry
            index={4}
            title="You sign for it"
            body="Approve what will actually happen, not a raw tool call. Read it, then hold the stamp down until it lands."
            parts={pick("stamp-approval", "run-receipt")}
            onReach={reach}
          >
            <SignStage onSigned={setSigned} />
          </Entry>
        </div>
        <div className="order-1 min-w-0 lg:order-2">
          <Margin reached={reached} signed={signed} />
        </div>
      </div>
    </section>
  )
}
