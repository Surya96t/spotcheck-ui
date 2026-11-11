# Spotcheck UI: Redesign plan

Written 2026-11-02 and revised the same day after design review on the canvas. **This is a plan for
review. No code gets built until Surya approves it.**

Where this note and [PLAN.md](../product/PLAN.md) disagree about the landing page or site layout, this note
wins once it's approved.

## Goal

**Make Spotcheck UI look like a real product.** That's the reason Surya gave, and the landing page
design on the canvas is the reference for how it should look and move.

The redesign covers the site around the components: the landing page, the nav, and the Docs and
Components pages. Apart from one new option on `bar-terrain`, it doesn't change the components in
`registry/`, so install commands and anything already copied into an app are unaffected.

| Decision | Answer |
|---|---|
| Positioning | A general component kit. AI review is the strongest set, not the whole identity |
| Hook | "Pick any part. Look closely." |
| Story | "Run a spot check", five questions |
| Look | Keep the ruled grid, condensed type and hard-edged frames. A calm, minimal version was tried and rejected as too simple |
| Motion | Lots of it, using Motion and anime.js. Approved on the canvas |
| Theme | Dark and light, both designed on the canvas, with a phone version of every page |
| Launch timing | **Friday 6 November is fixed.** Scope gets cut to protect the date. See [Timing](#timing) |
| Pricing and Account | Not in the nav for now |

## What's there today

Measured on the live site on 2026-11-02, at 1024px wide:

- The landing page has about 1,000 words on it, counting text inside demos.
- **`/components` lists all 61 components three times:** in the left rail, in a table, then as demos.
- `/docs` returns a 404. Only `/docs/installation` and `/docs/theming` exist.
- Docs and Components share one layout (`app/(kit)/layout.tsx`) and one rail.
- The rail logo does link home, but it doesn't read as a link and there's no nav around it.

## Every listed problem and its fix

| Problem | Fix |
|---|---|
| Too bold, shouts in black and white | Headline over a moving 3D scene, with accent colour through the page |
| Too much writing | A word limit, with most text cut or moved off the page |
| Running tally on the right | Removed completely |
| No proper nav bar | One nav on every page |
| Components listed on the left, then again | No rail, and one list on `/components` |
| Can't get back to the main page | Nav logo and breadcrumbs on every page |
| Docs and Components on the same page | Separate layouts and sidebars |

## Nav bar

One `SiteNav` on every page. It's sticky, and it replaces both the rail and the current top bar.

| Item | Type | Contains |
|---|---|---|
| Spotcheck UI logo | Link | `/` |
| Products | Menu | All components, AI review, Motion, 3D and WebGL, Screens |
| Resources | Menu | Roadmap, Compare, GitHub (once the repo is public) |
| Docs | Link | `/docs` |
| Support | Link | `/support` |

- **Right side:** search, plus one menu that holds the skin and the light or dark choice.
- **Phones:** logo, search and a menu button that opens a `sheet` holding the same links.
- **Reuses:** `dropdown-menu`, `sheet`, `command-palette`. Step 1 confirms `dropdown-menu` suits nav
  links. If it doesn't, the nav gets a small site-only menu.

A new `SiteFooter` also runs on every page.

## Landing page

| # | Section | What it shows |
|---|---|---|
| 1 | Hero | Full-width `bar-terrain`, the hook, one line, install command, Browse components |
| 2 | Ticker | Eight component names on `marquee`, reacting to scroll speed |
| 3 | Run a spot check | Five chapters, each with live components |
| 4 | Parts with weight | Six live components in a ruled grid, then "Browse all 61" |
| 5 | Three skins, one markup | Three side-by-side skin panels |
| 6 | What's next | The roadmap as three ruled columns |
| 7 | Start checking | Accent band with the install command |
| 8 | Footer | Links, then the giant wordmark |

**Removed from today's page:** the stats row, the "File open" slip and the running tally. "How it
reconciles" moves to `/compare`.

### Hero

Every few seconds one bar lifts out of the field and shows a real component name and its engine.
Moving the pointer picks a bar directly. So the hero acts out the hook: the field is the library, and
you pick one part to look at.

The real `bar-terrain` needs a new option for this, because its camera is fixed and it has no fade
into the background. The bar-to-component label is new site code on top of it.

### Run a spot check

Each chapter gets stamped "Checked" as you reach it. The stamp sits inside the chapter, with no side
panel, so the running tally doesn't come back.

| # | Question | Components |
|---|---|---|
| 1 | Does it feel right? | `detent-slider`, `hold-button`, `magnetic-button` |
| 2 | Does it move right? | `split-flap`, `draw-chart`, `ripple-heatmap` |
| 3 | Does it have depth? | `tilt-card`, `drum-picker`, `cube-tabs` |
| 4 | Can you trust it? | `stream-response`, `trace-waterfall`, `model-race`, `diff-review` |
| 5 | Can you ship it? | `stamp-approval`, `run-receipt` |

Chapter 4 is the strongest, because AI review is what other kits lack. On the real page the receipt
in chapter 5 lists the parts the visitor actually tried, with their install commands.

### Motion

The real page mounts the real components, which already bring their own engine. Page-level motion is
new site code:

| Effect | Engine |
|---|---|
| Hero headline and intro | CSS, so it plays before any script loads |
| Headings, grid cells and roadmap rows arriving | anime.js |
| Chapter stamps | Motion |
| Progress line and scroll-reactive ticker | Motion `scroll` |

Under reduced motion there's no animation and every piece shows its finished state. WebGL renders one
frame per state change, as [PLAN.md](../product/PLAN.md#rules-for-every-component) requires.

**Cost to check:** the landing page loads three.js, Motion and anime.js. Each should load only when
it's needed, and step 6 measures the result on a real phone.

## Components page

**`/components`** keeps its URL and has one list only.

- A 3D band sits behind the title, using `bar-terrain`.
- The rail and the table both go. A grid of small cards replaces them, and each card links to the
  component's own page, where the live demo runs.
- A sticky row of group links sits under the title, and Products menu entries jump to the same groups.
- Groups run best first: AI, Screens, WebGL, Depth, Springs, Timelines, Motion, Core.

**`/components/[slug]`** keeps its content, and gains a sidebar listing only the current group, plus
a breadcrumb. Phones get no sidebar.

## Docs page

Docs gets its own layout and its own sidebar, which holds guides only.

- **`/docs`** becomes a real page, a short introduction that links to the guides.
- `/docs/installation` and `/docs/theming` keep their URLs and content.
- The `(kit)` route group splits into two groups, each with its own layout. Route groups don't appear
  in URLs, so every existing link keeps working.

## New pages

| Page | What it is |
|---|---|
| `/roadmap` | The full Now, Next and Later list. It reads the same `lib/roadmap.ts` as the landing block, with no dates |
| `/compare` | "How it reconciles", moved from the landing page |
| `/support` | Report a bug, ask a question, read the docs |

The repo is still private, so GitHub links would 404 for visitors until launch. One constant in
`lib/site.ts` keeps them hidden until the repo goes public.

## Build order

Effort uses the [Depth plan's sizes](DEPTH-PLAN.md#build-order), and it's an estimate, not a
measurement. Small (S) is 1 unit, Medium (M) is about 2, and Large (L) is three or four.

| # | Step | Effort | Needs first |
|---|---|---|---|
| 1 | Split the layouts, add `SiteNav` and `SiteFooter`, remove the rail | M | Nothing |
| 2 | Components page, component sidebar, Docs layout, `/docs` | M | 1 |
| 3 | Site tokens, plus the `bar-terrain` camera and fade option | S | 1 |
| 4 | Landing page: hero, spot check, parts, skins, close | L | 3 |
| 5 | Page-level motion | M | 4 |
| 6 | Roadmap block, `/roadmap`, `/compare`, `/support` | S | 1 |
| 7 | Tests, phones, all skins, loading cost, and the plan docs | M | All |

That's about 14 units, a little more than Depth's 12.

Use two PRs, following the git policy, so the structure can merge on its own:

1. `feat/site-structure`: steps 1, 2 and 6, because the new nav links to the step 6 pages.
2. `feat/landing-redesign`: steps 3, 4, 5 and 7.

`spotcheckui.com` is live and deploys from `main`, so **Surya reviews each PR on its Vercel preview**
before it merges. Surya approves each commit and merge.

### Timing

Friday 6 November is fixed, so the work has to fit around it.

| Day | What happens |
|---|---|
| Tuesday | Approve this plan, then the first PR |
| Wednesday | Steps 3 to 5, then the second PR |
| Thursday | Step 7 and device testing on Surya's iPhone and Mac Safari |
| Friday | Launch |

If the work runs late, cut in this order:

1. `/compare`. The content already exists, so it can follow after launch.
2. The letter-by-letter rises and the scroll-reactive ticker.
3. "Parts with weight" down to three components.

The nav, the separate Components and Docs pages, the hero and "Run a spot check" don't get cut.

## Success checks

| Check | How it's confirmed |
|---|---|
| **Surya approves it by eye** | Reviewed on the preview in all three skins |
| **Install in one click** | Playwright: the Copy button is on screen with no scrolling at 1440×900 and 390×844 |
| **Word limit on landing** | Playwright: at most **150 words** of our own copy, counted from elements marked `data-copy`. Text inside live demos doesn't count |
| **Tests and phones pass** | `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e` and `pnpm test:install` pass. axe finds nothing. No sideways scroll at 390px or 1440px |
| Nav | Same nav on every page, with no Pricing or Account |
| Getting home | Every page reaches `/` in one click, from the keyboard too |
| One list | `/components` shows each component once, and no rail exists |
| Separate pages | Docs and Components have different layouts, and neither lists the other |
| Tally gone | No "Running tally" anywhere on the site |

## Tests that have to change

- `tests/e2e/landing.spec.ts`: the headline tests, tally and "Books closed" checks change with the
  page. The install, streaming, sign-off and skin tests stay in some form.
- `tests/e2e/site.spec.ts`: both rail tests are replaced by nav and breadcrumb tests.
- `tests/e2e/webgl.spec.ts` and `tests/e2e/motion-kit.spec.ts` both load `/components`. They should
  keep working because the live grid stays.
- `tests/unit/catalog.test.ts` may need updating for the new group order.

## Changes to written rules

| Written rule | What changes |
|---|---|
| Landing direction: "one live case file" with a running ledger in the margin | Replaced by "Run a spot check", with no margin ledger |
| "Keep the books on your AI" stays as the headline | Replaced by "Pick any part. Look closely." |
| Positioning around reviewing AI work | Done in [PLAN.md](../product/PLAN.md#whats-were-publishing) and the Why Spotcheck UI doc |
| Site description in `app/layout.tsx` says "checking AI work" | Changes in step 4 |

The design language and the rules for every component don't change.

## Decisions for Surya

The plan picks a default for each of these, so saying nothing means the default stands.

1. **Roadmap wording:** goes public as drafted on the canvas, with no dates.
2. **Support:** GitHub Issues and Discussions, with no email address.
3. **Compare page:** keep "How it reconciles" at `/compare`, rather than cutting it.
