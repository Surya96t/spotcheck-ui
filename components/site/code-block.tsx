"use client"

import * as React from "react"

import { useCopy } from "./copy-button"

export function CodeBlock({ children, ...props }: React.ComponentProps<"pre">) {
  const ref = React.useRef<HTMLPreElement>(null)
  const { copied, copy } = useCopy()

  return (
    <div className="relative my-4">
      <pre
        ref={ref}
        {...props}
        tabIndex={0}
        className="bg-ink! text-paper! overflow-x-auto p-3.5 pr-16 font-(family-name:--f-mono) text-[12.5px] leading-[1.55]"
      >
        {children}
      </pre>
      <button
        type="button"
        aria-live="polite"
        onClick={() => copy(ref.current?.textContent ?? "")}
        className="text-paper border-paper absolute top-2 right-2 cursor-pointer border px-2 py-0.5 font-(family-name:--f-mono) text-[11px]"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  )
}
