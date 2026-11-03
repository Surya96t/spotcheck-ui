import type { Metadata } from "next"
import type { ReactNode } from "react"

import { siteUrl } from "@/lib/site"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Spotcheck UI", template: "%s · Spotcheck UI" },
  description: "Open source React components with hard edges, real motion and 3D.",
}

// Runs before first paint, because static pages can't know the visitor's theme or skin.
const restoreAppearance = `(function(){try{var d=document.documentElement,t=localStorage.getItem("spotcheck-theme"),s=localStorage.getItem("spotcheck-skin");if(t)d.dataset.theme=t;if(s)d.dataset.skin=s}catch(e){}})()`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="system" data-skin="ledger" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: restoreAppearance }} />
      </head>
      <body className="pr-[env(safe-area-inset-right,0px)] pl-[env(safe-area-inset-left,0px)]">
        <a
          href="#content"
          className="bg-ink text-paper fixed top-2 left-6 z-30 -translate-y-16 px-3 py-1.5 font-(family-name:--f-mono) text-xs focus:translate-y-0"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
