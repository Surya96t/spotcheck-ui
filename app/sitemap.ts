import type { MetadataRoute } from "next"

import { getComponents, getGuides } from "@/lib/catalog"
import { siteUrl } from "@/lib/site"

const PAGES = ["/", "/components", "/docs", "/roadmap", "/compare", "/support"]

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...PAGES,
    ...getComponents().map(({ slug }) => `/components/${slug}`),
    ...getGuides().map(({ slug }) => `/docs/${slug}`),
  ]
  return paths.map((path) => ({ url: `${siteUrl}${path === "/" ? "" : path}` }))
}
