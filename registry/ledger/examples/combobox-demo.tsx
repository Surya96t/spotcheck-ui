import { Combobox } from "@/registry/ledger/components/ledger/combobox"

const REGIONS = ["Mumbai", "Hyderabad", "Singapore", "Tokyo", "Frankfurt", "London", "Virginia", "Oregon"]

export function ComboboxDemo() {
  return <Combobox label="Region" options={REGIONS} placeholder="Find a region" className="max-w-64" />
}
