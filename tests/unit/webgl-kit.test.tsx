import { act, fireEvent, render, renderHook, screen, within } from "@testing-library/react"
import * as React from "react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { EmbeddingSpace, rankNeighbours, type EmbeddingPoint, type EmbeddingQuery } from "@/registry/spotcheck/components/spotcheck/embedding-space"
import { GlStage } from "@/registry/spotcheck/components/spotcheck/gl-stage"
import { barAt, barHeight, LinkedBars } from "@/registry/spotcheck/components/spotcheck/linked-bars"
import { useOrbitDrag } from "@/registry/spotcheck/hooks/use-orbit-drag"

// jsdom has no WebGL, so the canvas is a stand-in that shows when the stage mounts it.
vi.mock("@react-three/fiber", async (original) => ({
  ...(await original<typeof import("@react-three/fiber")>()),
  Canvas: () => <canvas data-testid="canvas" />,
}))

type Entry = { isIntersecting: boolean }

const observers: { callback: (entries: Entry[]) => void; margin: string }[] = []

class FakeObserver {
  constructor(callback: (entries: Entry[]) => void, options: { rootMargin?: string }) {
    observers.push({ callback, margin: options.rootMargin ?? "0px" })
  }
  observe() {}
  disconnect() {}
}

function report(margin: string, isIntersecting: boolean) {
  act(() => observers.filter((observer) => observer.margin === margin).forEach((observer) => observer.callback([{ isIntersecting }])))
}

beforeEach(() => {
  observers.length = 0
  vi.stubGlobal("IntersectionObserver", FakeObserver)
  vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener() {}, removeEventListener() {} }))
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    getExtension: () => null,
    fillRect: () => {},
    getImageData: () => ({ data: new Uint8ClampedArray(4) }),
  } as unknown as RenderingContext)
})

describe("GlStage", () => {
  it("creates the canvas near the viewport and removes it when far away", () => {
    render(<GlStage label="Bars">scene</GlStage>)
    expect(screen.queryByTestId("canvas")).toBeNull()

    report("300px", true)
    report("900px", true)
    expect(screen.getByTestId("canvas")).toBeInTheDocument()

    report("300px", false)
    expect(screen.getByTestId("canvas")).toBeInTheDocument()

    report("900px", false)
    expect(screen.queryByTestId("canvas")).toBeNull()
  })

  it("names the canvas for screen readers", () => {
    render(<GlStage label="Weekly requests">scene</GlStage>)
    expect(screen.getByRole("img", { name: "Weekly requests" })).toBeInTheDocument()
  })
})

describe("useOrbitDrag", () => {
  const press = (clientX: number, button = 0) =>
    ({ button, clientX, pointerId: 1, currentTarget: { setPointerCapture: () => {} } }) as unknown as React.PointerEvent<HTMLElement>

  it("turns horizontal drags into an angle and ignores vertical travel", () => {
    const onChange = vi.fn()
    const { result } = renderHook(() => useOrbitDrag({ angle: 1, speed: 0.01, onChange }))
    const { bind, rotation, dragging } = result.current

    bind.onPointerDown(press(100))
    expect(dragging.current).toBe(true)
    bind.onPointerMove(press(150))
    expect(rotation.current).toBeCloseTo(1.5)
    expect(onChange).toHaveBeenCalledOnce()

    bind.onPointerUp()
    bind.onPointerMove(press(300))
    expect(rotation.current).toBeCloseTo(1.5)
    expect(dragging.current).toBe(false)
  })

  it("leaves vertical scroll to the page", () => {
    const { result } = renderHook(() => useOrbitDrag())
    expect(result.current.bind.style.touchAction).toBe("pan-y")
  })

  it("ends the drag when the browser takes the gesture", () => {
    const { result } = renderHook(() => useOrbitDrag())
    result.current.bind.onPointerDown(press(0))
    result.current.bind.onPointerCancel()
    expect(result.current.dragging.current).toBe(false)
  })
})

describe("LinkedBars", () => {
  const props = {
    title: "Requests",
    rows: ["Mumbai", "Oregon"],
    columns: ["W1", "W2"],
    values: [
      [10, 20],
      [30, 40],
    ],
  }

  it("raises the highlighted row and dims the rest", () => {
    expect(barHeight(40, 40, 0, null)).toBeCloseTo(3.1)
    expect(barHeight(40, 40, 0, 0)).toBeGreaterThan(3.1)
    expect(barHeight(40, 40, 1, 0)).toBeCloseTo(3.1 * 0.45)
  })

  it("finds a bar's row and column", () => {
    expect(barAt(0, 8)).toEqual({ row: 0, column: 0 })
    expect(barAt(11, 8)).toEqual({ row: 1, column: 3 })
  })

  it("puts every value in a real table", () => {
    render(<LinkedBars {...props} format={(value) => `${value}k`} />)
    expect(screen.getByRole("table", { name: "Requests" })).toBeInTheDocument()
    expect(screen.getAllByRole("columnheader")).toHaveLength(3)
    for (const value of ["10k", "20k", "30k", "40k"]) expect(screen.getByRole("cell", { name: value })).toBeInTheDocument()
  })

  it("highlights a row on focus and clears it on blur", () => {
    render(<LinkedBars {...props} />)
    const row = screen.getByRole("button", { name: "Oregon" })
    vi.spyOn(row, "matches").mockReturnValue(true)
    fireEvent.focus(row)
    expect(row.closest("tr")).toHaveAttribute("data-active")
    fireEvent.blur(row)
    expect(row.closest("tr")).not.toHaveAttribute("data-active")
  })

  it("leaves a row alone when focus comes from a tap", () => {
    render(<LinkedBars {...props} />)
    const row = screen.getByRole("button", { name: "Oregon" })
    vi.spyOn(row, "matches").mockReturnValue(false)
    fireEvent.focus(row)
    expect(row.closest("tr")).not.toHaveAttribute("data-active")
  })

  it("keeps a tapped row highlighted until it's tapped again", () => {
    const onHighlightChange = vi.fn()
    render(<LinkedBars {...props} onHighlightChange={onHighlightChange} />)
    const row = screen.getByRole("button", { name: "Mumbai" })
    fireEvent.click(row)
    expect(row).toHaveAttribute("aria-pressed", "true")
    expect(row.closest("tr")).toHaveAttribute("data-active")
    expect(onHighlightChange).toHaveBeenLastCalledWith(0)
    fireEvent.click(row)
    expect(row.closest("tr")).not.toHaveAttribute("data-active")
    expect(onHighlightChange).toHaveBeenLastCalledWith(null)
  })

  it("follows a controlled highlight", () => {
    render(<LinkedBars {...props} highlight={1} />)
    expect(screen.getByRole("button", { name: "Oregon" }).closest("tr")).toHaveAttribute("data-active")
  })
})

describe("EmbeddingSpace", () => {
  const points: EmbeddingPoint[] = [
    { id: "a", position: [0, 0, 0], label: "Duplicate charges" },
    { id: "b", position: [1, 0, 0], label: "Refund to wallet" },
    { id: "c", position: [2, 0, 0], label: "Tracking delays" },
  ]
  const queries: EmbeddingQuery[] = [
    { id: "q1", label: "Charged twice?", position: [0, 0, 0], neighbours: [{ id: "b", score: 0.91 }, { id: "a", score: 0.8 }] },
    { id: "q2", label: "Parcel?", position: [2, 0, 0], neighbours: [{ id: "c", score: 0.95 }] },
  ]

  it("joins neighbours to their points and drops unknown ids", () => {
    const ranked = rankNeighbours(points, { ...queries[0]!, neighbours: [{ id: "a", score: 1 }, { id: "gone", score: 0.5 }] })
    expect(ranked.map((neighbour) => neighbour.point.label)).toEqual(["Duplicate charges"])
    expect(rankNeighbours(points, undefined)).toEqual([])
  })

  it("ranks the chosen query in an ordered list, in the order given", () => {
    render(<EmbeddingSpace points={points} queries={queries} />)
    const items = within(screen.getByRole("list", { name: "Top 2 neighbours" })).getAllByRole("listitem")
    expect(items[0]).toHaveTextContent("Refund to wallet0.910")
    expect(items[1]).toHaveTextContent("Duplicate charges0.800")
  })

  it("updates the list and announces when the query changes", () => {
    const onValueChange = vi.fn()
    render(<EmbeddingSpace points={points} queries={queries} onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Parcel?" }))
    expect(onValueChange).toHaveBeenCalledWith("q2")
    expect(screen.getByRole("button", { name: "Parcel?" })).toHaveAttribute("aria-pressed", "true")
    expect(within(screen.getByRole("list")).getByText("Tracking delays")).toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("Showing 1 closest chunks for: Parcel?")
  })

  it("follows a controlled value", () => {
    render(<EmbeddingSpace points={points} queries={queries} value="q2" />)
    expect(screen.getByRole("button", { name: "Parcel?" })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: "Charged twice?" })).toHaveAttribute("aria-pressed", "false")
  })
})
