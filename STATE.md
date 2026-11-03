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
- Headline is 'Pick any part. Look closely.' over 'Keep the books on your AI', because only 10 of 61 components are AI and it states what a spot check is
- Hero holds on a still frame on software graphics or under 15fps, because a full-width Bar Terrain delayed nav clicks past 5 seconds on slow machines and failed CI
- Chose Spotcheck UI as the launch name over Inloop UI and Ledger UI, because a TMview search found no live US, UK or EU software mark for it
- Surya Prakash Madichetti is the MIT copyright holder
- spotcheckui.com is the only domain, with www 308-redirecting to it as the canonical host
- ledger-ui-pied.vercel.app redirects to spotcheckui.com via a Vercel project-domain 308, not a next.config redirect
- Goes public with full history and all files, because the secret scan was clean and the build record has value
- Real device testing on Surya's iPhone and Mac Safari with a Claude-written checklist, over a paid device cloud or WebKit in CI
- Kept the Ledger skin and ledger-table after the rename, because they describe a look and table style, not the brand
- Two field notes for launch: why AI review needs its own components, and one build story

## Notes
