import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { Chip } from "@/registry/ledger/components/ledger/chip"
import { addMonths, monthGrid, sameDay } from "@/registry/ledger/components/ledger/date-picker"
import { LedgerTable, sortRows } from "@/registry/ledger/components/ledger/ledger-table"
import { Pagination, pageRange } from "@/registry/ledger/components/ledger/pagination"
import { Progress } from "@/registry/ledger/components/ledger/progress"
import { Segmented } from "@/registry/ledger/components/ledger/segmented"
import { sparklinePoints } from "@/registry/ledger/components/ledger/sparkline"

const ROWS = [
  { id: "a", score: 2, name: "Beta" },
  { id: "b", score: 3, name: "Alpha" },
  { id: "c", score: 1, name: "Gamma" },
]

describe("sortRows", () => {
  it("sorts numbers and strings in both directions", () => {
    expect(sortRows(ROWS, { key: "score", dir: "desc" }).map((row) => row.id)).toEqual(["b", "a", "c"])
    expect(sortRows(ROWS, { key: "name", dir: "asc" }).map((row) => row.id)).toEqual(["b", "a", "c"])
  })

  it("leaves the input alone", () => {
    sortRows(ROWS, { key: "score", dir: "asc" })
    expect(ROWS[0]?.id).toBe("a")
  })
})

describe("LedgerTable", () => {
  const columns = [
    { key: "name" as const, label: "Name" },
    { key: "score" as const, label: "Score", numeric: true },
  ]

  it("marks the sorted column and flips on a second press", () => {
    render(<LedgerTable title="T" rows={ROWS} columns={columns} rowKey="id" defaultSort={{ key: "score", dir: "desc" }} />)
    const header = screen.getByRole("columnheader", { name: /Score/ })
    expect(header).toHaveAttribute("aria-sort", "descending")
    fireEvent.click(screen.getByRole("button", { name: /Score/ }))
    expect(header).toHaveAttribute("aria-sort", "ascending")
  })

  it("numbers rows by position, not by data", () => {
    render(<LedgerTable title="T" rows={ROWS} columns={columns} rowKey="id" defaultSort={{ key: "score", dir: "desc" }} />)
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("01Alpha3")
  })
})

describe("pageRange", () => {
  it("shows every page when there are few", () => {
    expect(pageRange(2, 4)).toEqual([1, 2, 3, 4])
  })

  it("collapses runs on both sides", () => {
    expect(pageRange(7, 24)).toEqual([1, "gap", 6, 7, 8, "gap", 24])
  })
})

describe("Pagination", () => {
  it("can't go past either end", () => {
    const onPageChange = vi.fn()
    render(<Pagination page={1} pageCount={3} onPageChange={onPageChange} />)
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled()
    fireEvent.click(screen.getByRole("button", { name: "Next page" }))
    expect(onPageChange).toHaveBeenCalledWith(2)
    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute("aria-current", "page")
  })
})

describe("date helpers", () => {
  it("builds six weeks starting on a Monday", () => {
    const grid = monthGrid(new Date(2026, 10, 12))
    expect(grid).toHaveLength(42)
    expect(grid[0]?.getDay()).toBe(1)
    expect(grid[0]?.getDate()).toBe(26)
  })

  it("clamps to the end of a shorter month", () => {
    expect(addMonths(new Date(2026, 0, 31), 1).getDate()).toBe(28)
  })

  it("compares calendar days and tolerates nothing selected", () => {
    expect(sameDay(new Date(2026, 1, 1, 9), new Date(2026, 1, 1, 22))).toBe(true)
    expect(sameDay(null, new Date())).toBe(false)
  })
})

describe("sparklinePoints", () => {
  it("handles a flat series without dividing by zero", () => {
    expect(sparklinePoints([5, 5]).every(([, y]) => Number.isFinite(y))).toBe(true)
  })

  it("handles a single value", () => {
    expect(sparklinePoints([5])[0]?.[0]).toBe(0)
  })
})

describe("Progress", () => {
  it("clamps and reports a percentage", () => {
    render(<Progress label="Upload" value={140} />)
    expect(screen.getByRole("progressbar", { name: "Upload" })).toHaveAttribute("aria-valuenow", "140")
    expect(screen.getByText("100%")).toBeInTheDocument()
  })

  it("leaves the value out when the length is unknown", () => {
    render(<Progress label="Waiting" />)
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow")
  })
})

describe("Chip", () => {
  it("only shows a remove button when it can be removed", () => {
    const onRemove = vi.fn()
    const { rerender } = render(<Chip>notes.md</Chip>)
    expect(screen.queryByRole("button")).toBeNull()
    rerender(<Chip onRemove={onRemove} removeLabel="Remove notes.md">notes.md</Chip>)
    fireEvent.click(screen.getByRole("button", { name: "Remove notes.md" }))
    expect(onRemove).toHaveBeenCalledOnce()
  })
})

describe("Segmented", () => {
  it("keeps one option selected", () => {
    const onValueChange = vi.fn()
    render(<Segmented label="Range" options={["Day", "Week"]} defaultValue="Day" onValueChange={onValueChange} />)
    fireEvent.click(screen.getByRole("button", { name: "Day" }))
    expect(onValueChange).not.toHaveBeenCalled()
    expect(screen.getByRole("button", { name: "Day" })).toHaveAttribute("aria-pressed", "true")
    fireEvent.click(screen.getByRole("button", { name: "Week" }))
    expect(onValueChange).toHaveBeenCalledWith("Week")
  })
})
