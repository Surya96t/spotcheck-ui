# Spotcheck UI: Ideas

Surya's ideas for the landing page and new WebGL components, noted one at a time. Nothing here is
planned or approved to build yet.

Each idea records four things:

- **In Surya's words:** what he said, as he said it.
- **What it would need:** the parts, data, engines or decisions it depends on.
- **Clash with the design rules:** anything that conflicts with the
  [design language](PLAN.md#design-language) or the
  [rules for every component](PLAN.md#rules-for-every-component), or "None found".
- **Rough effort:** an estimate using the sizes in [DEPTH-PLAN.md](DEPTH-PLAN.md#build-order). Small
  (S) is 1 unit, Medium (M) is about 2, and Large (L) is three or four.

## Landing page

### Redesign the landing page and the Docs and Components pages

- **In Surya's words:** "A proper hero section. A proper nav bar with these links: Products,
  Resources, Docs, Support. Proper component placement on the landing page. A story that unfolds as
  users scroll down. A visible roadmap. Docs and Components on separate pages." On the landing page:
  "When I open it, it looks too bold. It shouts a lot of information in black and white." "There is
  too much writing." "I don't like the running tally on the right side." "There is no proper nav
  bar." On the Docs and Components pages: "All components are listed on the left, and then listed
  out again." "When I am on the components page, I can't go back to the main page." "Docs and
  components show up in the same page. They must be separate pages." Guardrails: "No Pricing for
  now. No Account for now." "The landing page must reuse our existing components." "Show our best
  components first."
- **What it would need:** see [REDESIGN-PLAN.md](REDESIGN-PLAN.md).
- **Clash with the design rules:** yes, on site pages only. See
  [the clashes](REDESIGN-PLAN.md#clashes-with-the-design-rules).
- **Rough effort:** about 12 units, the same size as Depth.

### A 3D hero background from the library

- **In Surya's words:** "The hero section needs to have a 3D component background that is cool and
  from our library."
- **What it would need:** `bar-terrain` running full width behind the hero. Its camera is fixed
  today and it has no fade into the background, so it needs a new option for both.
- **Clash with the design rules:** none found. Under reduced motion it has to render one still frame.
- **Rough effort:** S.

### Don't tie the hook to AI

- **In Surya's words:** "Because we are a components page, I don't want to tie it down to AI
  components only. So the hook or something needs to be different." On the story: "One run audited,
  like, it's good, but I feel it could be better."
- **What it would need:** a new headline and a new positioning line. That means updating the Why
  Spotcheck UI doc, the positioning in [PLAN.md](PLAN.md#whats-were-publishing), the site metadata
  and [RENAME.md](RENAME.md), which says the current headline stays.
- **Clash with the design rules:** none in the design language. It does change a logged decision: to
  keep "Keep the books on your AI" as the headline.
- **Rough effort:** S for the copy. A rebuilt scroll story is about M.
- **Decided:** the hook is "Pick any part. Look closely." The story is "Run a spot check", with five
  questions. AI stays as the strongest chapter.

### More motion on the landing page

- **In Surya's words:** "I also want to add more motion in the landing page using motion or
  anime.js."
- **What it would need:** page-level animation for headings and groups, plus each component's own
  engine, which the site already installs. Both libraries would load on the landing page.
- **Clash with the design rules:** none found, but every effect needs a still state under reduced
  motion, and a page full of animation has to be checked on real phones.
- **Rough effort:** M.

## WebGL components

No ideas yet.
