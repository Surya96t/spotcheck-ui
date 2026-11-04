import Link from "next/link"

const COLUMNS = [
  {
    title: "Products",
    links: [
      { label: "Components", href: "/components" },
      { label: "AI review", href: "/components#ai" },
      { label: "Screens", href: "/components#screens" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Roadmap", href: "/roadmap" },
      { label: "Compare", href: "/compare" },
      { label: "Field notes", href: "/field-notes" },
    ],
  },
  {
    title: "Docs",
    links: [
      { label: "Installation", href: "/docs/installation" },
      { label: "Theming", href: "/docs/theming" },
    ],
  },
  { title: "Support", links: [{ label: "Get help", href: "/support" }] },
]

const FOLLOW = [
  { label: "Instagram", href: "https://www.instagram.com/spotcheckui/" },
  { label: "YouTube", href: "https://www.youtube.com/@spotcheckui" },
]

export function SiteFooter() {
  return (
    <footer className="border-ink border-t-(length:--rule)">
      <div className="flex flex-wrap gap-x-16 gap-y-7 px-4 py-9 font-(family-name:--f-mono) text-[13px] md:px-8">
        <div className="text-mute flex-[2_1_220px]">v0.1 · MIT · React 19</div>
        {COLUMNS.map((column) => (
          <div key={column.title} className="flex-[1_1_130px]">
            <h2 className="spotcheck-label mb-2">{column.title}</h2>
            {column.links.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-accent-ink block py-1">
                {link.label}
              </Link>
            ))}
          </div>
        ))}
        <div className="flex-[1_1_130px]">
          <h2 className="spotcheck-label mb-2">Follow</h2>
          {FOLLOW.map((link) => (
            <a key={link.href} href={link.href} rel="me" className="hover:text-accent-ink block py-1">
              {link.label} <span aria-hidden>↗</span>
            </a>
          ))}
        </div>
      </div>
      <div aria-hidden className="landing-wordmark spotcheck-display border-ink @container overflow-hidden border-t-(length:--rule)">
        <span>
          Spotcheck<em className="text-accent-ink not-italic">/</em>UI
        </span>
      </div>
    </footer>
  )
}
