import { existsSync, readFileSync, readdirSync } from "node:fs"
import { describe, expect, it } from "vitest"

const registry = JSON.parse(readFileSync("registry.json", "utf8")) as { items: { name: string; type: string }[] }
const components = registry.items.filter((item) => item.type === "registry:component").map((item) => item.name)
const demos = readFileSync("components/site/demos.tsx", "utf8")

describe("catalog", () => {
  it("has a docs page and a demo for every registry component", () => {
    for (const name of components) {
      expect(existsSync(`content/components/${name}.mdx`), `${name} docs`).toBe(true)
      expect(demos, `${name} demo`).toContain(`"${name}"`)
    }
  })

  it("has a registry entry for every docs page", () => {
    const pages = readdirSync("content/components").map((file) => file.replace(/\.mdx$/, ""))
    expect(pages.toSorted()).toEqual(components.toSorted())
  })
})
