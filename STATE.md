---
project: ledger-ui
focus: ''
blockers: []
synced: '2026-11-01'
---

## Current focus
_none set_

## Open threads
_none_

## Next actions
_none_

## Recent decisions
- 2026-11-01: chose static Next.js App Router over React + Vite (prerendered docs, static /r JSON, installer fit)
- 2026-11-01: chose one Next app at the repo root over an apps/docs monorepo (one deployable, no npm package to publish)
- 2026-11-01: chose shadcn CLI and static registry JSON over a custom npx ledger-ui command (shadcn handles install; npm name taken)
- 2026-11-01: chose Base UI primitives for dialog, select and popover (accessibility is the hard part; brief named no headless layer)
- 2026-11-01: chose headless fumadocs-core and fumadocs-mdx over fumadocs-ui (its layout would fight the ledger shell)
- 2026-11-01: chose R3F 9 with React 19 over R3F 10 (v10 is alpha and WebGPU-first)
- 2026-11-01: changed light tokens to --ok #14733F, --warn #8F5500, --mute #5C616A (originals miss 4.5:1 on small text and would fail axe)
- 2026-11-01: chose tokens that respond to .dark, [data-theme] and system setting (shadcn CLI writes dark cssVars to .dark)
- 2026-11-01: chose flat named exports over Tabs.List-style dot access (dot access fails across the Next server/client boundary)
- 2026-11-01: chose WebGL one frame per state change under reduced motion over one frame ever (prototype loop would freeze interactive 3D controls)

## Notes
