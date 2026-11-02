"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { AppFrame } from "@/registry/spotcheck/components/spotcheck/app-frame"
import { SavedResponse, StreamResponse } from "@/registry/spotcheck/components/spotcheck/stream-response"
import { useStream, type StreamSource } from "@/registry/spotcheck/hooks/use-stream"

export type ChatMessage = { role: "user" | "assistant"; text: string; sources?: StreamSource[] }
export type ChatThread = { id: string; title: string; when: string; messages: ChatMessage[] }

type ChatScreenProps = {
  /** The endpoint that streams replies. It receives { messages } as JSON. */
  api: string
  threads: ChatThread[]
  className?: string
}

export function ChatScreen({ api, threads, className }: ChatScreenProps) {
  const [all, setAll] = React.useState(threads)
  const [activeId, setActiveId] = React.useState(threads[0]?.id)
  const [draft, setDraft] = React.useState("")
  const stream = useStream(api)
  const log = React.useRef<HTMLDivElement>(null)
  const active = all.find((thread) => thread.id === activeId)
  const streaming = stream.status === "streaming"

  const append = (id: string | undefined, messages: ChatMessage[]) =>
    setAll((current) =>
      current.map((thread) => (thread.id === id ? { ...thread, messages: [...thread.messages, ...messages] } : thread)),
    )

  // The live reply, as a message that can be saved to the thread it arrived in.
  const liveReply = (): ChatMessage[] =>
    stream.text ? [{ role: "assistant", text: stream.text, sources: stream.sources }] : []

  const send = (event: React.FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || streaming || !active) return
    const added: ChatMessage[] = [...liveReply(), { role: "user", text }]
    append(active.id, added)
    setDraft("")
    void stream.start({ messages: [...active.messages, ...added] })
  }

  const choose = (id: string) => {
    if (id === activeId) return
    append(activeId, liveReply())
    stream.reset()
    setActiveId(id)
  }

  React.useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight })
  }, [active?.messages.length, stream.text])

  return (
    <AppFrame title="assistant" className={className}>
      <div className="grid h-[440px] grid-rows-[auto_minmax(0,1fr)] md:grid-cols-[200px_minmax(0,1fr)] md:grid-rows-1">
        <nav
          aria-label="Conversations"
          className="border-ink flex [scrollbar-width:none] overflow-x-auto border-b-(length:--rule) text-[13px] md:flex-col md:overflow-x-hidden md:overflow-y-auto md:border-r-(length:--rule) md:border-b-0"
        >
          {all.map((thread) => (
            <button
              key={thread.id}
              type="button"
              aria-current={thread.id === activeId ? "true" : undefined}
              onClick={() => choose(thread.id)}
              className={cn(
                "spotcheck-focus flex-none cursor-pointer px-3 pt-2 pb-1 text-left -outline-offset-2 md:truncate",
                thread.id === activeId && "bg-accent-ink text-on-accent",
              )}
            >
              <span className="block max-w-40 truncate md:max-w-none">{thread.title}</span>
              <small className="block font-(family-name:--f-mono) text-[10px]">{thread.when}</small>
            </button>
          ))}
        </nav>
        <div className="flex min-h-0 min-w-0 flex-col">
          <div ref={log} role="log" aria-label="Conversation" className="flex grow flex-col gap-3.5 overflow-auto p-3.5">
            {active?.messages.map((message, index) =>
              message.role === "user" ? (
                <div key={index} className="bg-ink text-paper max-w-[78%] self-end px-3 py-2 text-sm">
                  {message.text}
                </div>
              ) : (
                <div key={index} className="max-w-[88%] text-sm">
                  <div className="spotcheck-label mb-0.5">Assistant</div>
                  <SavedResponse text={message.text} sources={message.sources} />
                </div>
              ),
            )}
            {stream.status !== "idle" && (
              <div className="max-w-[88%] text-sm">
                <div className="spotcheck-label mb-0.5">Assistant</div>
                <StreamResponse
                  text={stream.text}
                  sources={stream.sources}
                  status={stream.status}
                  error={stream.error}
                  onStop={stream.stop}
                />
              </div>
            )}
          </div>
          <form onSubmit={send} className="border-ink flex border-t-(length:--rule)">
            <input
              value={draft}
              aria-label="Reply"
              placeholder="Reply"
              onChange={(event) => setDraft(event.target.value)}
              className="placeholder:text-mute min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={streaming}
              className="spotcheck-focus border-ink bg-accent-ink text-on-accent cursor-pointer border-l-(length:--rule) px-3.5 font-(family-name:--f-mono) text-xs uppercase disabled:cursor-not-allowed disabled:opacity-45"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </AppFrame>
  )
}
