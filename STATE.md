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
- narrowed positioning to reviewing, grading and auditing AI work plus motion on controls because AI Elements and assistant-ui already cover chat parts
- chose AI before WebGL and Depth, with public v0.1 before Depth, because AI carries the positioning and launch feedback should come before the most expensive work
- chose a Phase 0 slice (roll-number, detent-slider, bar-terrain installed into a clean shadcn app) because install, tokens and fonts are the riskiest setup
- chose do-not-copy for Animate UI, React Bits, Aceternity and coss ui because of Commons Clause terms, a source redistribution ban and an AGPL default
- kept Ledger UI as a working title only because Ledger SAS publishes a React UI library; trademark check required before buying a domain
- chose registry/ledger/components/ledger/ over group folders because the CLI rewrites imports from that path and components install clear of shadcn's ui folder
- chose Fontsource packages over registry:font because registry:font has no field for Archivo's width axis
- chose a registry:item ledger-base over registry:base so adding a component never touches the user's project config
- renamed the accent token to --accent-ink because shadcn owns --accent and installing would repaint the user's app
- chose tokens that stay light unless .dark or data-theme opts in, over following the system by default, because a shadcn app with no theme provider would end up half dark

## Notes
