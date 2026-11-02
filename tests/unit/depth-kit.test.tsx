import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { cardPose, Coverflow, type CoverflowItem } from "@/registry/spotcheck/components/spotcheck/coverflow"
import { CubeTabs, shortestTurn, type CubeFace } from "@/registry/spotcheck/components/spotcheck/cube-tabs"
import { DrumPicker, rowOpacity, wheelTarget } from "@/registry/spotcheck/components/spotcheck/drum-picker"
import { FoldReport, FoldRow, FoldSection } from "@/registry/spotcheck/components/spotcheck/fold-report"
import { TiltCard, TiltLayer, tiltFor } from "@/registry/spotcheck/components/spotcheck/tilt-card"
import { flickTarget, rubberBand } from "@/registry/spotcheck/hooks/use-flick"

function stubMedia(matches: (query: string) => boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: matches(query),
    addEventListener() {},
    removeEventListener() {},
  }))
}

beforeEach(() => {
  stubMedia(() => false)
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  )
})

describe("useFlick maths", () => {
  it("lets a drag give way past the ends", () => {
    expect(rubberBand(2, 5)).toBe(2)
    expect(rubberBand(-1, 5)).toBeCloseTo(-0.3)
    expect(rubberBand(5, 5)).toBeCloseTo(4.3)
  })

  it("projects a throw, caps it and lands on an item that exists", () => {
    expect(flickTarget(2.4, 0, 10)).toBe(2)
    expect(flickTarget(2, 8, 10)).toBe(3)
    expect(flickTarget(0, 1000, 10)).toBe(1)
    expect(flickTarget(8.8, 12, 10)).toBe(9)
    expect(flickTarget(0.2, -12, 10)).toBe(0)
  })
})

describe("DrumPicker", () => {
  const options = ["atlas-l", "atlas-m", "atlas-s"].map((value) => ({ value, label: value }))

  it("hands the wheel back to the page at the first and last rows", () => {
    expect(wheelTarget(1, 100, 3)).toBe(2)
    expect(wheelTarget(1, -100, 3)).toBe(0)
    expect(wheelTarget(2, 100, 3)).toBeNull()
    expect(wheelTarget(0, -100, 3)).toBeNull()
  })

  it("fades rows as they turn away", () => {
    expect(rowOpacity(0)).toBe(1)
    expect(rowOpacity(2)).toBeCloseTo(0.48)
    expect(rowOpacity(2.5)).toBeCloseTo(0.24)
    expect(rowOpacity(3)).toBe(0)
    expect(rowOpacity(5)).toBe(0)
  })

  it("is a listbox that tracks the active row", () => {
    render(<DrumPicker label="Model" options={options} defaultValue="atlas-m" />)
    const list = screen.getByRole("listbox", { name: "Model" })
    const selected = screen.getByRole("option", { selected: true })
    expect(selected).toHaveTextContent("atlas-m")
    expect(list).toHaveAttribute("aria-activedescendant", selected.id)
  })

  it("moves with the arrow keys, Home and End", () => {
    const onValueChange = vi.fn()
    render(<DrumPicker label="Model" options={options} defaultValue="atlas-m" onValueChange={onValueChange} />)
    const list = screen.getByRole("listbox")
    fireEvent.keyDown(list, { key: "ArrowDown" })
    expect(onValueChange).toHaveBeenLastCalledWith("atlas-s")
    fireEvent.keyDown(list, { key: "Home" })
    expect(onValueChange).toHaveBeenLastCalledWith("atlas-l")
    fireEvent.keyDown(list, { key: "End" })
    expect(onValueChange).toHaveBeenLastCalledWith("atlas-s")
  })

  it("stays on the last row rather than wrapping", () => {
    const onValueChange = vi.fn()
    render(<DrumPicker label="Model" options={options} defaultValue="atlas-s" onValueChange={onValueChange} />)
    fireEvent.keyDown(screen.getByRole("listbox"), { key: "ArrowDown" })
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("follows a controlled value", () => {
    const { rerender } = render(<DrumPicker label="Model" options={options} value="atlas-l" />)
    rerender(<DrumPicker label="Model" options={options} value="atlas-s" />)
    expect(screen.getByRole("option", { selected: true })).toHaveTextContent("atlas-s")
  })
})

describe("Coverflow", () => {
  const items: CoverflowItem[] = ["one", "two", "three"].map((value) => ({
    value,
    content: `Card ${value}`,
    summary: `Summary ${value}`,
  }))

  it("puts the centre card flat and side cards at an angle", () => {
    const centre = cardPose(0, 200)
    expect([centre.x, centre.z, centre.rotateY].map(Math.abs)).toEqual([0, 0, 0])
    expect(centre.opacity).toBe(1)
    expect(cardPose(1, 200)).toMatchObject({ x: 124, z: -150, rotateY: -55 })
    expect(cardPose(-1, 200)).toMatchObject({ x: -124, z: -150, rotateY: 55 })
    expect(cardPose(5, 200).opacity).toBe(0)
  })

  it("changes selection from the buttons and disables them at the ends", () => {
    const onValueChange = vi.fn()
    render(<Coverflow label="Datasets" items={items} onValueChange={onValueChange} />)
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled()
    fireEvent.click(screen.getByRole("button", { name: "Next" }))
    expect(onValueChange).toHaveBeenCalledWith("two")
    expect(screen.getByRole("option", { selected: true })).toHaveAccessibleName("Card two")
    expect(screen.getByTestId("coverflow-summary")).toHaveTextContent("Summary two")
  })

  it("moves with the arrow keys", () => {
    render(<Coverflow label="Datasets" items={items} />)
    const list = screen.getByRole("listbox", { name: "Datasets" })
    expect(list).toHaveAttribute("aria-orientation", "horizontal")
    fireEvent.keyDown(list, { key: "ArrowRight" })
    fireEvent.keyDown(list, { key: "ArrowRight" })
    expect(screen.getByRole("option", { selected: true })).toHaveAccessibleName("Card three")
    fireEvent.keyDown(list, { key: "Home" })
    expect(list).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { selected: true }).id)
  })
})

describe("FoldReport", () => {
  const report = (
    <FoldReport defaultOpen="timeline">
      <FoldSection value="timeline" title="Timeline" meta="1 entry">
        <FoldRow label="09:12">Pager fires</FoldRow>
      </FoldSection>
      <FoldSection value="fix" title="Fix">
        <FoldRow label="Done">Limits added</FoldRow>
      </FoldSection>
    </FoldReport>
  )

  it("uses real buttons wired to their panels", () => {
    render(report)
    const header = screen.getByRole("button", { name: /Timeline/ })
    expect(header).toHaveAttribute("aria-expanded", "true")
    expect(document.getElementById(header.getAttribute("aria-controls") ?? "")).toHaveTextContent("Pager fires")
    expect(screen.getByRole("button", { name: "Fix" })).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("Limits added")).not.toBeVisible()
  })

  it("opens at once with no fixed height under reduced motion", () => {
    stubMedia((query) => query.includes("reduced-motion"))
    render(report)
    fireEvent.click(screen.getByRole("button", { name: "Fix" }))
    expect(screen.getByRole("button", { name: "Fix" })).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Limits added")).toBeVisible()
    expect(screen.queryByText("Pager fires")).not.toBeVisible()
    const panel = screen.getByRole("region", { name: "Fix" })
    expect(panel.style.height).toBe("")
  })
})

describe("CubeTabs", () => {
  const faces = ["Latency", "Cost", "Quality", "Volume"].map((value) => ({
    value,
    label: value,
    content: <a href="#x">{value} details</a>,
  })) as [CubeFace, CubeFace, CubeFace, CubeFace]

  beforeEach(() => stubMedia((query) => query.includes("reduced-motion")))

  it("always turns the short way", () => {
    expect(shortestTurn(0, 1)).toBe(1)
    expect(shortestTurn(0, 2)).toBe(2)
    expect(shortestTurn(0, 3)).toBe(-1)
    expect(shortestTurn(3, 0)).toBe(1)
    expect(shortestTurn(2, 2)).toBe(0)
  })

  it("wires tabs to panels", () => {
    render(<CubeTabs label="Metrics" faces={faces} />)
    const tab = screen.getByRole("tab", { name: "Latency" })
    expect(document.getElementById(tab.getAttribute("aria-controls") ?? "")).toHaveTextContent("Latency details")
    expect(screen.getByRole("tabpanel", { name: "Latency" })).toBeInTheDocument()
  })

  it("moves with the arrow keys, wrapping at the ends, and takes focus along", () => {
    render(<CubeTabs label="Metrics" faces={faces} />)
    const first = screen.getByRole("tab", { name: "Latency" })
    first.focus()
    fireEvent.keyDown(first, { key: "ArrowLeft" })
    const last = screen.getByRole("tab", { name: "Volume" })
    expect(last).toHaveAttribute("aria-selected", "true")
    expect(last).toHaveFocus()
    expect(last).toHaveAttribute("tabindex", "0")
    expect(first).toHaveAttribute("tabindex", "-1")
  })

  it("keeps faces turned away out of reach", () => {
    render(<CubeTabs label="Metrics" faces={faces} defaultValue="Cost" />)
    const panels = screen.getAllByRole("tabpanel", { hidden: true })
    expect(panels.filter((panel) => !panel.hasAttribute("inert"))).toHaveLength(1)
    expect(panels.filter((panel) => panel.getAttribute("aria-hidden") === "true")).toHaveLength(3)
  })

  it("turns first to last as one face back, in multiples of 90", () => {
    render(<CubeTabs label="Metrics" faces={faces} />)
    fireEvent.click(screen.getByRole("tab", { name: "Volume" }))
    expect(screen.getByTestId("cube")).toHaveAttribute("data-rotation", "90")
    fireEvent.click(screen.getByRole("tab", { name: "Latency" }))
    expect(screen.getByTestId("cube")).toHaveAttribute("data-rotation", "0")
    fireEvent.click(screen.getByRole("tab", { name: "Quality" }))
    expect(screen.getByTestId("cube")).toHaveAttribute("data-rotation", "-180")
  })
})

describe("TiltCard", () => {
  it("tilts toward the pointer", () => {
    expect(tiltFor(0, 0).x).toBeCloseTo(0)
    expect(tiltFor(0.5, 0).y).toBeCloseTo(11)
    expect(tiltFor(0, 0.5).x).toBeCloseTo(-9)
  })

  it("lifts layers by their depth when the pointer can hover", () => {
    stubMedia((query) => query.includes("hover"))
    render(
      <TiltCard>
        <TiltLayer depth={64}>Price</TiltLayer>
      </TiltCard>,
    )
    expect(screen.getByText("Price").style.transform).toBe("translateZ(64px)")
    expect(document.querySelector("[data-part=glare]")).toBeInTheDocument()
  })

  it("stays flat on touch screens", () => {
    render(
      <TiltCard>
        <TiltLayer depth={64}>Price</TiltLayer>
      </TiltCard>,
    )
    expect(screen.getByText("Price").style.transform).toBe("")
    expect(document.querySelector("[data-part=glare]")).toBeNull()
  })

  it("stays flat under reduced motion", () => {
    stubMedia(() => true)
    render(
      <TiltCard>
        <TiltLayer depth={64}>Price</TiltLayer>
      </TiltCard>,
    )
    expect(screen.getByText("Price").style.transform).toBe("")
  })
})
