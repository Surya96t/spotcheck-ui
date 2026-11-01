import { Checkbox } from "@/registry/ledger/components/ledger/checkbox"

export function CheckboxDemo() {
  return (
    <div className="flex flex-col items-start gap-2">
      <Checkbox defaultChecked>Include weekends</Checkbox>
      <Checkbox>Email the whole team</Checkbox>
      <Checkbox disabled>Locked by your admin</Checkbox>
    </div>
  )
}
