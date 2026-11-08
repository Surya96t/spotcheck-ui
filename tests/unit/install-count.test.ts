import { describe, expect, it } from "vitest"

import { componentFromPath, countRegistryFetch, fetchKind } from "@/lib/install-count"

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
