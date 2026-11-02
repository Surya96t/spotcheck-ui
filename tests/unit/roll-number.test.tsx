import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RollNumber } from "@/registry/spotcheck/components/spotcheck/roll-number"

describe("RollNumber", () => {
  it("exposes the formatted number as text and hides the columns", () => {
    const { container } = render(<RollNumber value={1284903} />)
    expect(screen.getByText("1,284,903")).toHaveClass("sr-only")
    expect(container.querySelectorAll("[aria-hidden]")).toHaveLength(9)
  })

  it("rolls digits and leaves other characters still", () => {
    const { container } = render(<RollNumber text="₹1,990" />)
    expect(container.querySelectorAll("[data-digit]")).toHaveLength(4)
  })

  it("moves each strip to its digit", () => {
    const { container } = render(<RollNumber text="7" />)
    expect(container.querySelector<HTMLElement>("[data-digit]")?.style.transform).toBe("translateY(-70%)")
  })

  it("keeps a digit in the same column as the number grows", () => {
    const { container, rerender } = render(<RollNumber value={99} />)
    const units = container.querySelectorAll("[data-digit]")[1]
    rerender(<RollNumber value={199} />)
    expect(container.querySelectorAll("[data-digit]")[2]).toBe(units)
  })
})
