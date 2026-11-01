import type { Metadata } from "next"
import type { ReactNode } from "react"

import "./globals.css"

export const metadata: Metadata = {
  title: "Ledger UI",
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
      <body>{children}</body>
    </html>
  )
}
