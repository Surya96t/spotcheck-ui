"use client"

import * as React from "react"

import { Button } from "@/registry/spotcheck/components/spotcheck/button"
import { RollNumber } from "@/registry/spotcheck/components/spotcheck/roll-number"
import { Switch } from "@/registry/spotcheck/components/spotcheck/switch"
import { TiltCard, TiltLayer } from "@/registry/spotcheck/components/spotcheck/tilt-card"

// An invented plan and prices.
const FEATURES = ["Unlimited eval runs", "Shared datasets", "Agent traces kept 30 days", "SSO and audit log"]

export function TiltCardDemo() {
  const [yearly, setYearly] = React.useState(false)

  return (
    <div className="flex flex-col items-center gap-4">
      <TiltCard className="max-w-full">
        <TiltLayer depth={26}>
          <span className="spotcheck-label">Plan · billed {yearly ? "yearly" : "monthly"}</span>
          <div className="spotcheck-display text-[46px] leading-[.9]">Team</div>
        </TiltLayer>
        <TiltLayer depth={64}>
          <RollNumber data-testid="tilt-price" text={yearly ? "₹1,990" : "₹2,400"} style={{ fontSize: 58 }} />
          <div className="spotcheck-label mt-1.5">per seat / month</div>
        </TiltLayer>
        <TiltLayer depth={36}>
          <ul className="text-sm">
            {FEATURES.map((feature) => (
              <li key={feature} className="border-b border-[color-mix(in_srgb,var(--ink)_18%,transparent)] pt-1.5 pb-0.5">
                <span aria-hidden className="text-accent-ink font-(family-name:--f-mono)">
                  +{" "}
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </TiltLayer>
        <TiltLayer depth={48}>
          <Button variant="accent">Choose Team</Button>
        </TiltLayer>
        <TiltLayer depth={90} className="absolute -top-3.5 -right-2 rotate-6">
          <span className="bg-accent-ink text-on-accent border-ink inline-block border-(length:--rule) px-2.5 py-1.5 font-(family-name:--f-mono) text-[11px] tracking-[.1em] uppercase">
            Most picked
          </span>
        </TiltLayer>
      </TiltCard>
      <Switch checked={yearly} onCheckedChange={setYearly}>
        Bill yearly · save 17%
      </Switch>
    </div>
  )
}
