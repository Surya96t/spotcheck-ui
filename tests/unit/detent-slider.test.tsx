import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { DetentSlider, findZone, snapToStep } from "@/registry/spotcheck/components/spotcheck/detent-slider"

const ZONES = [
  { from: 0, to: 0.4, label: "Deterministic" },
  { from: 0.6, to: 1.2, label: "Balanced" },
  { from: 1.4, to: 2, label: "Creative" },
]

describe("snapToStep", () => {
  it("lands on the nearest step without float noise", () => {
    expect(snapToStep(0.71, 0, 2, 0.2)).toBe(0.8)
    expect(snapToStep(0.3, 0, 1, 0.1)).toBe(0.3)
  })

  it("clamps to the range", () => {
    expect(snapToStep(-4, 0, 2, 0.2)).toBe(0)
    expect(snapToStep(9, 0, 2, 0.2)).toBe(2)
  })
})

describe("findZone", () => {
  it("returns the containing zone", () => {
    expect(findZone(ZONES, 1)?.label).toBe("Balanced")
  })

  it("returns the nearest zone in a gap", () => {
    expect(findZone(ZONES, 0.45)?.label).toBe("Deterministic")
  })
})

describe("DetentSlider", () => {
  it("exposes slider ARIA with the zone in the value text", () => {
    render(<DetentSlider label="Temperature" min={0} max={2} step={0.2} defaultValue={0.8} zones={ZONES} />)
    const slider = screen.getByRole("slider", { name: "Temperature" })
    expect(slider).toHaveAttribute("aria-valuenow", "0.8")
    expect(slider).toHaveAttribute("aria-valuetext", "0.8, Balanced")
  })

  it("steps with the keyboard and jumps with Home and End", () => {
    const onValueChange = vi.fn()
    render(<DetentSlider label="T" min={0} max={2} step={0.2} defaultValue={0.8} onValueChange={onValueChange} />)
    const slider = screen.getByRole("slider")
    fireEvent.keyDown(slider, { key: "ArrowRight" })
    expect(onValueChange).toHaveBeenLastCalledWith(1)
    fireEvent.keyDown(slider, { key: "Home" })
    expect(slider).toHaveAttribute("aria-valuenow", "0")
    fireEvent.keyDown(slider, { key: "End" })
    expect(slider).toHaveAttribute("aria-valuenow", "2")
  })

  it("stays at the ends", () => {
    const onValueChange = vi.fn()
    render(<DetentSlider label="T" min={0} max={1} step={1} defaultValue={1} onValueChange={onValueChange} />)
    fireEvent.keyDown(screen.getByRole("slider"), { key: "ArrowRight" })
    expect(onValueChange).not.toHaveBeenCalled()
  })
})
