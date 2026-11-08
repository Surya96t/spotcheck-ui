<a href="https://spotcheckui.com">
  <img src=".github/readme/hero.jpg" alt="Spotcheck UI: Pick any part. Look closely. A field of 3D bars with one bar lifted and labelled." width="100%">
</a>

# Spotcheck UI

Open source React components for checking what AI did: diffs you accept hunk by hunk, a trace
waterfall, a model race and a sign-off stamp. Hard edges, real motion and some 3D.

[![MIT licence](https://img.shields.io/badge/licence-MIT-111?style=flat-square)](LICENSE)
[![shadcn registry](https://img.shields.io/badge/shadcn-registry-111?style=flat-square)](https://spotcheckui.com/docs/installation)
[![React 19](https://img.shields.io/badge/React-19-111?style=flat-square)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-111?style=flat-square)](https://tailwindcss.com)

**[See every component live](https://spotcheckui.com/components)** ·
[Docs](https://spotcheckui.com/docs/installation) ·
[Field notes](https://spotcheckui.com/field-notes) ·
[YouTube](https://www.youtube.com/@spotcheckui) ·
[Instagram](https://www.instagram.com/spotcheckui/)

## Install

There's no npm package. Each component installs through the shadcn CLI, which copies its source into
your project, so the code is yours to read and change.

```bash
npx shadcn@latest add https://spotcheckui.com/r/diff-review.json
```

You need React 19, Tailwind CSS v4 and a project set up with `npx shadcn@latest init`. The first
install adds the Spotcheck tokens and fonts and leaves your existing theme alone. The
[installation guide](https://spotcheckui.com/docs/installation) has the details, and
[theming](https://spotcheckui.com/docs/theming) covers dark mode and the three skins.

## Built for checking AI work

### [Diff Review](https://spotcheckui.com/components/diff-review)

Accept or reject an agent's edits hunk by hunk, with undo.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/readme/diff-review-dark.png">
  <img src=".github/readme/diff-review-light.png" alt="Diff Review: three files of an agent's edits, each with Reject and Accept buttons.">
</picture>

```bash
npx shadcn@latest add https://spotcheckui.com/r/diff-review.json
```

### [Trace Waterfall](https://spotcheckui.com/components/trace-waterfall)

Nested spans on a shared timeline, so parallel work and slow steps show up at a glance.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/readme/trace-waterfall-dark.png">
  <img src=".github/readme/trace-waterfall-light.png" alt="Trace Waterfall: an agent run split into plan, retrieve, tool and answer spans on one timeline.">
</picture>

```bash
npx shadcn@latest add https://spotcheckui.com/r/trace-waterfall.json
```

### [Model Race](https://spotcheckui.com/components/model-race)

One prompt across several models, with live time and cost, and the winner marked.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/readme/model-race-dark.png">
  <img src=".github/readme/model-race-light.png" alt="Model Race: three models answer the same prompt, with time, cost and the first to finish marked.">
</picture>

```bash
npx shadcn@latest add https://spotcheckui.com/r/model-race.json
```

### [Stamp Approval](https://spotcheckui.com/components/stamp-approval)

Human sign-off for an agent's tool call. The decision lands as a rubber stamp.

<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/readme/stamp-approval-dark.png">
  <img src=".github/readme/stamp-approval-light.png" alt="Stamp Approval: an agent's send_email call stamped APPROVED.">
</picture>

```bash
npx shadcn@latest add https://spotcheckui.com/r/stamp-approval.json
```

## Motion and 3D

<table>
  <tr>
    <td width="50%">
      <a href="https://spotcheckui.com/components/split-flap"><b>Split-Flap Board</b></a><br>
      A departures board for jobs. Each changed cell spins through glyphs.<br><br>
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset=".github/readme/split-flap-dark.png">
        <img src=".github/readme/split-flap-light.png" alt="Split-Flap Board showing jobs, targets and states.">
      </picture>
    </td>
    <td width="50%">
      <a href="https://spotcheckui.com/components/bar-terrain"><b>Bar Terrain</b></a><br>
      An instanced WebGL field of bars, with a bump under the pointer.<br><br>
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset=".github/readme/bar-terrain-dark.png">
        <img src=".github/readme/bar-terrain-light.png" alt="Bar Terrain: a 3D field of bars rising and falling.">
      </picture>
    </td>
  </tr>
</table>

Screenshots don't show the motion. The [site](https://spotcheckui.com/components) does, and so do the
short demos on [YouTube](https://www.youtube.com/@spotcheckui).

## All 61 components

| Group | Count | What they're for |
|---|---|---|
| [AI](https://spotcheckui.com/components#ai) | 10 | Reviewing, grading and auditing model output |
| [Screens](https://spotcheckui.com/components#screens) | 3 | Larger blocks assembled from the other parts |
| [WebGL](https://spotcheckui.com/components#webgl) | 2 | Instanced bar fields and an embedding space |
| [Depth](https://spotcheckui.com/components#depth) | 6 | 3D built into everyday components |
| [Springs](https://spotcheckui.com/components#springs) | 3 | Physics on sliders, stamps and other controls |
| [Timelines](https://spotcheckui.com/components#timelines) | 4 | Split-flap boards, grid ripples and lines that draw themselves |
| [Motion](https://spotcheckui.com/components#motion) | 5 | Numbers that roll, headings that decode, lists that file in |
| [Core](https://spotcheckui.com/components#core) | 28 | Primitives cut from a ruled grid |

## Found a bug or have an idea?

[Open an issue](https://github.com/Surya96t/spotcheck-ui/issues) for bugs, especially on phones and
Safari. Questions and ideas go in [Discussions](https://github.com/Surya96t/spotcheck-ui/discussions).

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
