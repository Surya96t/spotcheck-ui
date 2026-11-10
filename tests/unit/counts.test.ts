import { describe, expect, it } from "vitest"

import {
  componentFromPath,
  copiedComponents,
  countCopy,
  countRegistryFetch,
  fetchKind,
  isCountedPage,
} from "@/lib/counts"

describe("install count", () => {
  it("reads the component name from a registry path", () => {
    expect(componentFromPath("/r/diff-review.json")).toBe("diff-review")
    expect(componentFromPath("/r/registry.json")).toBe("registry")
    expect(componentFromPath("/r/diff-review.json.map")).toBeNull()
    expect(componentFromPath("/r/../secrets.json")).toBeNull()
    expect(componentFromPath("/components/diff-review")).toBeNull()
  })

  it("tells browsers from the CLI", () => {
    expect(fetchKind("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)")).toBe("browser")
    expect(fetchKind("node")).toBe("cli")
    expect(fetchKind(null)).toBe("cli")
  })

  it("does nothing without the Upstash variables", async () => {
    await expect(countRegistryFetch("diff-review", "node")).resolves.toBeUndefined()
  })
})

describe("copy count", () => {
  const known = new Set(["diff-review", "model-race"])

  it("finds the known components in an install command", () => {
    const command =
      "npx shadcn@latest add https://spotcheckui.com/r/diff-review.json https://spotcheckui.com/r/model-race.json"
    expect(copiedComponents(command, known)).toEqual(["diff-review", "model-race"])
    expect(copiedComponents("npx shadcn@latest add https://x.dev/r/made-up.json", known)).toEqual([])
    expect(copiedComponents('export function DiffReview() {}', known)).toEqual([])
  })

  it("counts only the site's own pages", () => {
    expect(isCountedPage("/")).toBe(true)
    expect(isCountedPage("/components/diff-review")).toBe(true)
    expect(isCountedPage("/docs/installation")).toBe(true)
    expect(isCountedPage("/field-notes/why-review")).toBe(true)
    expect(isCountedPage("/admin")).toBe(false)
    expect(isCountedPage("/components/<script>")).toBe(false)
    expect(isCountedPage(`/docs/${"a".repeat(120)}`)).toBe(false)
  })

  it("does nothing without the Upstash variables", async () => {
    await expect(countCopy(["diff-review"], "/components/diff-review")).resolves.toBeUndefined()
  })
})
