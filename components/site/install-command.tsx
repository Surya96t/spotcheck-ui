import { installCommand } from "@/lib/site"

import { CopyButton } from "./copy-button"

export function InstallCommand({ name }: { name: string }) {
  const command = installCommand(name)

  return (
    <div className="bg-ink text-paper not-prose flex items-center justify-between gap-2.5 px-3.5 py-2.5 font-(family-name:--f-mono) text-[13px]">
      <code tabIndex={0} className="min-w-0 [scrollbar-width:none] overflow-x-auto whitespace-nowrap">
        $ {command}
      </code>
      <CopyButton
        text={command}
        className="bg-accent-ink text-on-accent flex-none cursor-pointer px-2.5 py-1 text-xs"
      />
    </div>
  )
}
