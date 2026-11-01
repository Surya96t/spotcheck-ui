import { Segmented } from "@/registry/ledger/components/ledger/segmented"

export function SegmentedDemo() {
  return <Segmented label="Range" options={["Day", "Week", "Month", "Year"]} defaultValue="Week" />
}
