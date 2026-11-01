import Link from "next/link"

export default function NotFound() {
  return (
    <div className="px-4 py-10">
      <p className="ledger-label">404</p>
      <h1 className="ledger-display mt-2 text-[clamp(44px,7vw,96px)] leading-[.85]">Not in the ledger</h1>
      <p className="mt-3">
        That page doesn&apos;t exist.{" "}
        <Link href="/" className="text-accent-ink underline underline-offset-2">
          Back to the index
        </Link>
      </p>
    </div>
  )
}
