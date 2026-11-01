// Builds public/r/*.json. Registry items refer to each other by absolute URL, so the source
// registry.json holds a placeholder and each build fills in the host it will be served from.
import { execFileSync } from "node:child_process"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import postcss from "postcss"

import { generateProps } from "./generate-props.mjs"

const CSS_SOURCE = "registry/ledger/base/ledger.css"
const OUTPUT = "registry.generated.json"

function registryUrl() {
  if (process.env.LEDGER_REGISTRY_URL) return process.env.LEDGER_REGISTRY_URL.replace(/\/$/, "")
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  return vercel ? `https://${vercel}` : "http://localhost:3000"
}

function declarations(node) {
  const out = {}
  for (const child of node.nodes ?? []) {
    if (child.type === "decl") out[child.prop] = child.value
    if (child.type === "rule") out[child.selector] = declarations(child)
  }
  return out
}

/** Splits the stylesheet into a registry item's `css` and `cssVars` fields. */
function cssToItem(source) {
  const css = {}
  const theme = {}
  for (const node of postcss.parse(source).nodes) {
    if (node.type === "comment") continue
    if (node.type === "atrule" && node.name === "theme") {
      // The CLI only writes @theme inline through cssVars.theme, without the leading dashes.
      for (const [prop, value] of Object.entries(declarations(node))) theme[prop.slice(2)] = value
      continue
    }
    const key = node.type === "rule" ? node.selector.replace(/\s*\n\s*/g, " ") : `@${node.name} ${node.params}`
    css[key] = declarations(node)
  }
  return { css, cssVars: { theme } }
}

const url = registryUrl()
const registry = JSON.parse(readFileSync("registry.json", "utf8").replaceAll("{{REGISTRY_URL}}", url))
const base = registry.items.find((item) => item.name === "ledger-base")
Object.assign(base, cssToItem(readFileSync(CSS_SOURCE, "utf8")))
writeFileSync(OUTPUT, `${JSON.stringify(registry, null, 2)}\n`)

mkdirSync("public/r", { recursive: true })
execFileSync("pnpm", ["exec", "shadcn", "build", OUTPUT, "--output", "public/r"], { stdio: "inherit" })
generateProps()
console.log(`Registry built for ${url}`)
