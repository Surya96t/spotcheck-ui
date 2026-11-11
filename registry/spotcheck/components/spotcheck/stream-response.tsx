"use client"

import * as React from "react"
import { Streamdown } from "streamdown"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import type { StreamSource, StreamStatus } from "@/registry/spotcheck/hooks/use-stream"

const CITE_PREFIX = "#cite-"

/**
 * Turns [1] into a link Streamdown can render, leaving markdown links alone. Pass a scope when
 * several responses share a page, so each citation reaches its own source.
 */
export function linkCitations(text: string, scope?: string) {
  const prefix = scope ? `${CITE_PREFIX}${scope}-` : CITE_PREFIX
  return text.replace(/\[(\d+)\](?!\()/g, `[$1](${prefix}$1)`)
}

function useCiteScope() {
  return React.useId().replace(/\W/g, "")
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
        aria-label={`Source ${href.split("-").at(-1)}`}
        className="bg-ink text-paper hover:bg-accent-ink hover:text-on-accent spotcheck-focus mx-0.5 inline-flex h-[1.25em] min-w-[1.4em] items-center justify-center px-1 align-[2px] font-(family-name:--f-mono) text-[10.5px] no-underline"
      >
        {href.split("-").at(-1)}
      </a>
    ) : (
      <a href={href} className="text-accent-ink underline underline-offset-2" {...props}>
        {children}
      </a>
    ),
}

type StreamMarkdownProps = {
  text: string
  scope: string
  streaming?: boolean
  className?: string
  children?: React.ReactNode
}

function StreamMarkdown({ text, scope, streaming = false, className, children }: StreamMarkdownProps) {
  return (
    <div aria-busy={streaming} className={cn("max-w-[62ch] text-base leading-relaxed text-pretty", className)}>
      <Streamdown
        mode={streaming ? "streaming" : "static"}
        controls={false}
        linkSafety={{ enabled: false }}
        components={MARKDOWN}
      >
        {linkCitations(text, scope)}
      </Streamdown>
      {children}
    </div>
  )
}

function StreamSources({ sources, scope }: { sources: StreamSource[]; scope: string }) {
  if (sources.length === 0) return null

  return (
    <ol className="border-ink flex flex-wrap border-(length:--rule)">
      {sources.map((source, index) => (
        <li
          key={source.id}
          id={`cite-${scope}-${index + 1}`}
          className="border-ink min-w-0 flex-[1_1_140px] border-r-(length:--rule) px-2.5 py-1.5 text-xs last:border-r-0"
        >
          <b className="text-mute block font-(family-name:--f-mono) text-[10.5px]">[{index + 1}]</b>
          {source.url ? (
            <a href={source.url} className="spotcheck-focus underline underline-offset-2">
              {source.title}
            </a>
          ) : (
            source.title
          )}
        </li>
      ))}
    </ol>
  )
}

/** A finished response with nothing live about it, for showing saved replies. */
export function SavedResponse({ text, sources = [], className }: { text: string; sources?: StreamSource[]; className?: string }) {
  const scope = useCiteScope()

  return (
    <div className={cn("flex flex-col gap-3.5 font-(family-name:--f-body)", className)}>
      <StreamMarkdown text={text} scope={scope} />
      <StreamSources sources={sources} scope={scope} />
    </div>
  )
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
  const scope = useCiteScope()

  return (
    <div className={cn("flex flex-col gap-3.5 font-(family-name:--f-body)", className)}>
      <StreamMarkdown text={text} scope={scope} streaming={streaming} className="min-h-[5em]">
        {streaming && (
          <span
            aria-hidden
            data-testid="stream-caret"
            className="bg-accent-ink inline-block h-[1.05em] w-[.55em] align-[-2px] motion-safe:[animation:spotcheck-blink_1s_steps(1)_infinite]"
          />
        )}
      </StreamMarkdown>
      {/* One sentence at a time, because announcing tokens makes a screen reader unusable. */}
      <div role="status" className="sr-only">
        {streaming ? spoken : status === "done" ? "Response complete." : ""}
      </div>
      {error && (
        <p role="alert" className="text-bad font-(family-name:--f-mono) text-xs">
          {error}
        </p>
      )}
      <StreamSources sources={sources} scope={scope} />
      <div className="flex flex-wrap items-center gap-4">
        {streaming
          ? onStop && <Button onClick={onStop}>Stop</Button>
          : onRegenerate && (
              <Button variant="accent" onClick={onRegenerate}>
                Regenerate
              </Button>
            )}
        <span className="spotcheck-label" data-testid="stream-status">
          {status}
        </span>
      </div>
    </div>
  )
}
