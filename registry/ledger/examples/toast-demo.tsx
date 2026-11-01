"use client"

import { Button } from "@/registry/ledger/components/ledger/button"
import { ToastProvider, toast } from "@/registry/ledger/components/ledger/toast"

export function ToastDemo() {
  return (
    <ToastProvider>
      <Button onClick={() => toast.add({ title: "Run queued", description: "R-2042 starts in about a minute." })}>
        Queue a run
      </Button>
    </ToastProvider>
  )
}
