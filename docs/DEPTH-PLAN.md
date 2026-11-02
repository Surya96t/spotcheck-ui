# Spotcheck UI: Depth plan

Written 2026-11-02. This is the plan for Phase 6, and it answers open question 1 in
[LAUNCH-PLAN.md](LAUNCH-PLAN.md).

The groundwork and all seven pieces merged on 2026-11-02 in PRs #8 and #9. One item is still open:
confirming the `drum-picker` gutter on Surya's iPhone.

Where this note and [PLAN.md](PLAN.md) disagree about Depth, this note wins.

## Scope

Surya chose seven pieces for launch on 2026-11-02, plus the shared groundwork they need.

| Status | Pieces |
|---|---|
| Built already | `bar-terrain` |
| Ships before launch | `linked-bars`, `embedding-space`, `drum-picker`, `coverflow`, `fold-report`, `cube-tabs`, `tilt-card` |
| Held for Phase 8 | `region-globe`, `voice-orb`, `configurator` |

The three held pieces are the largest and the furthest from reviewing AI work, which is what the
launch leads with. The catalog grows from 54 components to 61.

## Build order

Effort is an estimate, not a measurement. Small (S) is one typical Phase 3 component, worth 1 unit.
Medium (M) is about 2 units. This scope is about 12 units, close to Phase 3's 10 components.

| # | Piece | Engine | Effort | Needs first |
|---|---|---|---|---|
| 1 | WebGL groundwork | three.js + R3F | M | Nothing |
| 2 | `linked-bars` | three.js + R3F | M | 1 |
| 3 | `embedding-space` | three.js + R3F | M | 1 |
| 4 | `drum-picker` | motion | M | Nothing |
| 5 | `coverflow` | motion | S | 4 |
| 6 | `fold-report` | anime.js | S | Nothing |
| 7 | `cube-tabs` | anime.js | S | Nothing |
| 8 | `tilt-card` | motion | S | Nothing |

WebGL comes first because it holds the riskiest work and the piece that fits the positioning best.
If the launch gets squeezed, cut from the bottom of the list. Those pieces cost the least to lose.

Use two PRs: steps 1 to 3, then steps 4 to 8. That way the WebGL half can merge on its own, and the
second half can be trimmed without touching it.

## What done means

### Every piece

- One file with flat named exports, an entry in `registry.json` listing only its own engine, and
  a demo in `components/site/demos.tsx`.
- A page in `content/components/` with usage, generated props, keyboard and reduced-motion notes.
- A unit test, and a Playwright test that runs the main interaction and finds no console errors.
- Added to `COMPONENTS` in `scripts/install-test.mjs`, so it installs into a clean shadcn app.
- Works at 390px with no sideways page scroll, and at 1440px.
- Looks right in all three skins and both themes, checked by eye in the screenshots.
- Passes axe. Works from the keyboard. Demo data is clearly invented.
- Under reduced motion there's no animation, and a WebGL piece renders one frame per state change.

### 1. WebGL groundwork

**What it is:** shared parts for every WebGL piece. It's needed because `bar-terrain` only pauses
when off screen, while the plan says WebGL demos should load only when visible, and `/components`
shows every demo on one page.

**Done when:**

- A shared `gl-stage` wrapper creates the canvas near the viewport and removes it when it's far
  away. It's a registry item with no catalog page.
- If WebGL fails or the browser drops the canvas, the wrapper shows the piece's description instead
  of an empty box.
- A `use-orbit-drag` hook rotates on horizontal drag and leaves vertical page scroll working
  (`touch-action: pan-y`).
- `bar-terrain` runs on `gl-stage`, its existing tests still pass, and the landing page hero looks
  the same.
- With all WebGL demos on `/components`, scrolling the full page gives no console errors.

### 2. `linked-bars`

**What it is:** a table and a 3D bar chart that share one highlight.

**Done when:**

- Hovering or focusing a row raises its bars in the accent and dims the rest.
- Hovering a bar highlights its row and shows a tooltip.
- On touch, tapping a row or a bar sets the highlight, because the prototype only handles hover.
- The table is real table markup, and every value is readable there without the chart.
- Two columns stack into one at 390px.

### 3. `embedding-space`

**What it is:** a cloud of document chunks. Choosing a question moves a marker there and draws
lines to the closest chunks, and a side list ranks them with scores.

**Decided:** the component doesn't compute embeddings or scores. Your app passes the 3D positions,
the neighbours and their scores. The prototype's positions and scores are made up for the demo, and
the docs must say so.

**Decided:** rotating is a pointer extra with no keyboard control, because the queries and ranked
list are real buttons and text, and they carry all the data.

**Done when:**

- Choosing a query updates the marker, the lines and the ranked list together.
- The list is an ordered list that screen readers can read, and the query change is announced.
- Drag rotates without blocking page scroll on phones.
- It holds still under reduced motion: no auto-spin, and the lines appear in one frame.
- Colours come from tokens and follow skin and theme changes.

### 4. `drum-picker`

**What it is:** a spinning wheel for picking one option, which always lands on a row. The demo
picks a model, and its specs roll with `roll-number`.

**Decided:** the flick logic becomes a `use-flick` hook, because `coverflow` needs it too.

**Decided:** the drum is the one exception to the `pan-y` rule. It drags up and down, so it can't
share vertical scroll with the page. `touch-action: none` goes on the wheel only, and the wheel
leaves a gutter at 390px so the page can still be scrolled beside it.

**Done when:**

- Drag, flick, mouse wheel, arrow keys, Home and End all land on a row.
- The mouse wheel scrolls the page again at the first and last rows, which fixes the prototype bug.
- It uses listbox ARIA, and the value is controlled through `value` and `onValueChange`.
- The gutter is confirmed on Surya's iPhone.

### 5. `coverflow`

**What it is:** cards on a 3D shelf that you flick through.

**Done when:**

- A flick carries momentum and lands on the nearest card.
- Tapping a side card, arrow keys, and the previous and next buttons all change the selection.
- It uses listbox ARIA, and vertical page scroll still works over it on phones.
- The test asserts that the selection changes.

### 6. `fold-report`

**What it is:** an accordion whose rows unfold like folded paper.

**Done when:**

- Opening a section unfolds its rows in a stagger, and closing folds them back from the last row.
- Headers are real buttons with `aria-expanded`.
- Content of any height opens fully, with no fixed height left behind.
- Under reduced motion, sections open at once with no fold.

### 7. `cube-tabs`

**What it is:** four tabs on the faces of a cube that turns the short way and settles.

**Decided:** it has exactly four faces, and each face holds your own content.

**Done when:**

- Arrow keys move between tabs and `aria-controls` is set, which the prototype lacks.
- Faces turned away can't be reached by keyboard or screen reader.
- The test asserts that the cube's rotation is a multiple of 90 degrees.
- Going from the first tab to the last turns one face back, not three forward.

### 8. `tilt-card`

**What it is:** a card that tilts toward the pointer, with layers at different depths and a glare
spot. The demo is a pricing card with a yearly switch that rolls the price.

**Done when:**

- A new highlight token replaces the prototype's `#fff` glare, in every skin and both themes.
- Layers are set through a flat `TiltLayer` part with a depth prop.
- On touch and under reduced motion the card stays flat and the content still works.

## Held for Phase 8

| Piece | Effort | What it needs first |
|---|---|---|
| `region-globe` | L | A decision on continents. The prototype's dots are evenly spread, so showing land means adding map data |
| `voice-orb` | L | Real mic level through `AnalyserNode`, permission handling and iPhone testing. The words would come from the user's app |
| `configurator` | L | A general API, which the prototype doesn't show, and a finish token to replace `#9aa3ac` |

Large (L) is three or four units. These three would use `animejs` or `motion` alongside three.js,
which none of the seven do.

## Effect on the launch

- **Target date:** Friday 6 November 2026, set by Surya on 2026-11-02. That's the repo going public
  and the soft launch, with Show HN about a week later. Depth has to merge by Wednesday 4 November
  to leave Thursday for device testing.
- **Device checklist:** add both WebGL pieces, the drum's gutter, the coverflow flick and the CSS 3D
  pieces in Safari. Real phones and Safari haven't been checked for anything yet.
- **Catalog blurb:** the WebGL line in `lib/catalog.ts` stays true, because `embedding-space` ships.
