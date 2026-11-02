import Link from "next/link"

import { InstallCommand } from "@/components/site/install-command"

const STEPS = [
  { no: "01", text: "Run one command. It uses the shadcn CLI you already have." },
  { no: "02", text: "The source lands in components/spotcheck, in your repo." },
  { no: "03", text: "It's yours. Change it, cut it down, ship it." },
]

export function Finale({ count }: { count: number }) {
  return (
    <section aria-labelledby="finale-title" className="bg-accent-ink text-on-accent border-ink @container border-b-(length:--rule)">
      <div className="landing-finale">
        <h2 id="finale-title" className="spotcheck-display pt-12 pb-2">
          Start checking<span>.</span>
        </h2>
      </div>
      <ol className="grid border-t-(length:--rule) border-current md:grid-cols-3">
        {STEPS.map((step) => (
          <li
            key={step.no}
            className="flex flex-col gap-1 border-b-(length:--rule) border-current px-4.5 py-3.5 md:border-r-(length:--rule) md:border-b-0 md:last:border-r-0"
          >
            <span className="font-(family-name:--f-mono) text-xs">{step.no}</span>
            <span className="text-pretty">{step.text}</span>
          </li>
        ))}
      </ol>
      <div className="border-t-(length:--rule) border-current p-4.5">
        <InstallCommand name="chat-screen" />
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-(family-name:--f-mono) text-sm">
          <Link href="/components" className="underline underline-offset-4">
            Browse all {count} components
          </Link>
          <Link href="/docs/installation" className="underline underline-offset-4">
            Read the install guide
          </Link>
        </div>
      </div>
    </section>
  )
}
