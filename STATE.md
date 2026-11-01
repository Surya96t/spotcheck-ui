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
- 2026-11-01: narrowed positioning to reviewing, grading and auditing AI work plus motion on controls (AI Elements and assistant-ui already cover chat parts)
- 2026-11-01: chose AI before WebGL and Depth, with public v0.1 before Depth (AI carries the positioning; launch feedback comes before the most expensive work)
- 2026-11-01: chose a Phase 0 slice (roll-number, detent-slider, bar-terrain installed into a clean shadcn app) because install, tokens and fonts are the riskiest setup
- 2026-11-01: chose do-not-copy for Animate UI, React Bits, Aceternity and coss ui (Commons Clause, source redistribution ban, AGPL default)
- 2026-11-01: kept Ledger UI as a working title only (Ledger SAS publishes @ledgerhq/lumen-ui-react; trademark check required before buying a domain)
- 2026-11-01: chose registry/ledger/components/ledger/ over group folders so the CLI rewrites imports and components install to components/ledger, clear of shadcn's ui folder
- 2026-11-01: chose Fontsource packages over registry:font because registry:font cannot express Archivo's width axis
- 2026-11-01: chose a registry:item ledger-base over registry:base so adding a component never touches the user's project config
- 2026-11-01: renamed the accent token to --accent-ink because shadcn owns --accent and installing would repaint the user's app
- 2026-11-01: tokens stay light unless .dark or data-theme opts in, rather than following the system by default (a shadcn app with no theme provider would end up half dark)

## Notes
