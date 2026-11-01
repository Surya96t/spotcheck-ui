import { Select } from "@/registry/ledger/components/ledger/select"

const OPTIONS = [
  { value: "atlas-l", label: "atlas-l" },
  { value: "atlas-m", label: "atlas-m" },
  { value: "atlas-s", label: "atlas-s" },
  { value: "local/32b", label: "local/32b" },
]

export function SelectDemo() {
  return <Select label="Model" options={OPTIONS} defaultValue="atlas-m" />
}
