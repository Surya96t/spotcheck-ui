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
- chose static Next.js App Router over React + Vite because prerendered docs pages, plain static /r JSON and matching most installers beat the lighter setup
- chose one Next app at the repo root over the brief's apps/docs monorepo because there is one deployable and no npm package to publish
- chose the shadcn CLI and static registry JSON over a custom npx ledger-ui command because shadcn already handles install and the npm name ledger-ui is taken
- chose Base UI primitives over hand-building dialog, select and popover because accessibility is the hard part
- chose headless fumadocs-core and fumadocs-mdx over fumadocs-ui because its layout would fight the ledger shell
- chose R3F 9 with React 19 over R3F 10 because v10 is an alpha and WebGPU-first
- changed light tokens --ok #14733F, --warn #8F5500, --mute #5C616A because the originals miss 4.5:1 on small text
- chose flat named exports over Tabs.List style because dot access fails across the Next server/client boundary
- chose WebGL one frame per state change under reduced motion over one frame ever because the prototype loop would freeze interactive 3D controls
- chose to re-declare tokens on every scope because Tailwind compiles light-dark() to a fallback fixed on the declaring element

## Notes
