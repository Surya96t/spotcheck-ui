"use client"

import * as React from "react"

const RESET_MS = 1200

export function useCopy() {
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  React.useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text).catch(() => {})
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
