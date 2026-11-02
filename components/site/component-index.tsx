"use client"

import Link from "next/link"

import { LedgerTable, type LedgerColumn } from "@/registry/spotcheck/components/spotcheck/ledger-table"
import { Tag } from "@/registry/spotcheck/components/spotcheck/tag"

export type IndexRow = { no: string; name: string; href: string; group: string; engine: string; description: string }

const COLUMNS: LedgerColumn<IndexRow>[] = [
  { key: "no", label: "No" },
  {
    key: "name",
    label: "Component",
    emphasis: true,
    render: (row) => (
      <Link href={row.href} className="hover:underline">
        {row.name}
      </Link>
    ),
  },
  { key: "group", label: "Group" },
  { key: "engine", label: "Engine", render: (row) => <Tag>{row.engine}</Tag> },
  { key: "description", label: "What it does" },
]

export function ComponentIndex({ rows }: { rows: IndexRow[] }) {
  return <LedgerTable title="All components" rows={rows} columns={COLUMNS} rowKey="href" />
}
