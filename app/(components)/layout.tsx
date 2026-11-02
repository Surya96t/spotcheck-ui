import type { ReactNode } from "react"

import { SiteFrame } from "@/components/site/site-frame"

export default function ComponentsLayout({ children }: { children: ReactNode }) {
  return <SiteFrame>{children}</SiteFrame>
}
