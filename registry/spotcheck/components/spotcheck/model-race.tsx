import * as React from "react"

import { cn } from "@/lib/utils"
import { RollNumber } from "@/registry/spotcheck/components/spotcheck/roll-number"
import { Tag } from "@/registry/spotcheck/components/spotcheck/tag"

export type RaceLane = {
  id: string
  model: string
  /** The answer so far. */
  text: string
  status: "waiting" | "streaming" | "done" | "error"
  /** Time so far, in milliseconds. */
  ms: number
  /** Cost so far, in dollars. */
  cost: number
}

/** Finishing order among the lanes that are done, with ties sharing a place. */
export function finishPlaces(lanes: RaceLane[]) {
  const times = lanes.filter((lane) => lane.status === "done").map((lane) => lane.ms)
  return new Map(
    lanes
      .filter((lane) => lane.status === "done")
      .map((lane) => [lane.id, times.filter((time) => time < lane.ms).length + 1]),
  )
}

type ModelRaceProps = Omit<React.ComponentProps<"div">, "children"> & {
  lanes: RaceLane[]
}

export function ModelRace({ lanes, className, ...props }: ModelRaceProps) {
  const places = finishPlaces(lanes)
  const winner = lanes.find((lane) => places.get(lane.id) === 1)

  return (
    <div className={cn("flex flex-col gap-2 font-(family-name:--f-body)", className)} {...props}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
        {lanes.map((lane) => {
          const place = places.get(lane.id)
          return (
            <section
              key={lane.id}
              aria-label={lane.model}
              data-status={lane.status}
              className={cn("border-ink flex min-w-0 flex-col border-(length:--rule)", place === 1 && "shadow-[4px_4px_0_var(--accent-ink)]")}
            >
              <div className="border-ink flex items-center justify-between gap-2 border-b-(length:--rule) px-3 py-2">
                <b className="spotcheck-heading min-w-0 truncate text-lg leading-none">{lane.model}</b>
                {place ? (
                  <Tag variant={place === 1 ? "accent" : "outline"}>{place === 1 ? "First" : `#${place}`}</Tag>
                ) : (
                  <Tag>{lane.status}</Tag>
                )}
              </div>
              <p aria-hidden className="m-0 min-h-[6.5em] grow px-3 py-2.5 text-sm text-pretty">
                {lane.text}
                {lane.status === "streaming" && (
                  <span className="bg-accent-ink ml-0.5 inline-block h-[1em] w-[.5em] align-[-2px] motion-safe:[animation:spotcheck-blink_1s_steps(1)_infinite]" />
                )}
              </p>
              <div className="border-ink grid grid-cols-2 border-t-(length:--rule)">
                <div className="border-ink border-r-(length:--rule) px-3 py-1.5">
                  <div className="spotcheck-label">Time</div>
                  <RollNumber text={`${(lane.ms / 1000).toFixed(2)}s`} duration={200} className="text-xl normal-case" />
                </div>
                <div className="px-3 py-1.5">
                  <div className="spotcheck-label">Cost</div>
                  <RollNumber text={`$${lane.cost.toFixed(4)}`} duration={200} className="text-xl" />
                </div>
              </div>
            </section>
          )
        })}
      </div>
      <p role="status" className="spotcheck-label" data-testid="race-result">
        {winner ? `${winner.model} finished first` : ""}
      </p>
    </div>
  )
}
