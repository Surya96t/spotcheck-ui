"use client"

import * as React from "react"

import { Pagination } from "@/registry/ledger/components/ledger/pagination"

export function PaginationDemo() {
  const [page, setPage] = React.useState(7)

  return <Pagination page={page} pageCount={24} onPageChange={setPage} />
}
