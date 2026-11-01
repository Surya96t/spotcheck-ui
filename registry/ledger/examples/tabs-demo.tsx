import { Tabs, TabsList, TabsPanel, TabsTab } from "@/registry/ledger/components/ledger/tabs"

const ITEMS = [
  ["Overview", "Each component is one file. Copy it in, own it, edit the tokens."],
  ["Tokens", "A short set of colours, three type roles and one rule weight."],
  ["Motion", "CSS for the simple things, springs and timelines for the rest."],
  ["License", "MIT. Use it in commercial work."],
] as const

export function TabsDemo() {
  return (
    <Tabs defaultValue="Overview">
      <TabsList>
        {ITEMS.map(([name]) => (
          <TabsTab key={name} value={name}>
            {name}
          </TabsTab>
        ))}
      </TabsList>
      {ITEMS.map(([name, text]) => (
        <TabsPanel key={name} value={name} className="text-mute max-w-[52ch] text-sm">
          {text}
        </TabsPanel>
      ))}
    </Tabs>
  )
}
