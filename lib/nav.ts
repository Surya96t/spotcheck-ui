export type NavItem = { label: string; note: string; href: string }

export const PRODUCTS: NavItem[] = [
  { label: "All components", note: "Every part, grouped and live", href: "/components" },
  { label: "AI review", note: "Traces, grades, diffs and sign-off", href: "/components#ai" },
  { label: "Motion", note: "Numbers, type, springs and timelines", href: "/components#motion" },
  { label: "3D and WebGL", note: "Data you can stand inside", href: "/components#webgl" },
  { label: "Screens", note: "Larger blocks, ready to cut down", href: "/components#screens" },
]

export const RESOURCES: NavItem[] = [
  { label: "Roadmap", note: "What's shipped, next and later", href: "/roadmap" },
  { label: "Compare", note: "Where Spotcheck fits among other libraries", href: "/compare" },
]
