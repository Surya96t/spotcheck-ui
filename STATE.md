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
- 2026-11-01: chose static Next.js App Router over React + Vite because prerendered docs, plain static /r JSON and matching most installers beat the lighter setup
- 2026-11-01: chose one Next app at the repo root over the brief's apps/docs monorepo because there is one deployable and no npm package to publish
- 2026-11-01: chose the shadcn CLI and static registry JSON over a custom npx ledger-ui command because shadcn handles install and the npm name ledger-ui is taken
- 2026-11-01: chose Base UI primitives over hand-built dialog, select and popover because accessibility is the hard part and the brief named no headless layer
- 2026-11-01: chose headless fumadocs-core and fumadocs-mdx over fumadocs-ui because its layout would fight the ledger shell
- 2026-11-01: chose R3F 9 with React 19 over R3F 10 because v10 is alpha and WebGPU-first
- 2026-11-01: changed light tokens --ok #14733F, --warn #8F5500, --mute #5C616A because the originals miss 4.5:1 on small text and would fail the axe check
- 2026-11-01: chose flat named exports over Tabs.List style because dot access fails across the Next server/client boundary
- 2026-11-01: chose WebGL one frame per state change under reduced motion over one frame ever because the prototype loop would freeze interactive 3D controls
- 2026-11-01: chose to re-declare tokens on every scope because Tailwind compiles light-dark() to a fallback fixed on the declaring element

## Notes
