import Link from "next/link"

import { Shell } from "@/components/site/shell"

export default function NotFound() {
  return (
    <Shell>
      <div className="px-4 py-10">
        <p className="spotcheck-label">404</p>
        <h1 className="spotcheck-display mt-2 text-[clamp(44px,7vw,96px)] leading-[.85]">Not on file</h1>
        <p className="mt-3">
          That page doesn&apos;t exist.{" "}
          <Link href="/components" className="text-accent-ink underline underline-offset-2">
            Back to the index
          </Link>
        </p>
      </div>
    </Shell>
  )
}
