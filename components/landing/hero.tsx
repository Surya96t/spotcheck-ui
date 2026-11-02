import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"

import { InstallCommand } from "@/components/site/install-command"
import { BarTerrainDemo } from "@/registry/ledger/examples/bar-terrain-demo"

const PITCH =
  "Open source React components for reviewing, grading and signing off AI work. Hard rules, real motion and no package to install. Copy a file in and it's yours."

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="border-ink flex flex-col justify-end border-r-(length:--rule) px-3.5 pt-2.5 pb-2 last:border-r-0">
      <b className="ledger-display text-[34px] leading-none tabular-nums">{value}</b>
      <small className="ledger-label">{label}</small>
    </div>
  )
}

type LineProps = { children: ReactNode; index?: number; ruled?: boolean; last?: boolean }

function Line({ children, index = 0, ruled = false, last = false }: LineProps) {
  return (
    <span
      className={`landing-line ${ruled ? "border-ink border-b-(length:--rule)" : ""}`}
      style={{ "--line": index } as CSSProperties}
    >
      <span>
        {children}
        {last && <em className="text-accent-ink not-italic">.</em>}
      </span>
    </span>
  )
}

export function Hero({ count }: { count: number }) {
  return (
    <header className="@container">
      <div className="landing-hero border-ink relative border-b-(length:--rule)">
        <h1 className="ledger-display">
          <span className="hidden md:block">
            <Line ruled>Keep the books</Line>
            <Line index={1} last>
              on your AI
            </Line>
          </span>
          {/* Phones get three lines, so the type stays huge. */}
          <span className="md:hidden">
            <Line ruled>Keep the</Line>
            <Line ruled index={1}>
              books on
            </Line>
            <Line index={2} last>
              your AI
            </Line>
          </span>
        </h1>
        <div className="landing-slip border-ink hidden flex-col justify-end gap-0.5 border-l-(length:--rule) p-3.5 font-(family-name:--f-mono) text-xs md:flex">
          <span className="ledger-label">File open</span>
          <span>Run R-2041</span>
          <span>atlas-l · 2.84 s</span>
          <Link href="#case-file" className="text-accent-ink mt-1.5 underline underline-offset-2">
            Audit it
          </Link>
        </div>
      </div>

      <div className="border-ink grid border-b-(length:--rule) lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <BarTerrainDemo className="border-ink h-64 border-b-(length:--rule) lg:h-auto lg:min-h-80 lg:border-r-(length:--rule) lg:border-b-0" />
        <div className="flex min-w-0 flex-col">
          <p className="max-w-[46ch] grow p-4.5 text-lg leading-snug text-pretty">{PITCH}</p>
          <div className="border-ink grid grid-cols-3 border-t-(length:--rule)">
            <Stat value={count} label="Components" />
            <Stat value={3} label="Motion engines" />
            <Stat value={3} label="Skins" />
          </div>
          <InstallCommand name="chat-screen" />
        </div>
      </div>
    </header>
  )
}
