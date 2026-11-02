import Link from "next/link"
import { Fragment, type ReactNode } from "react"

export type Crumb = { label: string; href?: string }

export function Breadcrumb({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="spotcheck-label">
      <Link href="/" className="underline underline-offset-3">
        Home
      </Link>
      {trail.map((crumb) => (
        <Fragment key={crumb.label}>
          {" / "}
          {crumb.href ? (
            <Link href={crumb.href} className="underline underline-offset-3">
              {crumb.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-ink">
              {crumb.label}
            </span>
          )}
        </Fragment>
      ))}
    </nav>
  )
}

type PageTitleProps = { trail: Crumb[]; title: string; children?: ReactNode }

export function PageTitle({ trail, title, children }: PageTitleProps) {
  return (
    <header className="border-ink border-b-(length:--rule) px-4 pt-6 pb-5 md:px-8">
      <Breadcrumb trail={trail} />
      <h1 className="spotcheck-display mt-4 text-[clamp(56px,10vw,150px)] leading-[.88]">{title}</h1>
      {children && <div className="mt-4 max-w-[52ch] text-lg leading-snug text-pretty">{children}</div>}
    </header>
  )
}
