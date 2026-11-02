import type { Metadata } from "next"
import Link from "next/link"

import { PageTitle } from "@/components/site/page-title"
import { repoIsPublic, repoUrl } from "@/lib/site"

export const metadata: Metadata = {
  title: "Support",
  description: "Report a bug, ask a question or read the docs.",
}

const CARD = "border-ink flex min-h-72 flex-col justify-between gap-8 border-b-(length:--rule) p-5 md:border-r-(length:--rule) md:last:border-r-0 md:p-6"
const CARD_LINK = "hover:bg-accent-ink hover:text-on-accent group"

const CHANNELS = [
  { where: "GitHub Issues", title: "Report a bug", note: "Tell us what broke and how to see it.", href: `${repoUrl}/issues` },
  { where: "GitHub Discussions", title: "Ask a question", note: "Ideas, help and how others use it.", href: `${repoUrl}/discussions` },
]

function CardBody({ where, title, note }: { where: string; title: string; note: string }) {
  return (
    <>
      <span className="spotcheck-label group-hover:text-on-accent">{where}</span>
      <span>
        <span className="spotcheck-display block text-7xl leading-[.9]">{title}</span>
        <span className="mt-2.5 block text-[17px]">{note}</span>
      </span>
    </>
  )
}

export default function SupportPage() {
  return (
    <>
      <PageTitle trail={[{ label: "Support" }]} title="Get help" />
      <div className="grid md:grid-cols-3">
        {CHANNELS.map((channel) =>
          repoIsPublic ? (
            <a key={channel.href} href={channel.href} className={`${CARD} ${CARD_LINK}`}>
              <CardBody {...channel} />
            </a>
          ) : (
            <div key={channel.href} className={CARD}>
              <CardBody {...channel} where="Opens at launch" />
            </div>
          ),
        )}
        <Link href="/docs" className={`${CARD} ${CARD_LINK}`}>
          <CardBody where="Docs" title="Read the docs" note="Installation and theming guides." />
        </Link>
      </div>
    </>
  )
}
