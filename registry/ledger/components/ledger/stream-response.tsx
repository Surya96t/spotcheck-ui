"use client"

import * as React from "react"
import { Streamdown } from "streamdown"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/ledger/components/ledger/button"
import type { StreamSource, StreamStatus } from "@/registry/ledger/hooks/use-stream"

const CITE_PREFIX = "#cite-"

/** Turns [1] into a link Streamdown can render, leaving markdown links alone. */
export function linkCitations(text: string) {
  return text.replace(/\[(\d+)\](?!\()/g, `[$1](${CITE_PREFIX}$1)`)
}

/** Sentences that have finished, so screen readers aren't sent every token. */
export function finishedSentences(text: string) {
  return text.match(/\S[^\n]*?[.!?]+(?=\s|$)/g) ?? []
}

const MARKDOWN = {
  p: (props: React.ComponentProps<"p">) => <p className="my-2.5 first:mt-0" {...props} />,
  ul: (props: React.ComponentProps<"ul">) => <ul className="my-2.5 list-['+_'] pl-5" {...props} />,
  ol: (props: React.ComponentProps<"ol">) => <ol className="my-2.5 list-decimal pl-5" {...props} />,
  strong: (props: React.ComponentProps<"strong">) => <strong className="font-bold" {...props} />,
  code: (props: React.ComponentProps<"code">) => (
    <code className="bg-wash px-1 font-(family-name:--f-mono) text-[.9em]" {...props} />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      tabIndex={0}
      className="bg-ink text-paper my-2.5 overflow-x-auto p-3 font-(family-name:--f-mono) text-[12.5px] [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
  a: ({ href = "", children, ...props }: React.ComponentProps<"a">) =>
    href.startsWith(CITE_PREFIX) ? (
      <a
        href={href}
        aria-label={`Source ${href.slice(CITE_PREFIX.length)}`}
        className="bg-ink text-paper hover:bg-accent-ink hover:text-on-accent ledger-focus mx-0.5 inline-flex h-[1.25em] min-w-[1.4em] items-center justify-center px-1 align-[2px] font-(family-name:--f-mono) text-[10.5px] no-underline"
      >
        {href.slice(CITE_PREFIX.length)}
      </a>
    ) : (
      <a href={href} className="text-accent-ink underline underline-offset-2" {...props}>
        {children}
      </a>
    ),
}

type StreamResponseProps = {
  /** The text so far. Markdown is rendered as it arrives, and [1] becomes a citation. */
  text: string
  sources?: StreamSource[]
  status: StreamStatus
  /** Shows a Stop button while streaming. */
  onStop?: () => void
  /** Shows a Regenerate button once it's finished. */
  onRegenerate?: () => void
  /** Shown if the stream fails. */
  error?: string | null
  className?: string
}

export function StreamResponse({ text, sources = [], status, onStop, onRegenerate, error, className }: StreamResponseProps) {
  const streaming = status === "streaming"
  const spoken = streaming ? finishedSentences(text).at(-1) : ""

  return (
    <div className={cn("flex flex-col gap-3.5", className)}>
      <div aria-busy={streaming} className="min-h-[5em] max-w-[62ch] text-base leading-relaxed text-pretty">
        <Streamdown
          mode={streaming ? "streaming" : "static"}
          controls={false}
          linkSafety={{ enabled: false }}
          components={MARKDOWN}
        >
          {linkCitations(text)}
        </Streamdown>
        {streaming && (
          <span
            aria-hidden
            data-testid="stream-caret"
            className="bg-accent-ink inline-block h-[1.05em] w-[.55em] align-[-2px] motion-safe:[animation:ledger-blink_1s_steps(1)_infinite]"
          />
        )}
      </div>
      {/* One sentence at a time, because announcing tokens makes a screen reader unusable. */}
      <div role="status" className="sr-only">
        {streaming ? spoken : status === "done" ? "Response complete." : ""}
      </div>
      {error && (
        <p role="alert" className="text-bad font-(family-name:--f-mono) text-xs">
          {error}
        </p>
      )}
      {sources.length > 0 && (
        <ol className="border-ink flex flex-wrap border-(length:--rule)">
          {sources.map((source, index) => (
            <li
              key={source.id}
              id={`cite-${index + 1}`}
              className="border-ink min-w-0 flex-[1_1_140px] border-r-(length:--rule) px-2.5 py-1.5 text-xs last:border-r-0"
            >
              <b className="text-mute block font-(family-name:--f-mono) text-[10.5px]">[{index + 1}]</b>
              {source.url ? (
                <a href={source.url} className="ledger-focus underline underline-offset-2">
                  {source.title}
                </a>
              ) : (
                source.title
              )}
            </li>
          ))}
        </ol>
      )}
      <div className="flex flex-wrap items-center gap-4">
        {streaming
          ? onStop && <Button onClick={onStop}>Stop</Button>
          : onRegenerate && (
              <Button variant="accent" onClick={onRegenerate}>
                Regenerate
              </Button>
            )}
        <span className="ledger-label" data-testid="stream-status">
          {status}
        </span>
      </div>
    </div>
  )
}
