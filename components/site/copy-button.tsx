"use client"

import * as React from "react"

const RESET_MS = 1200
const MAX_REPORTED = 4000

// Adds one to Surya's private copy count (see lib/counts.ts). Fire and forget: it never waits,
// shows anything, or sends who copied, only what was copied and from which page.
function reportCopy(text: string) {
  if (text.length > MAX_REPORTED) return
  try {
    navigator.sendBeacon?.("/api/copy", JSON.stringify({ text, page: window.location.pathname }))
  } catch {
    // Counting is best effort.
  }
}

export function useCopy() {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text).catch(() => {})
    reportCopy(text)
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), RESET_MS)
  }

  return { copied, copy }
}

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const { copied, copy } = useCopy()

  return (
    <button type="button" aria-live="polite" onClick={() => copy(text)} className={className}>
      {copied ? "Copied" : "Copy"}
    </button>
  )
}
