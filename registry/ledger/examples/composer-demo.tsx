"use client"

import * as React from "react"

import { Composer } from "@/registry/ledger/components/ledger/composer"

const MODELS = [
  { value: "atlas-l", label: "atlas-l" },
  { value: "atlas-m", label: "atlas-m" },
  { value: "atlas-s", label: "atlas-s" },
]
const TOKENS_PER_FILE = 1800

export function ComposerDemo() {
  const [prompt, setPrompt] = React.useState("Summarise the refund policy changes for the support team")
  const [files, setFiles] = React.useState(["refund-policy.md", "q3-tickets.csv"])
  const [model, setModel] = React.useState("atlas-m")
  const [sent, setSent] = React.useState("")

  return (
    <div className="flex flex-col gap-2.5">
      <Composer
        value={prompt}
        onValueChange={(next) => {
          setPrompt(next)
          setSent("")
        }}
        onSubmit={() => setSent(`Sent to ${model}`)}
        attachments={files}
        onRemove={(name) => setFiles((current) => current.filter((file) => file !== name))}
        onAttach={() => setFiles((current) => [...current, `notes-${current.length + 1}.md`])}
        models={MODELS}
        model={model}
        onModelChange={setModel}
        contextLimit={32000}
        usedTokens={files.length * TOKENS_PER_FILE}
      />
      <span role="status" className="text-ok font-(family-name:--f-mono) text-xs" data-testid="composer-result">
        {sent}
      </span>
    </div>
  )
}
