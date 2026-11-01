"use client"

import dynamic from "next/dynamic"

const DEMOS = {
  "roll-number": dynamic(
    () => import("@/registry/ledger/examples/roll-number-demo").then((module) => module.RollNumberDemo),
  ),
  "detent-slider": dynamic(
    () => import("@/registry/ledger/examples/detent-slider-demo").then((module) => module.DetentSliderDemo),
  ),
  "bar-terrain": dynamic(
    () => import("@/registry/ledger/examples/bar-terrain-demo").then((module) => module.BarTerrainDemo),
    { ssr: false },
  ),
  "command-palette": dynamic(
    () => import("@/registry/ledger/examples/command-palette-demo").then((module) => module.CommandPaletteDemo),
  ),
  "ledger-table": dynamic(
    () => import("@/registry/ledger/examples/ledger-table-demo").then((module) => module.LedgerTableDemo),
  ),
  "button": dynamic(
    () => import("@/registry/ledger/examples/button-demo").then((module) => module.ButtonDemo),
  ),
  "hold-button": dynamic(
    () => import("@/registry/ledger/examples/hold-button-demo").then((module) => module.HoldButtonDemo),
  ),
  "field": dynamic(
    () => import("@/registry/ledger/examples/field-demo").then((module) => module.FieldDemo),
  ),
  "tabs": dynamic(
    () => import("@/registry/ledger/examples/tabs-demo").then((module) => module.TabsDemo),
  ),
  "switch": dynamic(
    () => import("@/registry/ledger/examples/switch-demo").then((module) => module.SwitchDemo),
  ),
  "segmented": dynamic(
    () => import("@/registry/ledger/examples/segmented-demo").then((module) => module.SegmentedDemo),
  ),
  "checkbox": dynamic(
    () => import("@/registry/ledger/examples/checkbox-demo").then((module) => module.CheckboxDemo),
  ),
  "radio-group": dynamic(
    () => import("@/registry/ledger/examples/radio-group-demo").then((module) => module.RadioGroupDemo),
  ),
  "select": dynamic(
    () => import("@/registry/ledger/examples/select-demo").then((module) => module.SelectDemo),
  ),
  "combobox": dynamic(
    () => import("@/registry/ledger/examples/combobox-demo").then((module) => module.ComboboxDemo),
  ),
  "date-picker": dynamic(
    () => import("@/registry/ledger/examples/date-picker-demo").then((module) => module.DatePickerDemo),
  ),
  "pagination": dynamic(
    () => import("@/registry/ledger/examples/pagination-demo").then((module) => module.PaginationDemo),
  ),
  "dialog": dynamic(
    () => import("@/registry/ledger/examples/dialog-demo").then((module) => module.DialogDemo),
  ),
  "sheet": dynamic(
    () => import("@/registry/ledger/examples/sheet-demo").then((module) => module.SheetDemo),
  ),
  "dropdown-menu": dynamic(
    () => import("@/registry/ledger/examples/dropdown-menu-demo").then((module) => module.DropdownMenuDemo),
  ),
  "popover": dynamic(
    () => import("@/registry/ledger/examples/popover-demo").then((module) => module.PopoverDemo),
  ),
  "tooltip": dynamic(
    () => import("@/registry/ledger/examples/tooltip-demo").then((module) => module.TooltipDemo),
  ),
  "toast": dynamic(
    () => import("@/registry/ledger/examples/toast-demo").then((module) => module.ToastDemo),
  ),
  "status-pill": dynamic(
    () => import("@/registry/ledger/examples/status-pill-demo").then((module) => module.StatusPillDemo),
  ),
  "tag": dynamic(
    () => import("@/registry/ledger/examples/tag-demo").then((module) => module.TagDemo),
  ),
  "chip": dynamic(
    () => import("@/registry/ledger/examples/chip-demo").then((module) => module.ChipDemo),
  ),
  "kbd": dynamic(
    () => import("@/registry/ledger/examples/kbd-demo").then((module) => module.KbdDemo),
  ),
  "kv-row": dynamic(
    () => import("@/registry/ledger/examples/kv-row-demo").then((module) => module.KvRowDemo),
  ),
  "sparkline": dynamic(
    () => import("@/registry/ledger/examples/sparkline-demo").then((module) => module.SparklineDemo),
  ),
  "progress": dynamic(
    () => import("@/registry/ledger/examples/progress-demo").then((module) => module.ProgressDemo),
  ),
  "skeleton": dynamic(
    () => import("@/registry/ledger/examples/skeleton-demo").then((module) => module.SkeletonDemo),
  ),
  "app-frame": dynamic(
    () => import("@/registry/ledger/examples/app-frame-demo").then((module) => module.AppFrameDemo),
  ),
  "settings-screen": dynamic(
    () => import("@/registry/ledger/examples/settings-screen-demo").then((module) => module.SettingsScreenDemo),
  ),
}

export function Demo({ slug }: { slug: string }) {
  const Component = DEMOS[slug as keyof typeof DEMOS]
  if (!Component) throw new Error(`No demo for ${slug}. Add it to components/site/demos.tsx.`)
  return <Component />
}
