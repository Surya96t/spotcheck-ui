"use client"

import * as React from "react"

import { AppFrame } from "@/registry/ledger/components/ledger/app-frame"
import { Button } from "@/registry/ledger/components/ledger/button"
import { Checkbox } from "@/registry/ledger/components/ledger/checkbox"
import { Combobox } from "@/registry/ledger/components/ledger/combobox"
import { DatePicker } from "@/registry/ledger/components/ledger/date-picker"
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/registry/ledger/components/ledger/dialog"
import { Field, Input } from "@/registry/ledger/components/ledger/field"
import { HoldButton } from "@/registry/ledger/components/ledger/hold-button"
import { LedgerTable, type LedgerColumn } from "@/registry/ledger/components/ledger/ledger-table"
import { RadioGroup } from "@/registry/ledger/components/ledger/radio-group"
import { Segmented } from "@/registry/ledger/components/ledger/segmented"
import { Select } from "@/registry/ledger/components/ledger/select"
import { StatusPill } from "@/registry/ledger/components/ledger/status-pill"
import { Switch } from "@/registry/ledger/components/ledger/switch"
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/ledger/components/ledger/tabs"
import { ToastProvider, toast } from "@/registry/ledger/components/ledger/toast"

const NAME_LIMIT = 32
const MODELS = [
  { value: "atlas-l", label: "atlas-l" },
  { value: "atlas-m", label: "atlas-m" },
  { value: "atlas-s", label: "atlas-s" },
]
const REGIONS = ["Mumbai", "Hyderabad", "Singapore", "Frankfurt", "Virginia", "Oregon"]
const RETENTION = [
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "365", label: "One year" },
]

type ApiKey = { id: string; name: string; used: number; status: "active" | "expiring" }

const KEYS: ApiKey[] = [
  { id: "k1", name: "ci-runner", used: 18204, status: "active" },
  { id: "k2", name: "staging-worker", used: 4310, status: "active" },
  { id: "k3", name: "old-notebook", used: 92, status: "expiring" },
]

const KEY_COLUMNS: LedgerColumn<ApiKey>[] = [
  { key: "name", label: "Key", emphasis: true },
  { key: "used", label: "Calls", numeric: true, render: (key) => key.used.toLocaleString("en-US") },
  {
    key: "status",
    label: "Status",
    render: (key) => <StatusPill tone={key.status === "active" ? "ok" : "warn"}>{key.status}</StatusPill>,
  },
]

export function SettingsScreen() {
  const [name, setName] = React.useState("support-qa")
  const nameError = name.trim() ? undefined : "Give the workspace a name so people can find it."

  return (
    <ToastProvider>
      <AppFrame title="console / settings">
        <div className="p-4">
          <Tabs defaultValue="general">
            <TabsList>
              <TabsTab value="general">General</TabsTab>
              <TabsTab value="alerts">Alerts</TabsTab>
              <TabsTab value="keys">API keys</TabsTab>
              <TabsTab value="danger">Danger</TabsTab>
            </TabsList>

            <TabsPanel value="general" className="flex max-w-120 flex-col gap-4">
              <Field label="Workspace name" hint={`${name.length}/${NAME_LIMIT}`} error={nameError}>
                <Input value={name} maxLength={NAME_LIMIT} onChange={(event) => setName(event.target.value)} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Default model">
                  <Select label="Default model" options={MODELS} defaultValue="atlas-m" />
                </Field>
                <Field label="Region">
                  <Combobox label="Region" options={REGIONS} defaultValue="Mumbai" />
                </Field>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <DatePicker label="Billing starts" defaultMonth={new Date(2026, 10, 1)} />
                <Button
                  variant="accent"
                  disabled={Boolean(nameError)}
                  onClick={() => toast.add({ title: "Saved", description: `${name} is up to date.` })}
                >
                  Save
                </Button>
              </div>
            </TabsPanel>

            <TabsPanel value="alerts" className="flex flex-col items-start gap-4">
              <Switch defaultChecked>Email me when an eval fails</Switch>
              <Switch>Post spend alerts to the team</Switch>
              <Checkbox defaultChecked>Include weekends</Checkbox>
              <div className="flex items-center gap-3">
                <span className="ledger-label">Digest</span>
                <Segmented label="Digest" options={["Off", "Daily", "Weekly"]} defaultValue="Daily" />
              </div>
              <RadioGroup label="Keep traces for" options={RETENTION} defaultValue="90" />
            </TabsPanel>

            <TabsPanel value="keys" className="flex flex-col items-start gap-4">
              <LedgerTable
                title="API keys"
                rows={KEYS}
                columns={KEY_COLUMNS}
                rowKey="id"
                defaultSort={{ key: "used", dir: "desc" }}
                className="w-full"
              />
              <Dialog>
                <DialogTrigger render={<Button variant="ink" />}>New key</DialogTrigger>
                <DialogContent title="New API key" description="It's shown once, so copy it somewhere safe.">
                  <Field label="Key name">
                    <Input defaultValue="my-worker" />
                  </Field>
                  <div className="mt-4 flex gap-3">
                    <DialogClose render={<Button variant="accent" />}>Create key</DialogClose>
                    <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsPanel>

            <TabsPanel value="danger" className="flex flex-col items-start gap-3">
              <p className="max-w-[52ch] text-sm">
                This removes every run, dataset and key in the workspace. It can&apos;t be undone.
              </p>
              <HoldButton confirmedLabel="Workspace deleted · press to reset">Hold to delete workspace</HoldButton>
            </TabsPanel>
          </Tabs>
        </div>
      </AppFrame>
    </ToastProvider>
  )
}
