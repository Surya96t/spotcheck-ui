import type { Metadata } from "next"
import type { ReactNode } from "react"

import { siteUrl } from "@/lib/site"

import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Ledger UI", template: "%s · Ledger UI" },
  description: "Open source React components cut from a ledger.",
}

// Runs before first paint, because static pages can't know the visitor's theme or skin.
const restoreAppearance = `(function(){try{var d=document.documentElement,t=localStorage.getItem("ledger-theme"),s=localStorage.getItem("ledger-skin");if(t)d.dataset.theme=t;if(s)d.dataset.skin=s}catch(e){}})()`

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="system" data-skin="ledger" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: restoreAppearance }} />
      </head>
      <body className="px-[max(16px,env(safe-area-inset-left,0px))]">
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
