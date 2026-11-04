import { GROUPS, getComponents, getFieldNotes, getGuides } from "@/lib/catalog"
import { installCommand, siteUrl } from "@/lib/site"

export const dynamic = "force-static"

// The llms.txt format: a title, a one-line summary, then sections of links with a note on each.
export function GET() {
  const components = getComponents()
  const lines = [
    "# Spotcheck UI",
    "",
    "> Open source React components with hard edges, real motion and 3D, built for reviewing AI work.",
    "",
    "Components install through the shadcn CLI, which copies their source into the project, so there's no package to depend on.",
    `Each one installs with \`${installCommand("<name>")}\`, and needs React 19 and Tailwind CSS v4.`,
    "Each component's JSON at the link below holds its full source.",
    "",
    "## Docs",
    "",
    ...getGuides().map(({ slug, page }) => `- [${page.data.title}](${siteUrl}/docs/${slug}): ${page.data.description}`),
    "",
    "## Field notes",
    "",
    ...getFieldNotes().map(({ slug, page }) => `- [${page.data.title}](${siteUrl}/field-notes/${slug}): ${page.data.description}`),
    ...GROUPS.flatMap((group) => [
      "",
      `## ${group.name}`,
      "",
      group.blurb,
      "",
      ...components
        .filter(({ page }) => page.data.group === group.id)
        .map(({ slug, page }) => `- [${page.data.title}](${siteUrl}/r/${slug}.json): ${page.data.description}`),
    ]),
    "",
  ]
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
