import { pageSchema } from "fumadocs-core/source/schema"
import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import { createCssVariablesTheme } from "shiki"
import { z } from "zod"

export const components = defineDocs({
  dir: "content/components",
  docs: {
    schema: pageSchema.extend({
      description: z.string(),
      group: z.enum(["core", "motion", "springs", "timelines", "webgl", "depth", "ai", "screens"]),
      order: z.number(),
      engine: z.string(),
      wide: z.boolean().default(false),
      keyboard: z.array(z.object({ keys: z.string(), action: z.string() })).default([]),
      reducedMotion: z.string(),
    }),
  },
})

export const guides = defineDocs({
  dir: "content/docs",
  docs: { schema: pageSchema.extend({ description: z.string(), order: z.number() }) },
})

// Colours come from CSS variables, so code blocks follow the skin and theme.
const codeTheme = createCssVariablesTheme({ name: "spotcheck", variablePrefix: "--code-", fontStyle: true })

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: { light: codeTheme, dark: codeTheme },
      defaultColor: "light",
      langs: ["tsx", "ts", "bash", "css", "json"],
    },
  },
})
