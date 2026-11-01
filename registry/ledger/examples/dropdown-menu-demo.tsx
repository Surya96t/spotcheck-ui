"use client"

import * as React from "react"

import { Button } from "@/registry/ledger/components/ledger/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/ledger/components/ledger/dropdown-menu"

export function DropdownMenuDemo() {
  const [last, setLast] = React.useState("Nothing yet")

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button />}>Actions</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setLast("Re-run")}>Re-run</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLast("Export CSV")}>Export CSV</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Delete run</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <span className="ledger-label" data-testid="menu-result">
        {last}
      </span>
    </div>
  )
}
