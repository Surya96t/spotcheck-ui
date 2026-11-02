"use client"

import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { ToastProvider, toast } from "@/registry/spotcheck/components/spotcheck/toast"

export function ToastDemo() {
  return (
    <ToastProvider>
      <Button onClick={() => toast.add({ title: "Run queued", description: "R-2042 starts in about a minute." })}>
        Queue a run
      </Button>
    </ToastProvider>
  )
}
