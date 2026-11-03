import { cn } from "@/lib/utils"

const SOFT = "color-mix(in srgb, var(--ink) 20%, transparent)"
const MID = "color-mix(in srgb, var(--ink) 50%, transparent)"
const ACCENT = "var(--accent-ink)"
const RULE = "var(--rule) solid var(--ink)"

type Block = { width: string; height: number; color: string; border?: string }
type Kind = keyof typeof SHAPES

const block = (width: string, height: number, color: string, border?: string): Block => ({ width, height, color, border })

const SHAPES = {
  text: (seed: number) => [block("100%", 9, MID), block(`${70 + (seed % 4) * 8}%`, 9, SOFT), block("54%", 9, SOFT), block("22%", 9, ACCENT)],
  rows: (seed: number) => [0, 1, 2, 3].map((row) => block("100%", 15, row === seed % 4 ? ACCENT : SOFT)),
  trace: (seed: number) => [block("100%", 11, "var(--ink)"), block(`${30 + (seed % 5) * 8}%`, 11, MID), block("68%", 11, SOFT), block("86%", 11, ACCENT)],
  matrix: (seed: number) =>
    Array.from({ length: 18 }, (_, cell) =>
      block("14.6%", 19, `color-mix(in srgb, var(--accent-ink) ${10 + ((cell * 7 + seed * 11) % 9) * 11}%, var(--wash))`),
    ),
  wave: (seed: number) =>
    Array.from({ length: 16 }, (_, bar) => block("4%", 20 + Math.round(70 * Math.abs(Math.sin(bar * 0.7 + seed))), bar % 5 === 2 ? ACCENT : MID)),
  meter: (seed: number) => [block("44%", 20, ACCENT), block("24%", 20, MID), block(`${12 + (seed % 3) * 4}%`, 20, SOFT), block("100%", 9, SOFT)],
  form: (seed: number) => [block("34%", 9, MID), block("100%", 36, "transparent", RULE), block("44%", 26, seed % 2 ? ACCENT : SOFT)],
  button: (seed: number) => [block("48%", 40, seed % 2 ? "transparent" : ACCENT, RULE), block("32%", 40, seed % 2 ? ACCENT : "transparent", RULE)],
  diff: () => [
    block("100%", 13, SOFT),
    block("92%", 13, "color-mix(in srgb, var(--bad) 60%, transparent)"),
    block("96%", 13, "color-mix(in srgb, var(--ok) 60%, transparent)"),
    block("58%", 13, SOFT),
  ],
}

const KINDS: Record<string, Kind> = {
  "stream-response": "text",
  "trace-waterfall": "trace",
  composer: "form",
  thinking: "wave",
  "context-budget": "meter",
  "eval-matrix": "matrix",
  "diff-review": "diff",
  "model-race": "trace",
  "settings-screen": "form",
  "chat-screen": "text",
  "bar-terrain": "wave",
  "embedding-space": "matrix",
  "linked-bars": "wave",
  coverflow: "matrix",
  "cube-tabs": "button",
  "tilt-card": "form",
  "detent-slider": "meter",
  "magnetic-button": "button",
  "stamp-approval": "button",
  "split-flap": "matrix",
  "ripple-heatmap": "matrix",
  "draw-chart": "wave",
  "swipe-review": "form",
  "roll-number": "text",
  "scramble-text": "text",
  marquee: "meter",
  "scrub-input": "form",
  button: "button",
  "hold-button": "button",
  field: "form",
  tabs: "button",
  switch: "button",
  segmented: "button",
  checkbox: "form",
  "radio-group": "form",
  select: "form",
  combobox: "form",
  "date-picker": "matrix",
  pagination: "button",
  dialog: "form",
  sheet: "form",
  popover: "form",
  tooltip: "button",
  toast: "form",
  "status-pill": "button",
  tag: "button",
  chip: "button",
  kbd: "button",
  sparkline: "wave",
  progress: "meter",
  skeleton: "text",
  "app-frame": "form",
}

/** A small shape that hints at a part. The live demo is one click away on its own page. */
export function PartPreview({ slug, seed }: { slug: string; seed: number }) {
  const kind = KINDS[slug] ?? "rows"

  return (
    <div
      aria-hidden
      className={cn(
        "flex h-[104px] flex-wrap content-center gap-[5px] overflow-hidden p-3 md:h-[138px] md:px-4 md:py-[18px]",
        kind === "wave" ? "items-end" : "items-center",
      )}
    >
      {SHAPES[kind](seed).map((shape, index) => (
        <span
          key={index}
          className="block box-border"
          style={{ width: shape.width, height: shape.height, background: shape.color, border: shape.border }}
        />
      ))}
    </div>
  )
}
