import { Segmented } from "@/registry/spotcheck/components/spotcheck/segmented"

export function SegmentedDemo() {
  return <Segmented label="Range" options={["Day", "Week", "Month", "Year"]} defaultValue="Week" />
}
