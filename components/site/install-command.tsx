import { installCommand } from "@/lib/site"
import { cn } from "@/lib/utils"

import { CopyButton } from "./copy-button"

export function InstallCommand({ name, plain = false }: { name: string; plain?: boolean }) {
  const command = installCommand(name)

  return (
    <div
      className={cn(
        "not-prose flex w-full min-w-0 items-center justify-between gap-2.5 px-3.5 py-2.5 font-(family-name:--f-mono) text-[13px]",
        plain ? "text-ink md:pl-8" : "bg-ink text-paper",
      )}
    >
      <code tabIndex={0} className="min-w-0 [scrollbar-width:none] overflow-x-auto whitespace-nowrap">
        <span className={plain ? "text-accent-ink" : undefined}>$</span> {command}
      </code>
      <CopyButton
        text={command}
        className={cn(
          "flex-none cursor-pointer px-2.5 py-1 text-xs",
          plain ? "border-ink min-h-11 border-(length:--rule) px-4 tracking-[.1em] uppercase" : "bg-accent-ink text-on-accent",
        )}
      />
    </div>
  )
}
