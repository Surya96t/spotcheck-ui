import type { MetadataRoute } from "next"

import { getComponents, getFieldNotes, getGuides } from "@/lib/catalog"
import { siteUrl } from "@/lib/site"

const PAGES = ["/", "/components", "/docs", "/roadmap", "/compare", "/support", "/field-notes"]

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...PAGES,
    ...getComponents().map(({ slug }) => `/components/${slug}`),
    ...getGuides().map(({ slug }) => `/docs/${slug}`),
    ...getFieldNotes().map(({ slug }) => `/field-notes/${slug}`),
  ]
  return paths.map((path) => ({ url: `${siteUrl}${path === "/" ? "" : path}` }))
}
