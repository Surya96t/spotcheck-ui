"use client"

import * as React from "react"
import { Toast } from "@base-ui/react/toast"

const TIMEOUT_MS = 5000

/** Call toast.add({ title, description }) from anywhere. */
export const toast = Toast.createToastManager()

function ToastList() {
  const { toasts } = Toast.useToastManager()

  return toasts.map((item) => (
    <Toast.Root
      key={item.id}
      toast={item}
      className="border-ink bg-paper text-ink relative border-(length:--rule) py-2.5 pr-8 pl-3 shadow-[6px_6px_0_var(--ink)] transition-[translate,opacity] duration-200 data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:opacity-0 motion-reduce:transition-none"
    >
      <Toast.Content>
        <Toast.Title className="spotcheck-heading text-lg leading-tight" />
        <Toast.Description className="text-mute text-[13.5px]" />
      </Toast.Content>
      <Toast.Close
        aria-label="Dismiss"
        className="spotcheck-focus absolute top-1.5 right-1.5 cursor-pointer px-1 font-(family-name:--f-mono) text-sm leading-none"
      >
        ×
      </Toast.Close>
    </Toast.Root>
  ))
}

type ToastProviderProps = {
  children: React.ReactNode
  /** How long a toast stays, in milliseconds. */
  timeout?: number
}

export function ToastProvider({ children, timeout = TIMEOUT_MS }: ToastProviderProps) {
  return (
    <Toast.Provider toastManager={toast} timeout={timeout}>
      {children}
      <Toast.Portal>
        <Toast.Viewport className="fixed right-4 bottom-4 z-50 flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  )
}
