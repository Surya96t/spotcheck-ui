# Spotcheck UI: public launch plan

Written 2026-11-02. This is the plan for the public launch, which is Phase 7 in the current order:
5 Landing page, 6 Depth, 7 Public launch, 8 Ongoing.

On 2026-11-03 the name, domain, rename, Depth and redesign are done and live at `spotcheckui.com`.
The repo is still private, and nothing is posted.
Where this note and [PLAN.md](PLAN.md) disagree about the launch, this note wins.

## Decisions

Made with Surya on 2026-11-02 and logged in Praxis under `ledger-ui`.

| Topic | Decision | Why |
|---|---|---|
| Name | **Spotcheck UI**, replacing Ledger UI | A spot check is a quick hand check of a sample of work, and AI teams already use the phrase. Avoids the Ledger SAS overlap |
| Domain | `spotcheckui.com` only | Easiest to say, and reads cleanly in install commands |
| Licence | MIT, copyright Surya Prakash Madichetti | A named person is clearest for a solo project |
| Public repo | Full history and all files | The scan found no secrets, and the build record has value. Surya accepted that their Gmail address shows on commits |
| Old word | The Ledger skin and `ledger-table` stay | They describe a look and a table style, not the brand |
| Field notes | Two at launch | Enough to link to without delaying launch |
| Announcing | Soft launch, Show HN about a week later, then Reddit | A small audience catches bugs before the big moment |
| Analytics | Vercel Web Analytics | Already on the host, with no cookie banner or subscription |
| Device testing | Surya's iPhone and Mac Safari, with Claude's checklist | Free, and the only true test of touch |

## The name

Not legal advice. This is what public records show, and an attorney may read them differently.

**Why Ledger had to go**

- Ledger SAS holds LEDGER for software in the EU and UK: IR 1416481 in class 9, and figurative EU
  marks 017494618 and 018500221, which include class 42 ([WIPO D2025-0472][wipo-2025]).
- That panel rejected the "ledger is a dictionary word" argument, though the respondent there was
  crypto-related, so it doesn't settle a UI kit.
- Ledger SAS has transferred domains through WIPO ([DPH2024-0004][wipo-ph]) and opposed a UK filing
  (O/0361/24). I couldn't read that UK decision.
- It ships its own React UI library, [Lumen][lumen], which had 109 npm versions and a push on
  2026-11-01.
- The US mark is weaker: [5910665][uspto] is on the Supplemental Register, for crypto key hardware.

**Why Spotcheck**

Every name below was searched on [TMview][tmview] on 2026-11-02. It's a search tool rather than an
official register, and these searches covered exact and containing matches, not other spellings.

| Name | Live marks for software | Result |
|---|---|---|
| Spotcheck | China (class 9) and a 2021 Australian application. None in the US, UK or EU in the first 30 of 80 results | **Chosen** |
| Handrail | A broad pending US application from Vitality Collaborative | Backup |
| Inloop | UK word mark for software in general (UK00004347411), plus marks in other countries | Dropped |
| Stet | STET holds EU, UK and French marks in software classes | Dropped |
| Heed | Heed Software Ltd (UK), Heed Global (EU) and others | Dropped |
| Lookover | US application filed 2026-10-11 for software | Dropped |
| Pairwise | US and China marks in class 42 | Dropped |

Also dropped after web searches: Verdict, Argmax, Softmax, Logit and Signoff are used in or near AI
or review software. Docket has AI legal rivals, Redline leads to malware, and Margin and Tally are
crowded. Tickmark is already audit software.

**Known risks with Spotcheck**

- [GoSpotCheck][gospotcheck] is retail field software. It's a different market, but the name is close.
- Results 31 to 80 weren't read. Most look like variants, but that isn't confirmed.
- The phrase is fairly descriptive, which makes it harder to own and easier to share.

## What the rename changes

The steps, in order and with checks, are in [RENAME.md](RENAME.md).

| Area | Change |
|---|---|
| Site | Name, metadata and description in `app/layout.tsx`, the rail, top bar, footer, 404 and landing page |
| Landing copy | "Start your ledger." became "Start checking.", and "Running ledger" became "Running tally". The redesign replaces "Keep the books on your AI." with "Pick any part. Look closely." |
| Registry | `name: ledger` to `spotcheck`, `ledger-base` to `spotcheck-base`, and titles and descriptions |
| Install path | `registry/ledger/` and `registry/ledger/components/ledger/`, so components install to `components/spotcheck/` |
| Imports | Every `@/registry/ledger/...` path |
| CSS | `ledger-label`, `ledger-focus`, `ledger-display`, `ledger-heading`, and keyframes `ledger-blink`, `ledger-wave`, `ledger-marquee`, `ledger-grow`, `ledger-entry` |
| Browser storage | `ledger-theme` and `ledger-skin`. Returning visitors lose a saved preference once, which is harmless |
| Build | `LEDGER_REGISTRY_URL` to `SPOTCHECK_REGISTRY_URL` in `lib/site.ts`, `scripts/build-registry.mjs` and `scripts/install-test.mjs` |
| Package | `package.json` name |
| Tests | `tests/e2e`, `tests/unit` and `scripts/install-test.mjs` |
| Accounts | GitHub repo, Vercel project, repo description and homepage |

**Stays the same:** the Ledger skin and `data-skin="ledger"`, `ledger-table`, `LedgerTable` and
`LedgerColumn`, and the Praxis project id `ledger-ui` unless Surya wants it changed.

### The local folder

There's no need to copy anything. Copying would leave two checkouts, and the git worktrees wouldn't
move with it. The code inside the repo changes in the rename PR, and the local folder name
(`Documents/ledger-ui`) is cosmetic, so it can be renamed once, last, or never.

If it's renamed, do it when no sessions are running and no worktrees are open, because these use the
path:

- Worktrees under `.claude/worktrees/`, which are in use now.
- `~/.praxis/registry.yaml`, which stores the project path.
- Claude's project memory, whose folder is named after the path.

## Domain and registry

Install commands and registry items carry the site URL. It's set at build time in
`scripts/build-registry.mjs` and `lib/site.ts`, so **a domain change only takes effect after a new
production build**.

- **Set the URL explicitly:** add `SPOTCHECK_REGISTRY_URL=https://spotcheckui.com` to Vercel's
  Production environment. `VERCEL_PROJECT_PRODUCTION_URL` would also work, but it picks
  [the shortest custom domain][vercel-env], so a later domain could change it unnoticed.
- **Preview builds:** that Vercel variable is also set on previews, so without the variable above a
  preview's install commands point at production. Keep this in mind when testing a preview.
- **Old address:** redirect `ledger-ui-pied.vercel.app` to the new domain, then confirm the shadcn CLI
  follows it.
- **Test:** run the 41 install checks against the live domain with
  `SPOTCHECK_REGISTRY_URL=https://spotcheckui.com pnpm test:install`.

## shadcn directory

The directory had 530 entries on 2026-11-02, none using a Spotcheck or Ledger name. The registry
looks ready: 69 items, no `content` in the index, and the same `/r/{name}.json` pattern as 476
other entries.

The entry goes in `apps/v4/registry/directory.json` in `shadcn-ui/ui`:

```json
{
  "name": "@spotcheck",
  "homepage": "https://spotcheckui.com",
  "url": "https://spotcheckui.com/r/{name}.json",
  "description": "...",
  "logo": "<svg ...>"
}
```

The repo must be public and the domain live first. Run `pnpm validate:registries`, then open the
PR. Review time is outside our control, so **launch doesn't wait for the merge**. PLAN.md's "listed"
exit check becomes "PR open", with the listing following when it merges.

## Going public

| Item | State on 2026-11-03 |
|---|---|
| `LICENSE` | Added: MIT, in Surya's name |
| `README.md` | Added |
| `CREDITS.md` | Added: the three OFL-1.1 fonts, the Apache-2.0 packages (`ai`, `streamdown`) and the MIT ones. No borrowed patterns were found |
| Secrets | No committed env files, and no matches for common key patterns in the history. This was a pattern scan, so run gitleaks before going public |
| Personal data | Gmail address on commits (accepted). No home paths in tracked files |
| Working files | `reference/` and `docs/` go public. Praxis's `STATE.md` and `TASKS.md` stopped being tracked on 2026-11-03, so they stay local, though their history until then is public. The prototype's `northwind.in` address is now `example.com` |
| Competitor table | The live `/compare` page makes no licence claims. Check the "Not checked" licences for AI Elements and Tool UI before adding any |

## Site gaps

Checked on the live site on 2026-11-03: `robots.txt`, `sitemap.xml`, `llms.txt` and the share card
are live. `/field-notes` still returns 404 until the notes are written. Analytics is in the code,
but records nothing until it's enabled in Vercel. `dashboard` moved to Phase 8.

## Steps

Order matters. The rename comes before Depth, so new files get the right names from the start.

### 1. Lock the name

| # | Step | Owner |
|---|---|---|
| 1 | Check that `spotcheckui.com` and the social handles you want are free (done: domain, then `@spotcheckui` on Instagram and YouTube on 2026-11-03) | Surya |
| 2 | Optional: an hour with a trademark attorney on Spotcheck | Surya |
| 3 | Buy `spotcheckui.com` (done on 2026-11-02, at Hostinger) | Surya |

### 2. Rename

| # | Step | Owner |
|---|---|---|
| 4 | Merge the landing page PR, so the rename doesn't collide with it (done) | Surya |
| 5 | Rename PR, using the table above, with all tests passing | Claude |
| 6 | Update `docs/PLAN.md` to the new name and record this plan | Claude |
| 7 | Rename the GitHub repo to `spotcheck-ui` and the Vercel project | Surya |
| 8 | Add the domain in Vercel and set `SPOTCHECK_REGISTRY_URL` | Surya |
| 9 | Redeploy, redirect the old address and run `test:install` against the domain | Claude |

### 3. Build

| # | Step | Owner |
|---|---|---|
| 10 | Phase 6, Depth, to the scope in [DEPTH-PLAN.md](DEPTH-PLAN.md) (done on 2026-11-02) | Claude |
| 11 | `dashboard` component. Moved to Phase 8 on 2026-11-03, so the time goes to device fixes | Claude |
| 12 | Field note: why AI review needs its own components | Claude drafts, Surya edits |
| 13 | Field note: one build story, such as streaming without `ai` on the client | Claude drafts, Surya edits |
| 14 | `/field-notes` route, `robots.txt`, `sitemap.xml`, `llms.txt`, OG images | Claude |
| 14a | Google Search Console: verify the domain with a DNS TXT record, then submit the sitemap | Surya signs in, Claude shows the DNS change first |
| 15 | Vercel Web Analytics | Claude builds, Surya enables it in Vercel |

### 4. Prepare the repo

| # | Step | Owner |
|---|---|---|
| 16 | `LICENSE`, `README.md`, `CREDITS.md`, and `northwind.in` replaced | Claude |
| 17 | Check the "Not checked" licences | Claude |
| 18 | Run gitleaks across the full history | Claude |

### 5. Test

| # | Step | Owner |
|---|---|---|
| 19 | Write the device checklist. Done on 2026-11-03 in [DEVICE-CHECKLIST.md](DEVICE-CHECKLIST.md) | Claude |
| 20 | Run it on an iPhone and Mac Safari | Surya |
| 21 | Fix what's found and re-check | Claude, then Surya |
| 22 | Compare Motion 14 springs with the prototype, which is still unverified | Claude |
| 23 | Final run: CI, `test:install`, axe, and a look through the screenshots | Claude |

### 6. Go public

| # | Step | Owner |
|---|---|---|
| 24 | Make the repo public | Surya |
| 25 | Check the site, install commands and repo while logged out | Claude |
| 26 | Open the shadcn directory PR | Claude, once Surya approves it |

### 7. Announce

| # | Step | Owner |
|---|---|---|
| 27 | Draft every post | Claude |
| 28 | Read the current self-promotion rules for r/reactjs, r/nextjs, r/webdev and r/web_design | Claude |
| 29 | Three vertical clips of 15 to 30 seconds from the real components, for the Shorts and the Reel. A wide cut can wait for week 2 | Claude builds, Surya approves |
| 30 | Soft launch on Friday: 2 or 3 YouTube Shorts, 1 Instagram Reel, and direct messages or emails with the link to a few developers | Surya, from Claude's drafts |
| 31 | Fix what they find, for about a week | Claude |
| 32 | Show HN, and stay available to answer comments | Surya |
| 33 | Reddit, a day or two later, with a different angle for each subreddit | Surya |
| 34 | More Shorts and Reels in week 2, planned once Friday's have run | Surya |
| 35 | List 15 to 20 creators who post about React, UI or motion design, with their public contact details | Claude |
| 36 | A personal email to each, linking one component rather than the homepage | Claude drafts, Surya sends or approves each one |
| 37 | Optional: Product Hunt | Surya |
| 38 | Close `4botz9` and read analytics to plan Phase 8 | Claude |

## What each post says

- **Direct messages and emails:** a few lines to each developer, the link, and one clip. Ask for
  bugs, not praise.
- **YouTube Shorts and the Instagram Reel:** one component per clip, no voice, a word or two on
  screen. The link goes in the description or the bio.
- **Show HN:** the title starts with "Show HN". Say what it is, why you built it, and how it works,
  with a link people can try with no signup. [The rules][show-hn] exclude plain landing pages, so
  lead with the live demos and a real install command. Don't ask friends to upvote.
- **r/reactjs:** the technical angle, which is the shadcn registry, no npm package, and the source
  in your own project. Link the build story.
- **r/nextjs:** server and client boundaries, and the AI SDK stream demo with no API key.
- **r/webdev and r/web_design:** the look and the motion, with the reel.
- **Instagram reel:** the motion with no voice, a word or two on screen, and the link in the bio.
- **Creator email:** a few lines, naming the post of theirs it relates to and one component they
  could try. No template blast, and no paid ask.
- **Product Hunt:** the visual version, with the review components first.

All posts lead with reviewing and auditing AI work, not chat parts, where Vercel's AI Elements is
the main rival. Mention honest limits, such as Safari findings. The bookkeeping look is the design
hook, so the rename doesn't change that.

## Marketing

Added on 2026-11-03. Launch week is the soft launch. The wider push is week 2, 9 to 13 November,
once the first bugs are fixed, because creators and Show HN judge on the first try.

| Channel | What | When |
|---|---|---|
| Direct | Messages or emails with the link and a clip, to a few developers | Friday 6 November |
| YouTube, @spotcheckui | 2 or 3 Shorts, then more in week 2 | Friday 6 November |
| Show HN | Live demos and a real install command, not the landing page alone | Week 2 |
| Reddit | r/reactjs, r/nextjs, r/webdev, r/web_design, each within its rules | Week 2, after Show HN |
| Instagram, @spotcheckui | 1 Reel, then more in week 2 | Friday 6 November |
| Creators | 15 to 20 personal emails | Week 2 |
| Search | Search Console, sitemap, a title and description on every component page, field notes | From Tuesday 3 November. Results take weeks to months |
| Directories | shadcn directory PR at launch, 21st.dev in Phase 8 | Friday, then Phase 8 |

**Accounts:** Instagram and YouTube are `@spotcheckui`, under the Mihira Studios Google account.
Reddit and Show HN post from Surya's personal accounts, because subreddits remove brand posts.

**Not planned: X or TikTok.** Dropped on 2026-11-03: X by Surya's choice, with no brand account and
no personal post, and TikTok because it's banned in India.

**Not planned: Google Ads.** The kit is free, so ads can't pay for themselves, searches like "react
component library" are costly, and many developers block ads. Worth another look if there's ever
a paid product.

## Open questions

1. **How much of Depth ships before launch?** Answered on 2026-11-02: seven pieces, listed in
   [DEPTH-PLAN.md](DEPTH-PLAN.md). `region-globe`, `voice-orb` and `configurator` wait for Phase 8.
2. **Target date?** Answered on 2026-11-02: Friday 6 November 2026 for the repo going public and the
   soft launch, with Show HN about a week later.
3. **Does the attorney hour happen?** Recommended, but optional. Owner: Surya.
4. **Should the Praxis id change from `ledger-ui`?** It isn't public, so this plan keeps it. Owner: Surya.
5. **Does the landing page still say enough once "ledger" comes out?** Owner: Surya and the landing
   page session.
6. **Are the social handles free?** Not checked. Owner: Surya.
7. **What version does launch carry?** PLAN.md said v0.1 before Depth moved ahead. Owner: Surya.

[wipo-2025]: https://www.wipo.int/amc/en/domains/decisions/pdf/2025/d2025-0472.pdf
[wipo-ph]: https://www.wipo.int/amc/en/domains/search/text.jsp?case=DPH2024-0004
[lumen]: https://github.com/LedgerHQ/lumen
[uspto]: https://tsdr.uspto.gov/#caseNumber=87794704&caseType=SERIAL_NO&searchType=statusSearch
[tmview]: https://www.tmdn.org/tmview/
[gospotcheck]: https://www.g2.com/products/gospotcheck/reviews
[vercel-env]: https://vercel.com/docs/environment-variables/system-environment-variables
[show-hn]: https://news.ycombinator.com/showhn.html
