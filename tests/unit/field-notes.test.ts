import { readFileSync, readdirSync } from "node:fs"
import { describe, expect, it } from "vitest"

import { formatNoteDate } from "@/lib/field-notes"

describe("field notes", () => {
  it("formats a note's date the same way in every time zone", () => {
    expect(formatNoteDate("2026-11-06")).toBe("6 November 2026")
  })

  it("gives every note a date and an order", () => {
    for (const file of readdirSync("content/field-notes")) {
      const text = readFileSync(`content/field-notes/${file}`, "utf8")
      expect(text, file).toMatch(/^date: \d{4}-\d{2}-\d{2}$/m)
      expect(text, file).toMatch(/^order: \d+$/m)
    }
  })
})
