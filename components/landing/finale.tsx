import Link from "next/link"

import { InstallCommand } from "@/components/site/install-command"

export function Finale() {
  return (
    <section aria-labelledby="finale-title" className="bg-accent-ink text-on-accent border-ink @container border-b-(length:--rule)">
      <div className="landing-finale">
        <h2 id="finale-title" className="landing-mask spotcheck-display pt-10 pb-2 md:pt-13">
          <span data-rise>
            Start checking<span>.</span>
          </span>
        </h2>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 pt-4 pb-7 md:px-8">
        <div className="bg-paper text-ink min-w-0 flex-[1_1_520px]">
          <InstallCommand name="chat-screen" plain />
        </div>
        <Link href="/components" className="flex min-h-11 items-center font-(family-name:--f-mono) text-sm underline underline-offset-4">
          Browse components
        </Link>
        <Link href="/docs" className="flex min-h-11 items-center font-(family-name:--f-mono) text-sm underline underline-offset-4">
          Read the docs
        </Link>
      </div>
    </section>
  )
}
