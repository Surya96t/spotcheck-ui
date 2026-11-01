import { RadioGroup } from "@/registry/ledger/components/ledger/radio-group"

const OPTIONS = [
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "365", label: "One year" },
]

export function RadioGroupDemo() {
  return <RadioGroup label="Keep traces for" options={OPTIONS} defaultValue="90" />
}
