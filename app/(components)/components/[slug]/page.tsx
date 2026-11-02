import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import type { ReactNode } from "react"

import { Demo } from "@/components/site/demos"
import { InstallCommand } from "@/components/site/install-command"
import { mdxComponents } from "@/components/site/mdx"
import { Breadcrumb } from "@/components/site/page-title"
import { GROUPS, getComponents, getProps, getRegistryItem } from "@/lib/catalog"
import { Tag } from "@/registry/spotcheck/components/spotcheck/tag"

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getComponents().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const entry = getComponents().find((component) => component.slug === slug)
  if (!entry) return {}
  return { title: entry.page.data.title, description: entry.page.data.description }
}

function Row({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section
      aria-label={title}
      className="border-ink grid gap-3 border-b-(length:--rule) px-4 py-5 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-6"
    >
      <h2 className="spotcheck-label pt-1">{title}</h2>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

const SOFT_RULE = "border-[color-mix(in_srgb,var(--ink)_18%,transparent)]"
const CELL = `border-b ${SOFT_RULE} py-2 pr-4 align-bottom`
const PROP_GRID = "lg:grid-cols-[minmax(0,.9fr)_minmax(0,1fr)_minmax(0,.7fr)_minmax(0,1.4fr)] lg:gap-x-4"
const MONO = "font-(family-name:--f-mono) text-xs"
const SIDE_LINK = "flex min-h-10 items-center px-4 font-(family-name:--f-mono) text-[12.5px]"
const SIDE_RULE = "border-b border-dashed border-[color-mix(in_srgb,var(--ink)_20%,transparent)]"

export default async function ComponentPage({ params }: Params) {
  const { slug } = await params
  const all = getComponents()
  const index = all.findIndex((component) => component.slug === slug)
  const entry = all[index]
  if (!entry) notFound()

  const { page } = entry
  const Body = page.data.body
  const props = getProps(slug)
  const dependencies = getRegistryItem(slug)?.dependencies ?? []
  const previous = all[index - 1]
  const next = all[index + 1]
  const group = GROUPS.find(({ id }) => id === page.data.group)
  const members = all.filter((component) => component.page.data.group === page.data.group)

  return (
    <div className="flex items-stretch">
      <nav aria-label={`${group?.name} components`} className="border-ink hidden w-60 flex-none border-r-(length:--rule) lg:block">
        <div className="sticky top-[58px]">
          <Link href="/components" className={`${SIDE_LINK} border-ink border-b-(length:--rule) font-semibold`}>
            ← All components
          </Link>
          <div className="spotcheck-label px-4 pt-4 pb-2">
            {group?.name} · {members.length} parts
          </div>
          {members.map((member) => (
            <Link
              key={member.slug}
              href={`/components/${member.slug}`}
              aria-current={member.slug === slug ? "page" : undefined}
              className={`${SIDE_LINK} ${SIDE_RULE} ${
                member.slug === slug ? "bg-accent-ink text-on-accent font-semibold" : "hover:text-accent-ink"
              }`}
            >
              {member.page.data.title}
            </Link>
          ))}
        </div>
      </nav>

      <article className="min-w-0 grow">
        <header className="border-ink border-b-(length:--rule) px-4 pt-6 pb-5 md:px-8">
          <Breadcrumb trail={[{ label: "Components", href: "/components" }, { label: page.data.title }]} />
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <h1 className="spotcheck-display text-[clamp(56px,8vw,118px)] leading-[.88]">{page.data.title}</h1>
            <Tag>{page.data.engine}</Tag>
          </div>
          <p className="mt-3 max-w-[46ch] text-lg leading-snug text-pretty">{page.data.description}</p>
        </header>

      <div data-testid="demo" className="border-ink min-w-0 border-b-(length:--rule) px-4 py-6">
        <Demo slug={slug} />
      </div>

      <Row title="Install">
        <InstallCommand name={slug} />
        <p className="text-mute mt-2 text-[13.5px]">
          {dependencies.length > 0 ? `Also installs ${dependencies.join(", ")}.` : "No motion engine needed."}
        </p>
      </Row>

      <section aria-label="Usage" className="border-ink min-w-0 border-b-(length:--rule) px-4 py-5">
        <Body components={mdxComponents} />
      </section>

      <Row title="Props">
        {props.length === 0 && (
          <p>
            {page.data.group === "screens"
              ? "None. This is a block you edit directly."
              : "No props of its own. It passes everything to its HTML element."}
          </p>
        )}
        <div
          aria-hidden
          className={`${PROP_GRID} border-ink hidden border-b-(length:--rule) ${props.length ? "lg:grid" : ""}`}
        >
          <span className="spotcheck-label py-1.5">Prop</span>
          <span className="spotcheck-label py-1.5">Type</span>
          <span className="spotcheck-label py-1.5">Default</span>
          <span className="spotcheck-label py-1.5">What it does</span>
        </div>
        <ul>
          {props.map((prop) => (
            <li
              key={prop.name}
              className={`${PROP_GRID} ${SOFT_RULE} grid grid-cols-[minmax(0,1fr)] gap-y-1 border-b py-2.5 text-sm lg:items-baseline`}
            >
              <span className={`${MONO} font-semibold`}>
                {prop.name}
                {prop.required && (
                  <span className="text-bad">
                    {" "}
                    * <span className="sr-only">Required</span>
                  </span>
                )}
              </span>
              <code className={`${MONO} [overflow-wrap:anywhere]`}>{prop.type}</code>
              <span className={`${MONO} [overflow-wrap:anywhere]`}>
                <span className="text-mute lg:hidden">Default </span>
                {prop.default ?? "—"}
              </span>
              <span className="text-pretty">{prop.description}</span>
            </li>
          ))}
        </ul>
      </Row>

      <Row title="Keyboard">
        {page.data.keyboard.length > 0 ? (
          <table className="w-full border-collapse text-sm">
            <tbody>
              {page.data.keyboard.map((key) => (
                <tr key={key.keys}>
                  <th scope="row" className={`${CELL} ${MONO} w-28 text-left font-semibold whitespace-nowrap`}>
                    {key.keys}
                  </th>
                  <td className={CELL}>{key.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nothing to operate: this component displays information.</p>
        )}
      </Row>

      <Row title="Reduced motion">
        <p className="max-w-[62ch]">{page.data.reducedMotion}</p>
      </Row>

      <nav aria-label="Other components" className="grid grid-cols-2 font-(family-name:--f-mono) text-xs">
        {previous ? (
          <Link href={`/components/${previous.slug}`} className="hover:bg-ink hover:text-paper border-ink border-r-(length:--rule) p-4">
            ← {previous.page.data.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/components/${next.slug}`} className="hover:bg-ink hover:text-paper col-start-2 p-4 text-right">
            {next.page.data.title} →
          </Link>
        )}
      </nav>
      </article>
    </div>
  )
}
