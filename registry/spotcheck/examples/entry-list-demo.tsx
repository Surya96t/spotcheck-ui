"use client"

import * as React from "react"

import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { EntryList } from "@/registry/spotcheck/components/spotcheck/entry-list"

const ENTRIES = [
  { id: "0412", title: "Invoice INV-0412", meta: "Paid · ₹48,200" },
  { id: "0413", title: "Invoice INV-0413", meta: "Due 4 Nov · ₹12,750" },
  { id: "0414", title: "Invoice INV-0414", meta: "Draft · ₹6,900" },
  { id: "0415", title: "Invoice INV-0415", meta: "Overdue · ₹31,000" },
]

export function EntryListDemo() {
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex flex-col items-start gap-3.5">
      <EntryList key={run} entries={ENTRIES} className="w-full" />
      <Button onClick={() => setRun((current) => current + 1)}>Replay</Button>
    </div>
  )
}
