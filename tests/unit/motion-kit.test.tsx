import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { chartPoints } from "@/registry/spotcheck/components/spotcheck/draw-chart"
import { moveCell } from "@/registry/spotcheck/components/spotcheck/ripple-heatmap"
import { scrambleFrame } from "@/registry/spotcheck/components/spotcheck/scramble-text"
import { ScrubInput, snapValue } from "@/registry/spotcheck/components/spotcheck/scrub-input"
import { changedCells, padRow } from "@/registry/spotcheck/components/spotcheck/split-flap"
import { swipeOutcome } from "@/registry/spotcheck/components/spotcheck/swipe-review"

describe("scrambleFrame", () => {
  it("keeps spaces and settles from the left", () => {
    const frame = scrambleFrame("ab cd", 5, () => 0)
    expect(frame.slice(0, 3)).toBe("ab ")
    expect(frame[3]).toBe("█")
  })

  it("is fully settled by the end", () => {
    expect(scrambleFrame("check", 100)).toBe("check")
  })
})

describe("snapValue", () => {
  it("rounds to the step without float noise", () => {
    expect(snapValue(0.1 + 0.2, 0, 1, 0.05)).toBe(0.3)
  })

  it("clamps to the range", () => {
    expect(snapValue(9000, 0, 4000, 50)).toBe(4000)
  })
})

describe("ScrubInput", () => {
  it("exposes spinbutton ARIA and steps with the keyboard", () => {
    const onValueChange = vi.fn()
    render(<ScrubInput label="Tokens" defaultValue={100} step={50} max={150} onValueChange={onValueChange} />)
    const control = screen.getByRole("spinbutton", { name: "Tokens" })
    expect(control).toHaveAttribute("aria-valuenow", "100")
    fireEvent.keyDown(control, { key: "ArrowUp" })
    expect(onValueChange).toHaveBeenCalledWith(150)
    fireEvent.keyDown(control, { key: "ArrowUp" })
    expect(onValueChange).toHaveBeenCalledOnce()
  })

  it("types a value with Enter and cancels with Esc", () => {
    render(<ScrubInput label="Tokens" defaultValue={100} />)
    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "Enter" })
    const input = screen.getByRole("textbox", { name: "Tokens" })
    fireEvent.change(input, { target: { value: "250" } })
    fireEvent.keyDown(input, { key: "Escape" })
    expect(screen.getByRole("spinbutton")).toHaveAttribute("aria-valuenow", "100")
  })
})

describe("split-flap", () => {
  it("pads and trims rows to the width", () => {
    expect(padRow("AB", 4)).toBe("AB  ")
    expect(padRow("ABCDEF", 4)).toBe("ABCD")
  })

  it("finds only the cells that changed", () => {
    expect(changedCells(["ABC"], ["AXC"])).toEqual([{ row: 0, column: 1, char: "X" }])
  })
})

describe("moveCell", () => {
  it("moves inside the grid and stops at the edges", () => {
    expect(moveCell(0, "ArrowRight", 24, 7)).toBe(1)
    expect(moveCell(0, "ArrowDown", 24, 7)).toBe(24)
    expect(moveCell(0, "ArrowLeft", 24, 7)).toBe(0)
    expect(moveCell(0, "ArrowUp", 24, 7)).toBe(0)
    expect(moveCell(167, "ArrowRight", 24, 7)).toBe(167)
  })

  it("jumps within the row", () => {
    expect(moveCell(30, "Home", 24, 7)).toBe(24)
    expect(moveCell(30, "End", 24, 7)).toBe(47)
  })

  it("ignores other keys", () => {
    expect(moveCell(0, "a", 24, 7)).toBeUndefined()
  })
})

describe("swipeOutcome", () => {
  it("decides only past the threshold", () => {
    expect(swipeOutcome(110, 110)).toBeNull()
    expect(swipeOutcome(111, 110)).toBe("accept")
    expect(swipeOutcome(-111, 110)).toBe("reject")
  })
})

describe("chartPoints", () => {
  it("spreads points and puts the max at the top", () => {
    const points = chartPoints([0, 90], 90)
    expect(points[0]?.[0]).toBeLessThan(points[1]?.[0] ?? 0)
    expect(points[1]?.[1]).toBeLessThan(points[0]?.[1] ?? 0)
  })
})
