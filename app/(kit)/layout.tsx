import type { ReactNode } from "react"

import { Shell } from "@/components/site/shell"

export default function KitLayout({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>
}
