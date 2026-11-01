# Build Ledger UI: an open-source React component library

## What you're building

Ledger UI is an open-source React component library with a brutalist, typographic look built around a ledger. You'll build two things:

1. **The registry.** It must work with the shadcn CLI, so people copy component source into their own projects instead of installing a package.
2. **The docs site.** It shows every component live, with usage, props and a copy-able install command. Think ReactBits, Magic UI or Cult UI, but with this visual identity.

A working single-file prototype is at `reference/ledger-ui-prototype.html`. Open it in a browser and read the source before you start. **It is the visual and behavioural spec.** Match its look, motion and interactions. Don't copy its code structure: it's one long htm/UMD script and needs to become a proper TypeScript codebase.

## Positioning

Keep this in mind when you make judgement calls.

- shadcn/ui and Origin UI give you solid app building blocks with almost no motion.
- Magic UI, Aceternity, React Bits and Cult UI focus on effects for marketing pages.
- **Ledger's gap:** motion and 3D on everyday app controls (sliders, approvals, review queues, tables, pickers), plus components built for AI products (streaming, agent traces, context budgets, evals).

Licensing rules:

- **Don't copy code from Aceternity.** Its licence forbids redistributing source.
- **Don't copy code from React Bits.** It uses MIT + Commons Clause.
- Magic UI, Cult UI and shadcn are MIT. Borrow patterns from them and credit them in `CREDITS.md`.
- Everything in the prototype is original.

## Stack

- **Docs site:** Next.js (App Router), TypeScript in strict mode, pnpm.
- **Styling:** Tailwind CSS v4, with every design value expressed as CSS variables (tokens below). Components must still look right when someone changes only the tokens.
- **Motion engines.** Each component uses only the engine it needs:
  - `motion` (motion.dev). In React, use `motion/react`. Use it for springs, drag, momentum and gestures.
  - `animejs` v4. Use the latest 4.x and the ES module build. Use it for timelines, staggers, SVG drawing and anything sequenced. v4.5+ has a three.js adapter (`animejs/adapters/three`) and 3D grid staggers, so use those where they help.
  - `three` with `@react-three/fiber`. Use it for WebGL components. Add `@react-three/drei` only when a helper really saves code.
- **Registry:** shadcn registry format. Write `registry.json` and run `shadcn build` so that `npx shadcn add https://<site>/r/<name>.json` works. Each registry item declares its npm `dependencies` (for example `motion`, `animejs`, `three`, `@react-three/fiber`) and its `registryDependencies` (for example a component that uses `roll-number`).
- **Testing:** Vitest and Testing Library for logic and accessibility; Playwright for interaction smoke tests and screenshots.

## Repo layout (suggested)

```
apps/docs/                 Next.js docs site
registry/ledger/
  tokens/                  tokens.css, skins
  core/                    ledger-table, button, hold-button, field, tabs, switch, segmented
  motion/                  roll-number, scramble-text, marquee, entry-list
  springs/                 magnetic-button, detent-slider, stamp-approval
  timelines/               split-flap, ripple-heatmap, draw-chart, swipe-review
  webgl/                   bar-terrain, embedding-space
  depth/                   configurator, tilt-card, voice-orb, coverflow, cube-tabs,
                           fold-report, drum-picker, linked-bars, region-globe
  ai/                      stream-response, agent-trace, composer, thinking,
                           context-budget, eval-matrix
  screens/                 command-palette, chat-screen, dashboard
  hooks/                   use-spring-value, use-reduced-motion, use-gl-palette, use-in-view
reference/ledger-ui-prototype.html
registry.json
CREDITS.md
```

Each component is **one file**, with any component-specific constants at the top so someone who copies it can find and edit them.

## Design tokens

Copy these exactly from the prototype.

**Light**

| Token | Value |
|---|---|
| `--paper` | `#EDEFEC` |
| `--ink` | `#0D0E11` |
| `--mute` | `#646972` |
| `--wash` | `#DFE3DE` |
| `--raise` | `#F7F8F6` |
| `--ok` | `#17804A` |
| `--warn` | `#A86400` |
| `--bad` | `#BE2219` |
| `--on-accent` | `#FFFFFF` |

**Dark**

| Token | Value |
|---|---|
| `--paper` | `#0C0D0F` |
| `--ink` | `#E8EAE5` |
| `--mute` | `#8D929A` |
| `--wash` | `#191B1F` |
| `--raise` | `#131518` |
| `--ok` | `#40C47A` |
| `--warn` | `#E6A43A` |
| `--bad` | `#FF5F52` |
| `--on-accent` | `#0C0D0F` |

**Other values**

- **Rule weight:** `--rule: 2px`. No border radius anywhere.
- **Shadows:** hard offset only, for example `4px 4px 0 var(--ink)`. Never blurred.
- **Theme switching:** the system theme by default, plus `[data-theme="light"|"dark"]` overrides.

**Type**

- **Display and body:** Archivo, a variable font with width 62–125. Display text uses `font-stretch: 62%`, weight 800–900, uppercase and tight leading.
- **Mono:** IBM Plex Mono. Use it for labels, numbers and metadata. Labels are 10.5–12px uppercase with letter-spacing `.12em`.
- **Serif:** Instrument Serif, used only by the Folio skin.
- **Numbers:** always `font-variant-numeric: tabular-nums` wherever digits line up.

**Skins**

Skins share markup and only swap tokens and the display face.

| Skin | Accent (light / dark) | Type change |
|---|---|---|
| Ledger | `#2433E0` / `#7E88FF` | none |
| Terminal | `#A3530A` / `#FFB020` | all text in the mono face |
| Folio | `#C1122C` / `#FF5468` | display text in Instrument Serif italic, no uppercase |

**Layout language**

- Full-bleed grids and hard rules.
- Text sits on the **bottom** of each row or cell, not centred.
- A narrow numbered rail on the left.
- Titles sit inside the grid.

## Components

Build them in this order. Prop names are suggestions, so refine them if something cleaner emerges. Behaviour must match the prototype.

### Phase 1: Foundation and Core

- **`ledger-table`**
  - Full-bleed, with no horizontal row rules and cell text seated at the bottom.
  - Numbered row rail; the title row lives inside the table.
  - Sortable headers with `aria-sort`; columns can render custom cells.
  - Hovering a row inverts it to ink.
  - Props: `title`, `rows`, `columns[] {key,label,numeric?,emphasis?,render?}`, `defaultSort`, `rowKey`.
- **`button`**
  - Variants: ink, accent, outline and ghost (dashed).
  - Hard offset shadow that collapses on press, with the button translating into the shadow.
- **`hold-button`**
  - A destructive action that needs a press-and-hold (1.2s by default) with a fill bar.
  - Must work with the keyboard: Space or Enter held down.
- **`field` + `input`**
  - Underline inputs with a mono label row holding a counter or a hint.
  - Error text says how to fix the problem.
- **`tabs`:** condensed uppercase labels with a heavy accent bar that slides between tabs.
- **`switch`:** square, with role `switch`.
- **`segmented`:** ruled buttons using `aria-pressed`.

### Phase 2: Motion (CSS and rAF) and Springs (motion.dev)

- **`roll-number`**
  - Each digit is its own column, so only the digits that change move.
  - Accepts `value` (a number that gets formatted) or `text`. Non-digits stay static.
  - Other components use it.
- **`scramble-text`:** decodes left to right from block glyphs, on mount and on hover. (anime.js 4.4+ has `scrambleText()`, which you may use.)
- **`marquee`:** a ruled band of display type that pauses on hover.
- **`entry-list`:** rows slide in one after another with a stagger.
- **`magnetic-button`**
  - Leans toward the pointer from outside its edges; the label lags behind.
  - Release uses an underdamped spring: stiffness 170, damping 8.
- **`detent-slider`**
  - Drags freely, then springs to the nearest step with overshoot.
  - Optional named zones; the prototype uses Deterministic, Balanced and Creative for temperature.
  - Full slider ARIA, with arrow keys, Home and End.
- **`stamp-approval`**
  - A human-in-the-loop card for an agent tool call (name and arguments).
  - Approve or Deny drops a rubber stamp from scale 2.6 with a stiff spring, and the card jolts on impact.

### Phase 3: Timelines (anime.js)

- **`split-flap`**
  - A departures-style board for jobs.
  - Each changed cell spins through random glyphs, staggered by column and row.
- **`ripple-heatmap`**
  - A weekday × hour grid.
  - Clicking a cell ripples the whole grid out from it with a 2D grid stagger (`outElastic` return).
- **`draw-chart`**
  - One timeline: the line draws (`svg.createDrawable`), points drop in, and the headline number counts up.
  - Animate SVG points with `translateY`, not `y`. Animating `y` sets the attribute and is a bug.
- **`swipe-review`**
  - A card queue for grading model answers. Drag right to accept, left to reject.
  - Past a 110px threshold the card flings off; a shorter drag springs back.
  - Buttons are the fallback, and the queue shows a running tally.

### Phase 4: WebGL (three.js + R3F)

- **`bar-terrain`**
  - An instanced field of bars (30×16 in the prototype) driven by a moving height function.
  - The pointer raises a bump under it, coloured with the accent.
  - The docs hero uses this component.
- **`embedding-space`**
  - A point cloud of document chunks in clusters.
  - Choosing a query lerps a marker to the query point and draws lines to the k nearest chunks.
  - A side list ranks the neighbours with scores. Drag to rotate.

### Phase 5: Depth (3D woven into everyday controls)

- **`configurator`** (three.js + anime.js)
  - A generic parametric-model component; ship a steel **gate** as the example model.
  - Controls: width and height ranges, infill segment (bars, slats or mesh), double-leaf switch and finish segment (ink, zinc or accent).
  - When infill or leaves change, the parts grow in with a stagger. Slider changes rebuild instantly.
  - Leaves swing open on their hinges in a 1.7s `inOutSine` animation.
  - A live cut list shows total length per steel section and estimated weight. Section weights per metre are approximate, so label them as estimates.
  - Drag to orbit.
- **`tilt-card`** (motion.dev)
  - Layers set at different `translateZ` depths, tilting on springs that follow the pointer, with a glare spot.
  - The example is a pricing card where a yearly-billing switch rolls the price with `roll-number`.
- **`voice-orb`** (three.js + motion.dev)
  - Push-to-talk. A wireframe icosahedron's vertices ripple with a spring-smoothed level.
  - Hold the button or hold Space; the transcript streams in and the status shows the elapsed time.
  - Take real audio level from an `AnalyserNode` when the mic is allowed; otherwise run the simulated level.
- **`coverflow`** (motion.dev)
  - Cards on a 3D shelf.
  - A flick carries momentum: cap the velocity, project it, then spring to the nearest card.
  - Tap a side card or use the arrow keys to move. Use listbox ARIA.
- **`cube-tabs`** (anime.js)
  - Four faces with one metric each.
  - The cube turns the short way, pulls back while turning, and lands with an elastic settle.
- **`fold-report`** (anime.js)
  - An accordion. When a section opens, its rows unfold like folded paper (`rotateX` from -100 to 0), staggered.
  - Closing folds them back from the last row.
- **`drum-picker`** (motion.dev)
  - A 3D cylinder wheel. Drag with momentum, mouse wheel or arrow keys, and it always lands on a row.
  - The selected model's specs roll to the new values with `roll-number`.
- **`linked-bars`** (three.js)
  - A table and an instanced 3D bar chart that share one highlight.
  - Hovering a row raises its bars in the accent and dims the rest; hovering a bar highlights the row and shows a tooltip.
- **`region-globe`** (three.js + anime.js)
  - A dotted sphere with region markers.
  - Selecting a region turns the globe the short way to frame the arc's midpoint, then draws a great-circle arc from the origin region.
  - Drag to spin.

### Phase 6: AI

- **`stream-response`**
  - Streams token by token with a block caret and inline citation markers, plus a source strip.
  - Has stop and regenerate. Ship a `useStream` hook that works with SSE and the Vercel AI SDK.
- **`agent-trace`**
  - Tool calls as ledger rows showing state, tool, argument and duration. Expanding a row shows its output.
  - A timeline bar fills as the run progresses, and live runs are supported.
- **`composer`**
  - A prompt box with attachment chips, a model select and a live context meter.
  - Cmd/Ctrl+Enter sends.
- **`thinking`:** a bar waveform with a rotating step label.
- **`context-budget`:** a segmented bar showing where the context window goes (system, tools, history, files), with a compact action.
- **`eval-matrix`:** models × tasks, with cells shaded by score.

### Phase 7: Screens

- **`command-palette`:** opens with ⌘K, groups commands, filters as you type and works fully from the keyboard.
- **`chat-screen`:** thread list, message log and reply bar, wired to `stream-response`.
- **`dashboard`:** KPI strip with sparklines, a daily area chart and an activity feed.

## Non-negotiables for every component

- **Reduced motion.** With `prefers-reduced-motion`, every component renders a correct still frame with no motion: springs jump to their target, timelines jump to the end, and WebGL renders one frame.
- **Accessibility.** Keyboard operable, correct roles and ARIA, visible focus, and live regions for streaming text. Canvases get `role="img"` and an `aria-label` describing the data.
- **WebGL lifecycle.**
  - Pause the render loop when offscreen (IntersectionObserver or R3F `frameloop="demand"`).
  - Cap device pixel ratio at 2.
  - Dispose geometries and materials on unmount.
  - Re-read theme colours from CSS variables when the theme or skin changes; the prototype uses a `pal()` helper.
- **Theming.** No hard-coded colours in components. Everything comes from tokens, and all three skins work in light and dark.
- **Mobile.**
  - Works at 390px wide with no horizontal page scroll.
  - Use `touch-action` correctly on draggable surfaces so drag doesn't fight scroll.
  - Two-column components stack into one column.
- **Engine isolation.** A component imports only the engine it lists. The registry item declares exactly those dependencies.
- **Data.** Demo data is clearly invented. Don't use real people's names.

## Docs site

- **Layout:** a sticky left rail that lists every component with an `L-01`…`L-NN` index, grouped by section. A top bar holds the skin switcher (Ledger, Terminal, Folio) and the theme switcher (system, light, dark).
- **Hero:** `bar-terrain` beside the wordmark, with a short pitch and stats (component count, 3 motion engines, 3 skins) and a copyable install command.
- **Component pages:** each shows a live demo, its engine tag, a one-line description, the install command, usage code, a props table, keyboard behaviour and a reduced-motion note.
- **Field notes page:** a `ledger-table` comparing shadcn, Origin UI, Magic UI, Aceternity, React Bits, Cult UI and 21st.dev by focus, motion stack, licence, and what Ledger takes from each.
- **Distribution:** generate `public/r/*.json` with `shadcn build` and test installing a few components into a fresh Next.js app. Submitting to 21st.dev comes later; don't do it now.

## Acceptance checks

For each phase:

1. `pnpm build` and `pnpm lint` pass. TypeScript runs in strict mode with no `any` in component APIs.
2. A Playwright smoke test per component runs its main interaction and asserts the resulting state. For example: the slider lands on a step, the stamp appears, the coverflow selection changes, the cube's rotation is a multiple of 90, the globe arc draws. It also asserts no console errors.
3. Screenshots at 1440px and 390px, in light and dark.
4. An axe pass with no serious violations.
5. Installing at least one component from each phase through the shadcn CLI into a clean app works.

## How to work

- Start by reading the prototype and listing anything ambiguous.
- Propose the final file layout and a shared-hooks plan before writing components.
- Build phase by phase, and show me the docs page for each phase before moving on.
- Keep each component small and readable. Someone copying one file should understand it in a few minutes.
