import Link from "next/link"

import { InstallCommand } from "@/components/site/install-command"

const STEPS = [
  { no: "01", text: "Run one command. It uses the shadcn CLI you already have." },
  { no: "02", text: "The source lands in components/ledger, in your repo." },
  { no: "03", text: "It's yours. Change it, cut it down, ship it." },
]

const NOTES = [
  {
    title: "Distribution",
    text: "Each component is one file. A CLI copies it into your project, so there is no package to upgrade around.",
  },
  {
    title: "Skins and license",
    text: "Ledger, Terminal and Folio share the same markup. MIT. Sample data on this page is invented.",
  },
  {
    title: "Engines",
    text: "Each component names its engine, so you only install what it needs: motion, anime.js or three.",
  },
]

export function Finale({ count }: { count: number }) {
  return (
    <>
      <section aria-labelledby="finale-title" className="bg-accent-ink text-on-accent border-ink @container border-b-(length:--rule)">
        <div className="landing-finale">
          <h2 id="finale-title" className="ledger-display pt-12 pb-2">
            Start your ledger<span>.</span>
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

      <footer>
        <div className="grid gap-5 px-4.5 pt-6 pb-8 md:grid-cols-3">
          {NOTES.map((note) => (
            <div key={note.title}>
              <h3 className="ledger-label mb-1">{note.title}</h3>
              <p className="max-w-[40ch] text-sm text-pretty">{note.text}</p>
            </div>
          ))}
        </div>
        <div aria-hidden className="landing-wordmark ledger-display border-ink @container overflow-hidden border-t-(length:--rule)">
          <span>
            Ledger<em className="text-accent-ink not-italic">/</em>UI
          </span>
        </div>
      </footer>
    </>
  )
}
