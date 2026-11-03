# Spotcheck UI

Open source React components with hard edges, real motion and 3D, built for reviewing AI work. See
every component live at [spotcheckui.com](https://spotcheckui.com).
Short demos go up on [Instagram](https://www.instagram.com/spotcheckui/) and
[YouTube](https://www.youtube.com/@spotcheckui).

There's no npm package. Each component installs through the shadcn CLI, which copies its source into
your project, so the code is yours to read and change.

```bash
npx shadcn@latest add https://spotcheckui.com/r/roll-number.json
```

You need React 19, Tailwind CSS v4 and a project set up with `npx shadcn@latest init`. The first
install adds the Spotcheck tokens and fonts, and leaves your existing theme alone. The
[installation guide](https://spotcheckui.com/docs/installation) has the details, and
[theming](https://spotcheckui.com/docs/theming) covers dark mode and the three skins.

## What's in it

61 components in eight groups:

| Group | Count | What they're for |
|---|---|---|
| AI | 10 | Reviewing, grading and auditing model output |
| Screens | 3 | Larger blocks assembled from the other parts |
| WebGL | 2 | Instanced bar fields and an embedding space |
| Depth | 6 | 3D built into everyday components |
| Springs | 3 | Physics on sliders, stamps and other controls |
| Timelines | 4 | Split-flap boards, grid ripples and lines that draw themselves |
| Motion | 5 | Numbers that roll, headings that decode, lists that file in |
| Core | 28 | Primitives cut from a ruled grid |

## Working on the site

```bash
pnpm install
pnpm dev
```

The site runs at `http://localhost:3000`. Components live in `registry/spotcheck/`, and their docs
pages in `content/components/`. These checks run in CI:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm test:install
```

`test:install` builds a fresh Next.js app, installs 25 of the components through the shadcn CLI,
and checks that they build and run.

## Licence

[MIT](LICENSE). Fonts and other open source parts are listed in [CREDITS.md](CREDITS.md).
