---
project: ledger-ui
focus: ''
blockers: []
synced: '2026-11-02'
---

## Current focus
_none set_

## Open threads
_none_

## Next actions
_none_

## Recent decisions
- tokens stay light unless .dark or data-theme opts in, rather than following the system by default, because a shadcn app with no theme provider would end up half dark
- tokens are re-declared on every scope because Tailwind compiles light-dark() to a fallback fixed on the declaring element
- AI before WebGL and Depth; Depth moved ahead of public v0.1 so v0.1 ships the full kit (order: 5 Landing, 6 Depth, 7 Public launch, 8 Ongoing)
- single live case file for the landing page over a grid of unrelated demos, because one audited AI run shows the review positioning and proves the components work together
- launch name is Spotcheck UI, replacing Ledger UI and the earlier Inloop UI, because a TMview search found no live US/UK/EU software mark in the first 30 of 80 results; InLoop has a UK word mark covering software and Ledger SAS has an overlapping React UI library
- Surya Prakash Madichetti is the MIT copyright holder, matching the git identity
- spotcheckui.com is the only domain: short, reads cleanly in install commands, one renewal
- repo goes public with full history and all files; the scan found no secrets and the build record has value; the Gmail address on commits is accepted
- device testing on Surya's iPhone and Mac Safari with a Claude-written checklist over a paid device cloud or WebKit in CI, because it is free and the only true test of touch
- kept the Ledger skin and ledger-table after the rename because they describe a look and table style, not the brand

## Notes
