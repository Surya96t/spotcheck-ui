# Security policy

## Reporting a problem

Please don't open a public issue for a security problem. Report it privately instead:
[open a private report](https://github.com/Surya96t/spotcheck-ui/security/advisories/new) from this
repository's **Security** tab. Only the maintainer can see it.

Include what you found, where (a component, the site, or the registry files under
`spotcheckui.com/r/`), and the steps to reproduce it. Spotcheck UI is maintained by one person, so
expect a first reply within a week. You'll hear what happens next, and you'll be credited in the fix
unless you'd rather not be.

## What's covered

- The latest version of every component, as served from `https://spotcheckui.com/r/`.
- The site at spotcheckui.com.

Components are copied into your project when you install them, so a fix reaches you only when you
run `npx shadcn@latest add` again for that component. Older copies aren't patched in place.
