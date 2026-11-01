import type { ComponentProps } from "react"
import Link from "next/link"

import { CodeBlock } from "./code-block"
import { InstallCommand } from "./install-command"

const RULE_SOFT = "border-[color-mix(in_srgb,var(--ink)_18%,transparent)]"

export const mdxComponents = {
  h2: (props: ComponentProps<"h2">) => <h2 className="ledger-display mt-8 mb-2 text-3xl leading-none first:mt-0" {...props} />,
  h3: (props: ComponentProps<"h3">) => <h3 className="ledger-display mt-6 mb-2 text-xl leading-none" {...props} />,
  p: (props: ComponentProps<"p">) => <p className="my-3 max-w-[68ch] text-pretty" {...props} />,
  ul: (props: ComponentProps<"ul">) => <ul className="my-3 max-w-[68ch] list-['+_'] pl-5" {...props} />,
  ol: (props: ComponentProps<"ol">) => <ol className="my-3 max-w-[68ch] list-decimal pl-5" {...props} />,
  a: ({ href = "", ...props }: ComponentProps<"a">) => (
    <Link href={href} className="text-accent-ink underline underline-offset-2" {...props} />
  ),
  code: (props: ComponentProps<"code">) => (
    <code className="font-(family-name:--f-mono) text-[.9em] [:not(pre)>&]:bg-wash [:not(pre)>&]:px-1" {...props} />
  ),
  pre: CodeBlock,
  table: (props: ComponentProps<"table">) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: ComponentProps<"th">) => (
    <th className="ledger-label border-ink border-b-(length:--rule) py-1.5 pr-4 text-left font-medium" {...props} />
  ),
  td: (props: ComponentProps<"td">) => <td className={`border-b ${RULE_SOFT} py-2 pr-4 align-bottom`} {...props} />,
  InstallCommand,
}
