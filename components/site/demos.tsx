"use client"

import dynamic from "next/dynamic"

const DEMOS = {
  "roll-number": dynamic(
    () => import("@/registry/spotcheck/examples/roll-number-demo").then((module) => module.RollNumberDemo),
  ),
  "detent-slider": dynamic(
    () => import("@/registry/spotcheck/examples/detent-slider-demo").then((module) => module.DetentSliderDemo),
  ),
  "bar-terrain": dynamic(
    () => import("@/registry/spotcheck/examples/bar-terrain-demo").then((module) => module.BarTerrainDemo),
    { ssr: false },
  ),
  "embedding-space": dynamic(
    () => import("@/registry/spotcheck/examples/embedding-space-demo").then((module) => module.EmbeddingSpaceDemo),
    { ssr: false },
  ),
  "linked-bars": dynamic(
    () => import("@/registry/spotcheck/examples/linked-bars-demo").then((module) => module.LinkedBarsDemo),
    { ssr: false },
  ),
  "command-palette": dynamic(
    () => import("@/registry/spotcheck/examples/command-palette-demo").then((module) => module.CommandPaletteDemo),
  ),
  "ledger-table": dynamic(
    () => import("@/registry/spotcheck/examples/ledger-table-demo").then((module) => module.LedgerTableDemo),
  ),
  "button": dynamic(
    () => import("@/registry/spotcheck/examples/button-demo").then((module) => module.ButtonDemo),
  ),
  "hold-button": dynamic(
    () => import("@/registry/spotcheck/examples/hold-button-demo").then((module) => module.HoldButtonDemo),
  ),
  "field": dynamic(
    () => import("@/registry/spotcheck/examples/field-demo").then((module) => module.FieldDemo),
  ),
  "tabs": dynamic(
    () => import("@/registry/spotcheck/examples/tabs-demo").then((module) => module.TabsDemo),
  ),
  "switch": dynamic(
    () => import("@/registry/spotcheck/examples/switch-demo").then((module) => module.SwitchDemo),
  ),
  "segmented": dynamic(
    () => import("@/registry/spotcheck/examples/segmented-demo").then((module) => module.SegmentedDemo),
  ),
  "checkbox": dynamic(
    () => import("@/registry/spotcheck/examples/checkbox-demo").then((module) => module.CheckboxDemo),
  ),
  "radio-group": dynamic(
    () => import("@/registry/spotcheck/examples/radio-group-demo").then((module) => module.RadioGroupDemo),
  ),
  "select": dynamic(
    () => import("@/registry/spotcheck/examples/select-demo").then((module) => module.SelectDemo),
  ),
  "combobox": dynamic(
    () => import("@/registry/spotcheck/examples/combobox-demo").then((module) => module.ComboboxDemo),
  ),
  "date-picker": dynamic(
    () => import("@/registry/spotcheck/examples/date-picker-demo").then((module) => module.DatePickerDemo),
  ),
  "pagination": dynamic(
    () => import("@/registry/spotcheck/examples/pagination-demo").then((module) => module.PaginationDemo),
  ),
  "dialog": dynamic(
    () => import("@/registry/spotcheck/examples/dialog-demo").then((module) => module.DialogDemo),
  ),
  "sheet": dynamic(
    () => import("@/registry/spotcheck/examples/sheet-demo").then((module) => module.SheetDemo),
  ),
  "dropdown-menu": dynamic(
    () => import("@/registry/spotcheck/examples/dropdown-menu-demo").then((module) => module.DropdownMenuDemo),
  ),
  "popover": dynamic(
    () => import("@/registry/spotcheck/examples/popover-demo").then((module) => module.PopoverDemo),
  ),
  "tooltip": dynamic(
    () => import("@/registry/spotcheck/examples/tooltip-demo").then((module) => module.TooltipDemo),
  ),
  "toast": dynamic(
    () => import("@/registry/spotcheck/examples/toast-demo").then((module) => module.ToastDemo),
  ),
  "status-pill": dynamic(
    () => import("@/registry/spotcheck/examples/status-pill-demo").then((module) => module.StatusPillDemo),
  ),
  "tag": dynamic(
    () => import("@/registry/spotcheck/examples/tag-demo").then((module) => module.TagDemo),
  ),
  "chip": dynamic(
    () => import("@/registry/spotcheck/examples/chip-demo").then((module) => module.ChipDemo),
  ),
  "kbd": dynamic(
    () => import("@/registry/spotcheck/examples/kbd-demo").then((module) => module.KbdDemo),
  ),
  "kv-row": dynamic(
    () => import("@/registry/spotcheck/examples/kv-row-demo").then((module) => module.KvRowDemo),
  ),
  "sparkline": dynamic(
    () => import("@/registry/spotcheck/examples/sparkline-demo").then((module) => module.SparklineDemo),
  ),
  "progress": dynamic(
    () => import("@/registry/spotcheck/examples/progress-demo").then((module) => module.ProgressDemo),
  ),
  "skeleton": dynamic(
    () => import("@/registry/spotcheck/examples/skeleton-demo").then((module) => module.SkeletonDemo),
  ),
  "app-frame": dynamic(
    () => import("@/registry/spotcheck/examples/app-frame-demo").then((module) => module.AppFrameDemo),
  ),
  "settings-screen": dynamic(
    () => import("@/registry/spotcheck/examples/settings-screen-demo").then((module) => module.SettingsScreenDemo),
  ),
  "scramble-text": dynamic(
    () => import("@/registry/spotcheck/examples/scramble-text-demo").then((module) => module.ScrambleTextDemo),
  ),
  "marquee": dynamic(
    () => import("@/registry/spotcheck/examples/marquee-demo").then((module) => module.MarqueeDemo),
  ),
  "entry-list": dynamic(
    () => import("@/registry/spotcheck/examples/entry-list-demo").then((module) => module.EntryListDemo),
  ),
  "scrub-input": dynamic(
    () => import("@/registry/spotcheck/examples/scrub-input-demo").then((module) => module.ScrubInputDemo),
  ),
  "magnetic-button": dynamic(
    () => import("@/registry/spotcheck/examples/magnetic-button-demo").then((module) => module.MagneticButtonDemo),
  ),
  "stamp-approval": dynamic(
    () => import("@/registry/spotcheck/examples/stamp-approval-demo").then((module) => module.StampApprovalDemo),
  ),
  "split-flap": dynamic(
    () => import("@/registry/spotcheck/examples/split-flap-demo").then((module) => module.SplitFlapDemo),
  ),
  "ripple-heatmap": dynamic(
    () => import("@/registry/spotcheck/examples/ripple-heatmap-demo").then((module) => module.RippleHeatmapDemo),
  ),
  "draw-chart": dynamic(
    () => import("@/registry/spotcheck/examples/draw-chart-demo").then((module) => module.DrawChartDemo),
  ),
  "swipe-review": dynamic(
    () => import("@/registry/spotcheck/examples/swipe-review-demo").then((module) => module.SwipeReviewDemo),
  ),
  "stream-response": dynamic(
    () => import("@/registry/spotcheck/examples/stream-response-demo").then((module) => module.StreamResponseDemo),
  ),
  "agent-trace": dynamic(
    () => import("@/registry/spotcheck/examples/agent-trace-demo").then((module) => module.AgentTraceDemo),
  ),
  "trace-waterfall": dynamic(
    () => import("@/registry/spotcheck/examples/trace-waterfall-demo").then((module) => module.TraceWaterfallDemo),
  ),
  "composer": dynamic(
    () => import("@/registry/spotcheck/examples/composer-demo").then((module) => module.ComposerDemo),
  ),
  "thinking": dynamic(
    () => import("@/registry/spotcheck/examples/thinking-demo").then((module) => module.ThinkingDemo),
  ),
  "context-budget": dynamic(
    () => import("@/registry/spotcheck/examples/context-budget-demo").then((module) => module.ContextBudgetDemo),
  ),
  "eval-matrix": dynamic(
    () => import("@/registry/spotcheck/examples/eval-matrix-demo").then((module) => module.EvalMatrixDemo),
  ),
  "run-receipt": dynamic(
    () => import("@/registry/spotcheck/examples/run-receipt-demo").then((module) => module.RunReceiptDemo),
  ),
  "diff-review": dynamic(
    () => import("@/registry/spotcheck/examples/diff-review-demo").then((module) => module.DiffReviewDemo),
  ),
  "model-race": dynamic(
    () => import("@/registry/spotcheck/examples/model-race-demo").then((module) => module.ModelRaceDemo),
  ),
  "chat-screen": dynamic(
    () => import("@/registry/spotcheck/examples/chat-screen-demo").then((module) => module.ChatScreenDemo),
  ),
}

export function Demo({ slug }: { slug: string }) {
  const Component = DEMOS[slug as keyof typeof DEMOS]
  if (!Component) throw new Error(`No demo for ${slug}. Add it to components/site/demos.tsx.`)
  return <Component />
}
