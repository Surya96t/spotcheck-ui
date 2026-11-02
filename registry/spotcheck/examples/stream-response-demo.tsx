"use client"

import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { StreamResponse } from "@/registry/spotcheck/components/spotcheck/stream-response"
import { useStream } from "@/registry/spotcheck/hooks/use-stream"

export function StreamResponseDemo() {
  const { text, sources, status, error, start, stop, regenerate } = useStream("/api/demo/chat")

  return status === "idle" ? (
    <Button variant="ink" onClick={() => void start()}>
      Ask about the refund policy
    </Button>
  ) : (
    <StreamResponse
      text={text}
      sources={sources}
      status={status}
      error={error}
      onStop={stop}
      onRegenerate={() => void regenerate()}
    />
  )
}
