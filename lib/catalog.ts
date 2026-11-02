import { readFileSync } from "node:fs"

import { components, guides } from "@/.source/server"
import { loader } from "fumadocs-core/source"

export const GROUPS = [
  { id: "core", name: "Core", blurb: "Primitives cut from a ruled grid. Hard rules, no radius, type that sits on the baseline." },
  { id: "motion", name: "Motion", blurb: "Typographic motion. Numbers roll, headings decode, lists file in like entries." },
  { id: "springs", name: "Springs", blurb: "Physics on the controls people touch most. Sliders snap into detents and stamps land with weight." },
  { id: "timelines", name: "Timelines", blurb: "Sequenced motion: split-flap boards, staggered grid ripples and lines that draw themselves." },
  { id: "webgl", name: "WebGL", blurb: "Data you can stand inside. Instanced bar fields and an embedding space for retrieval." },
  { id: "depth", name: "Depth", blurb: "3D built into everyday components, while the controls around each one stay ordinary." },
  { id: "ai", name: "AI", blurb: "Interfaces for reviewing, grading and auditing model output." },
  { id: "screens", name: "Screens", blurb: "Larger blocks assembled from the parts above. Drop in, then cut down." },
] as const

export const componentSource = loader({ baseUrl: "/components", source: components.toFumadocsSource() })
export const guideSource = loader({ baseUrl: "/docs", source: guides.toFumadocsSource() })

const groupOrder = (id: string) => GROUPS.findIndex((group) => group.id === id)

export function getComponents() {
  return componentSource
    .getPages()
    .toSorted(
      (a, b) => groupOrder(a.data.group) - groupOrder(b.data.group) || a.data.order - b.data.order,
    )
    .map((page, index) => ({
      page,
      slug: page.slugs[0] ?? "",
      no: `L-${String(index + 1).padStart(2, "0")}`,
    }))
}

export function getGuides() {
  return guideSource
    .getPages()
    .toSorted((a, b) => a.data.order - b.data.order)
    .map((page, index) => ({
      page,
      slug: page.slugs[0] ?? "",
      no: `D-${String(index + 1).padStart(2, "0")}`,
    }))
}

export type PropRow = { name: string; type: string; required: boolean; default: string | null; description: string }

export function getProps(slug: string): PropRow[] {
  const all = JSON.parse(readFileSync("generated/props.json", "utf8")) as Record<string, PropRow[]>
  return all[slug] ?? []
}

export function getRegistryItem(slug: string) {
  const registry = JSON.parse(readFileSync("registry.json", "utf8")) as {
    items: { name: string; dependencies?: string[] }[]
  }
  return registry.items.find((item) => item.name === slug)
}
