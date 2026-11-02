# Renaming Ledger UI to Spotcheck UI

Follow this in order and finish each stage's check before starting the next. The reasons for the
name are in [LAUNCH-PLAN.md](LAUNCH-PLAN.md).

## Rules

- **Don't copy the folder.** Rename it once, as the last stage. A copy leaves two checkouts, and the
  worktrees and links still point at the old one.
- **Don't move the folder while Claude is running in it.** The session would lose its working
  directory.
- **Don't do a blind find and replace.** "Ledger" stays in a few places on purpose (see below).
- **Nobody has installed the library yet, because the repo is private.** So no old registry names or
  install paths need to keep working. That stops being true once the repo is public, so rename first.
- **The domain is already bought.** Don't change its DNS until stage 3.

## Where the rename applies

The rename touches 196 tracked files and 658 lines, not counting docs and `reference/`.

| Change | From | To |
|---|---|---|
| Name in site text | Ledger UI | Spotcheck UI |
| Package name | `ledger-ui` | `spotcheck-ui` |
| Registry name | `ledger` | `spotcheck` |
| Base item | `ledger-base` | `spotcheck-base` |
| Source folders | `registry/ledger/`, `registry/ledger/components/ledger/` | `registry/spotcheck/`, `registry/spotcheck/components/spotcheck/` |
| Install path | `components/ledger/` | `components/spotcheck/` |
| CSS utilities | `ledger-label`, `ledger-focus`, `ledger-display`, `ledger-heading` | `spotcheck-...` |
| Keyframes | `ledger-blink`, `ledger-wave`, `ledger-marquee`, `ledger-grow`, `ledger-entry` | `spotcheck-...` |
| Browser storage | `ledger-theme`, `ledger-skin` | `spotcheck-theme`, `spotcheck-skin` |
| Build variable | `LEDGER_REGISTRY_URL` | `SPOTCHECK_REGISTRY_URL` |
| Landing copy | "Start your ledger.", "Running ledger" | "Start checking.", "Running tally" |
| 404 heading | "Not in the ledger" | "Not on file" |
| Scramble Text sample | "Ship the ledger" | "Check the work" |

Returning visitors lose a saved skin or theme once. That's harmless.

**These stay the same:**

- The Ledger skin and `data-skin="ledger"`, because that's the name of a look.
- `ledger-table`, `LedgerTable` and `LedgerColumn`, because that's a table style.
- The headline "Keep the books on your AI."
- The plain word in Entry List's description, "like entries posted to a ledger".
- The Praxis project id `ledger-ui`, unless Surya decides otherwise.
- Past history: git commits, `reference/`, and the dated results in `docs/PLAN.md`.

## Stage 1: Rename the code

Owner: Claude. Surya approves the commit and the merge.

1. Start from an up-to-date `main` with no open PRs and no other sessions running.
2. Make the rename on a `chore/rename-spotcheck` branch, using the table above.
3. Update `docs/PLAN.md`, `docs/LAUNCH-PLAN.md` and the Why Spotcheck UI document.
4. Run the leftover check, which should list only the items that stay:

   ```bash
   git grep -n -I -i ledger -- . ':!pnpm-lock.yaml' ':!reference/*' ':!docs/*' ':!STATE.md' ':!TASKS.md'
   ```

5. Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:e2e` and `pnpm test:install`.
6. Check the landing page by eye in all three skins. The headlines are sized to the words, so a
   wording change means measuring them again in `app/globals.css`.

**Check before moving on:** the PR is merged, CI is green, and the live site says Spotcheck UI.

## Stage 2: Rename the accounts

Owner: Surya. Claude checks the result.

1. Rename the GitHub repo to `spotcheck-ui`.
2. Rename the Vercel project to `spotcheck-ui`.
3. Claude updates the local remote:

   ```bash
   git remote set-url origin https://github.com/Surya96t/spotcheck-ui.git
   ```

**Check before moving on:** `git fetch` works, a new push still deploys on Vercel, and
`ledger-ui-pied.vercel.app` still loads. If a project rename changed that address, stop and tell
Claude before touching DNS.

## Stage 3: Connect the domain

Owner: both. Claude shows every DNS change before making it.

1. Add `spotcheckui.com` and `www.spotcheckui.com` to the Vercel project.
2. Add `SPOTCHECK_REGISTRY_URL=https://spotcheckui.com` to Vercel's Production environment.
3. List the current Hostinger DNS records, so there's a copy to go back to.
4. Set only the `@` and `www` records, using the values Vercel gives for this project. Leave the
   Hostinger nameservers as they are, and leave any email records alone.
5. Run `vercel domains verify spotcheckui.com --project spotcheck-ui`, and repeat it until it passes.
6. Redeploy production, because the URL in install commands is set at build time.
7. Redirect `ledger-ui-pied.vercel.app` to the new domain.

**Check before moving on:**

```bash
SPOTCHECK_REGISTRY_URL=https://spotcheckui.com pnpm test:install
```

All install checks pass, the site loads over HTTPS, and install commands on the site show the new
domain.

## Stage 4: Rename the local folder

Owner: Surya runs these, because no Claude session can be open. Do this last.

Before quitting, ask Claude to remove the leftover launch worktree and confirm that nothing is
uncommitted. Then quit every Claude session, editor and dev server using the folder.

1. Rename the folder and Claude's project memory folder:

   ```bash
   mv ~/Documents/ledger-ui ~/Documents/spotcheck-ui
   ```

   ```bash
   mv ~/.claude/projects/-Users-surya96t-Documents-ledger-ui ~/.claude/projects/-Users-surya96t-Documents-spotcheck-ui
   ```

2. In `~/.praxis/registry.yaml`, set this project's `path` to `~/Documents/spotcheck-ui` and its
   `name` to `Spotcheck UI`. Leave the `id` alone.
3. Clear the old build output and reinstall:

   ```bash
   cd ~/Documents/spotcheck-ui && rm -rf .next && pnpm install
   ```

4. Start a new Claude session in `~/Documents/spotcheck-ui`.

Older sessions were tied to the old path, so they may not reopen from there. Their history stays in
the moved folder.

**Check before finishing:** ask the new session to confirm the Praxis brief appears, `git status` is
clean, `git fetch` works, the site runs and tests pass.

## Stage 5: Tidy up

- Delete merged local and remote branches. Claude can't delete branches here, so it will give Surya
  the commands.
- Check the shadcn directory entry and field notes use the new name before they go out.
