"use client"

import * as React from "react"

export type StreamSource = { id: string; title: string; url?: string }
export type StreamTool = { id: string; name: string; input?: unknown; output?: unknown; done: boolean }
export type StreamStatus = "idle" | "streaming" | "done" | "stopped" | "error"
export type StreamState = { text: string; sources: StreamSource[]; tools: StreamTool[] }

const EMPTY: StreamState = { text: "", sources: [], tools: [] }
const DONE = "[DONE]"
const AI_SDK_HEADER = "x-vercel-ai-ui-message-stream"

/** Splits SSE text into complete `data:` payloads, returning whatever is still incomplete. */
export function readSseEvents(buffer: string) {
  const blocks = buffer.split(/\r?\n\r?\n/)
  const rest = blocks.pop() ?? ""
  const events = blocks.flatMap((block) => {
    const data = block
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).replace(/^ /, ""))
    return data.length > 0 ? [data.join("\n")] : []
  })
  return { events, rest }
}

/** Applies one AI SDK UI message stream part. Parts it doesn't use are ignored. */
export function applyAiSdkPart(state: StreamState, data: string): StreamState {
  if (data === DONE) return state
  const part = JSON.parse(data) as Record<string, unknown> & { type: string }
  const id = String(part.toolCallId ?? "")

  switch (part.type) {
    case "text-delta":
      return { ...state, text: state.text + String(part.delta ?? "") }
    case "source-url":
      return {
        ...state,
        sources: [
          ...state.sources,
          { id: String(part.sourceId), title: String(part.title ?? part.url), url: String(part.url) },
        ],
      }
    case "tool-input-start":
      return { ...state, tools: [...state.tools, { id, name: String(part.toolName), done: false }] }
    case "tool-input-available":
      return { ...state, tools: state.tools.map((tool) => (tool.id === id ? { ...tool, input: part.input } : tool)) }
    case "tool-output-available":
      return {
        ...state,
        tools: state.tools.map((tool) => (tool.id === id ? { ...tool, output: part.output, done: true } : tool)),
      }
    case "error":
      throw new Error(String(part.errorText ?? "The stream failed."))
    default:
      return state
  }
}

type UseStreamOptions = {
  /** Sent as the JSON body of the POST request. */
  body?: unknown
  headers?: Record<string, string>
}

/**
 * Streams from an endpoint. Responses from the AI SDK's toUIMessageStreamResponse are detected by
 * their header. Anything else is read as plain SSE, where each `data:` line is more text.
 */
export function useStream(url: string, { body, headers }: UseStreamOptions = {}) {
  const [state, setState] = React.useState(EMPTY)
  const [status, setStatus] = React.useState<StreamStatus>("idle")
  const [error, setError] = React.useState<string | null>(null)
  const controller = React.useRef<AbortController | null>(null)

  const start = React.useCallback(
    async (override?: unknown) => {
      controller.current?.abort()
      const abort = new AbortController()
      controller.current = abort
      setState(EMPTY)
      setError(null)
      setStatus("streaming")

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json", ...headers },
          body: JSON.stringify(override ?? body ?? {}),
          signal: abort.signal,
        })
        if (!response.ok || !response.body) throw new Error(`The request failed with ${response.status}.`)

        const isAiSdk = response.headers.has(AI_SDK_HEADER)
        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
        let buffer = ""
        for (;;) {
          const { value, done } = await reader.read()
          if (done) break
          const { events, rest } = readSseEvents(buffer + value)
          buffer = rest
          setState((current) =>
            events.reduce(
              (next, data) =>
                isAiSdk ? applyAiSdkPart(next, data) : data === DONE ? next : { ...next, text: next.text + data },
              current,
            ),
          )
        }
        setStatus("done")
      } catch (failure) {
        if (abort.signal.aborted) return
        setError(failure instanceof Error ? failure.message : "The stream failed.")
        setStatus("error")
      }
    },
    [body, headers, url],
  )

  const stop = React.useCallback(() => {
    controller.current?.abort()
    setStatus("stopped")
  }, [])

  const reset = React.useCallback(() => {
    controller.current?.abort()
    setState(EMPTY)
    setError(null)
    setStatus("idle")
  }, [])

  React.useEffect(() => () => controller.current?.abort(), [])

  return { ...state, status, error, start, stop, regenerate: start, reset }
}
