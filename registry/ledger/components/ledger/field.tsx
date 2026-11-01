"use client"

import * as React from "react"
import { Field as BaseField } from "@base-ui/react/field"

import { cn } from "@/lib/utils"

const CONTROL =
  "border-ink focus:border-accent-ink data-invalid:border-bad w-full border-0 border-b-(length:--rule) bg-transparent pt-1.5 pb-1 font-(family-name:--f-display) text-xl [font-stretch:80%] outline-none"

type FieldProps = {
  label: string
  /** Printed opposite the label, for a counter or a requirement. */
  hint?: React.ReactNode
  /** Says how to fix the problem. Setting it marks the field invalid. */
  error?: string
  /** One Input, Textarea or Select. */
  children: React.ReactNode
  className?: string
}

export function Field({ label, hint, error, children, className }: FieldProps) {
  return (
    <BaseField.Root invalid={Boolean(error)} className={cn("flex min-w-0 flex-col gap-1", className)}>
      <div className="flex justify-between gap-3">
        <BaseField.Label className="ledger-label">{label}</BaseField.Label>
        {hint && <BaseField.Description className="ledger-label tabular-nums">{hint}</BaseField.Description>}
      </div>
      {children}
      {error && (
        <BaseField.Error match className="text-bad font-(family-name:--f-mono) text-[11.5px]">
          {error}
        </BaseField.Error>
      )}
    </BaseField.Root>
  )
}

type InputProps = Omit<BaseField.Control.Props, "className"> & { className?: string }

export function Input({ className, ...props }: InputProps) {
  return <BaseField.Control className={cn(CONTROL, className)} {...props} />
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <BaseField.Control render={<textarea className={cn(CONTROL, "resize-y", className)} {...props} />} />
}
