"use client"

import * as React from "react"

import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { StampApproval, type ToolCall } from "@/registry/spotcheck/components/spotcheck/stamp-approval"

const CALL: ToolCall = {
  name: "send_email",
  args: { to: "finance@example.com", subject: "Q3 refund summary", attach: "refunds-q3.csv · 41 rows" },
  resolved: "Emails 41 refund rows to finance@example.com.",
  risk: "high",
}

export function StampApprovalDemo() {
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex flex-col items-start gap-4">
      <StampApproval key={run} call={CALL} editable={["subject"]} className="w-full" />
      <Button variant="ghost" onClick={() => setRun((current) => current + 1)}>
        Reset
      </Button>
    </div>
  )
}
