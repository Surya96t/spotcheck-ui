"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Chip } from "@/registry/spotcheck/components/spotcheck/chip"
import { Select, type SelectOption } from "@/registry/spotcheck/components/spotcheck/select"

const CHARS_PER_TOKEN = 4

const subscribeNever = () => () => {}

function useSendHint() {
  return React.useSyncExternalStore(
    subscribeNever,
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘↵" : "Ctrl ↵"),
    () => "Ctrl ↵",
  )
}

type ComposerProps = {
  value: string
  onValueChange: (value: string) => void
  /** Runs on the Send button and on Cmd or Ctrl plus Enter. */
  onSubmit: () => void
  /** File names shown as chips. */
  attachments?: string[]
  /** Removes a file. Leave it out to make chips read only. */
  onRemove?: (name: string) => void
  /** Shows an Attach button. */
  onAttach?: () => void
  models?: SelectOption[]
  model?: string
  onModelChange?: (model: string) => void
  /** The model's context window, in tokens. */
  contextLimit?: number
  /** Tokens already used by attachments and history. */
  usedTokens?: number
  /** Stops sending, such as while a reply streams. */
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function Composer({
  value,
  onValueChange,
  onSubmit,
  attachments = [],
  onRemove,
  onAttach,
  models = [],
  model,
  onModelChange,
  contextLimit,
  usedTokens = 0,
  disabled = false,
  placeholder = "Ask something",
  className,
}: ComposerProps) {
  const hint = useSendHint()
  const canSend = value.trim().length > 0 && !disabled
  const tokens = usedTokens + Math.ceil(value.length / CHARS_PER_TOKEN)
  const share = contextLimit ? Math.min(1, tokens / contextLimit) : 0

  return (
    <div className={cn("border-ink bg-raise border-(length:--rule) font-(family-name:--f-body)", className)}>
      <label className="block px-3.5 pt-2.5">
        <span className="spotcheck-label block">Prompt</span>
        <textarea
          value={value}
          placeholder={placeholder}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && (event.metaKey || event.ctrlKey) && canSend) {
              event.preventDefault()
              onSubmit()
            }
          }}
          className="placeholder:text-mute min-h-[84px] w-full resize-none bg-transparent py-2 text-base outline-none"
        />
      </label>
      {(attachments.length > 0 || onAttach) && (
        <div className="flex flex-wrap gap-1.5 px-3.5 pb-2.5">
          {attachments.map((name) => (
            <Chip key={name} removeLabel={`Remove ${name}`} onRemove={onRemove && (() => onRemove(name))}>
              {name}
            </Chip>
          ))}
          {onAttach && (
            <button
              type="button"
              onClick={onAttach}
              className="spotcheck-focus border-ink cursor-pointer border-[1.5px] px-2 py-0.5 font-(family-name:--f-mono) text-[11.5px]"
            >
              + Attach
            </button>
          )}
        </div>
      )}
      <div className="border-ink flex flex-wrap items-stretch border-t-(length:--rule) font-(family-name:--f-mono) text-xs">
        {models.length > 0 && (
          <Select
            label="Model"
            options={models}
            value={model}
            onValueChange={onModelChange}
            className="min-w-28 border-0 border-r-(length:--rule)"
          />
        )}
        {contextLimit !== undefined && (
          <div className="flex min-w-[140px] flex-1 items-center gap-2.5 px-3">
            <span className="tabular-nums">{Math.round(share * 100)}%</span>
            <div
              role="progressbar"
              aria-label="Context used"
              aria-valuemin={0}
              aria-valuemax={contextLimit}
              aria-valuenow={Math.min(tokens, contextLimit)}
              className="bg-wash h-1.5 flex-1"
            >
              <div className="bg-ink h-full" style={{ width: `${share * 100}%` }} />
            </div>
            <span className="tabular-nums">of {Math.round(contextLimit / 1000)}k</span>
          </div>
        )}
        <button
          type="button"
          disabled={!canSend}
          onClick={onSubmit}
          className="bg-accent-ink text-on-accent disabled:bg-wash disabled:text-mute spotcheck-focus ml-auto cursor-pointer px-4 py-2 font-semibold tracking-[.08em] uppercase disabled:cursor-not-allowed"
        >
          Send {hint}
        </button>
      </div>
    </div>
  )
}
