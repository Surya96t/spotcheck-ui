// Reads each component's TypeScript props so the docs tables can't drift from the source.
import { mkdirSync, readdirSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import docgen from "react-docgen-typescript"

const SOURCE = "registry/ledger/components/ledger"

const parser = docgen.withCustomConfig("tsconfig.json", {
  savePropValueAsString: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => !(prop.declarations ?? []).every((d) => d.fileName.includes("node_modules")),
})

const MAX_DEFAULT_LENGTH = 32
const pascal = (slug) => slug.replace(/(^|-)(\w)/g, (_, __, letter) => letter.toUpperCase())

const cleanType = (type) => type.replace(/^\((.*)\)$/s, "$1")

function shortDefault(value) {
  if (value === undefined || value === null) return null
  return String(value).length > MAX_DEFAULT_LENGTH ? "Built in" : String(value)
}

export function generateProps() {
  const output = {}
  for (const file of readdirSync(SOURCE)) {
    const slug = file.replace(/\.tsx$/, "")
    const doc = parser.parse(join(SOURCE, file)).find((d) => d.displayName === pascal(slug))
    if (!doc) throw new Error(`No props found for ${pascal(slug)} in ${file}`)
    output[slug] = Object.values(doc.props).map((prop) => ({
      name: prop.name,
      type: cleanType(prop.type.name),
      required: prop.required,
      default: shortDefault(prop.defaultValue?.value),
      description: prop.description,
    }))
  }
  mkdirSync("generated", { recursive: true })
  writeFileSync("generated/props.json", `${JSON.stringify(output, null, 2)}\n`)
}
