"use client"

import * as React from "react"

import { Field, Input, Textarea } from "@/registry/ledger/components/ledger/field"

const NAME_LIMIT = 32
const KEY_LENGTH = 12

export function FieldDemo() {
  const [name, setName] = React.useState("support-qa")
  const [key, setKey] = React.useState("sk-")
  const short = key.length > 0 && key.length < KEY_LENGTH

  return (
    <div className="flex max-w-105 flex-col gap-3.5">
      <Field label="Dataset name" hint={`${name.length}/${NAME_LIMIT}`}>
        <Input value={name} maxLength={NAME_LIMIT} onChange={(event) => setName(event.target.value)} />
      </Field>
      <Field label="API key" hint="Required" error={short ? "Keys are at least 12 characters. Paste the full key." : undefined}>
        <Input value={key} onChange={(event) => setKey(event.target.value)} />
      </Field>
      <Field label="Notes">
        <Textarea rows={2} defaultValue="Graded by the support team." />
      </Field>
    </div>
  )
}
