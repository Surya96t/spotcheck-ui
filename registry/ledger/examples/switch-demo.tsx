import { Switch } from "@/registry/ledger/components/ledger/switch"

export function SwitchDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Switch defaultChecked>Stream responses</Switch>
      <Switch>Cache prompts</Switch>
    </div>
  )
}
