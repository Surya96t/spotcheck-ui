"use client"

import * as React from "react"

import { Chip } from "@/registry/ledger/components/ledger/chip"

const FILES = ["refund-policy.md", "q3-tickets.csv", "notes.md"]

export function ChipDemo() {
  const [files, setFiles] = React.useState(FILES)

  return (
    <div className="flex flex-wrap gap-1.5">
      {files.map((file) => (
        <Chip
          key={file}
          removeLabel={`Remove ${file}`}
          onRemove={() => setFiles((current) => current.filter((item) => item !== file))}
        >
          {file}
        </Chip>
      ))}
      <Chip>Read only</Chip>
    </div>
  )
}
