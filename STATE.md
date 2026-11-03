---
project: ledger-ui
focus: ''
blockers: []
synced: '2026-11-03'
kind: frontend
tags:
- nextjs
- react
- threejs
- typescript
---

## Current focus
_none set_

## Open threads
_none_

## Next actions
- Device-test the two WebGL Depth pieces on Surya's iPhone and Mac Safari

## Recent decisions
- Launch name Spotcheck UI, replacing Inloop UI after a TMview search found no live US, UK or EU software mark in the first 30 of 80 results
- MIT copyright holder is Surya Prakash Madichetti, matching the git identity
- spotcheckui.com is the only domain and the canonical host, with www 308-redirecting to it
- Public repo goes out with full history and all files; the secrets scan was clean and the Gmail address on commits is accepted
- Device testing uses Surya's iPhone and Mac Safari with a Claude-written checklist, not a paid device cloud or WebKit in CI
- Kept the Ledger skin and ledger-table after the rename because they describe a look and table style, not the brand
- Two launch field notes: why AI review needs its own components, and one build story
- Launch sequence: soft launch, then Show HN about a week later, then r/reactjs and r/nextjs
- Vercel Web Analytics over Plausible: already on the host, no cookie banner, no subscription
- Build WebGL before CSS 3D in Depth so the riskiest work lands first and the launch can be trimmed from the cheap end

## Notes
