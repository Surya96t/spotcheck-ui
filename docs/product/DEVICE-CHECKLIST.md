# Spotcheck UI: device checklist

Written 2026-11-03 for Thursday 5 November. This is step 20 in [LAUNCH-PLAN.md](../archive/LAUNCH-PLAN.md).
Real phones and Safari haven't been checked for anything yet, so every line here is open.

Run it on spotcheckui.com, on an iPhone in Safari and on a Mac in Safari. It takes about an hour.
Tick each box for each device, or write what went wrong next to it.

## How to report a problem

For each problem, note the page, the device, what you did, and what you saw. A screen recording
helps most for motion and touch, because a screenshot can't show a stutter or a missed swipe.

## 1. Every page

| Check | iPhone | Mac |
|---|---|---|
| Fonts load: condensed display type, IBM Plex Mono labels, nothing in Times or Helvetica | [ ] | [ ] |
| No sideways scroll on any page | [ ] | n/a |
| The phone menu opens as a sheet, its links work, and it closes | [ ] | n/a |
| Search opens, filters as you type, and opens a result | [ ] | [ ] |
| Skin switch: Ledger, Terminal and Folio each change the look, and the choice survives a reload | [ ] | [ ] |
| Dark mode follows the system setting, with no white flash on load | [ ] | [ ] |
| Copy on an install command puts the command on the clipboard | [ ] | [ ] |
| Content isn't hidden under the notch or home bar in landscape | [ ] | n/a |

## 2. Landing page

| Check | iPhone | Mac |
|---|---|---|
| The bar terrain hero animates, and doesn't sit as a still frame. If it's still, the slow-device pause has fired by mistake, which loses the hero | [ ] | [ ] |
| A bar lifts every few seconds and its label is readable | [ ] | [ ] |
| The headline and intro fade in once, and nothing jumps when they finish | [ ] | [ ] |
| Scrolling past the hero is smooth, and taps on the nav respond at once | [ ] | [ ] |
| "Run a spot check" works by touch | [ ] | [ ] |
| The phone stays cool after a minute on the page | [ ] | n/a |

## 3. Touch and drag

Open each component's page from `/components` and try its demo.

| Component | Check | iPhone | Mac |
|---|---|---|---|
| `drum-picker` | Flick it: it coasts and lands on a row. Scroll the page with a thumb in the 48px gutter on its right, without spinning the drum | [ ] | [ ] |
| `coverflow` | Flick it: it carries momentum and lands on the nearest card. A vertical swipe scrolls the page | [ ] | [ ] |
| `swipe-review` | Drag right to accept and left to reject. A vertical swipe scrolls the page | [ ] | [ ] |
| `detent-slider` | Drag it: it springs into the nearest step | [ ] | [ ] |
| `scrub-input` | Drag sideways to change the number. Tap to type | [ ] | [ ] |
| `hold-button` | Press and hold to confirm. Letting go early cancels it | [ ] | [ ] |
| `embedding-space` | Drag to rotate the cloud. A vertical swipe still scrolls the page | [ ] | [ ] |
| `linked-bars` | Tap a row or a bar to set the highlight | [ ] | [ ] |
| `ripple-heatmap` | Tap a cell: the grid ripples out from it | [ ] | [ ] |
| `sheet` | Opens, scrolls inside, and closes with a swipe or the close button | [ ] | [ ] |
| `tilt-card`, `magnetic-button` | Respond to the pointer on the Mac, and do nothing odd on touch | [ ] | [ ] |

## 4. 3D and WebGL

| Component | Check | iPhone | Mac |
|---|---|---|---|
| `bar-terrain` | Draws and animates, with the bump following the pointer on the Mac | [ ] | [ ] |
| `embedding-space` | Draws, and choosing a question moves the marker, lines and list together | [ ] | [ ] |
| `linked-bars` | Draws its bars, and the highlight matches the table | [ ] | [ ] |
| `cube-tabs` | Turns the short way, with no faces flickering or showing through | [ ] | [ ] |
| `fold-report` | Rows unfold top to bottom with no gaps or flicker between folds | [ ] | [ ] |
| `coverflow`, `tilt-card` | Cards keep their depth, with no flat or mirrored cards | [ ] | [ ] |
| `/components` | Scroll the whole page: demos load as they come into view, with no blank boxes left behind | [ ] | [ ] |

## 5. Motion

| Check | iPhone | Mac |
|---|---|---|
| `roll-number`, `split-flap` and `scramble-text` run smoothly | [ ] | [ ] |
| `stamp-approval` lands with weight, and the springs don't feel floaty or stiff | [ ] | [ ] |
| `stream-response` and `chat-screen` stream text with no jumps | [ ] | [ ] |
| `marquee` pauses on hover on the Mac | n/a | [ ] |

## 6. Reduced motion

Turn on Reduce Motion: on the iPhone in Settings, Accessibility, Motion; on the Mac in System
Settings, Accessibility, Display. Then reload.

| Check | iPhone | Mac |
|---|---|---|
| The landing hero holds still, and its text is there with no fade | [ ] | [ ] |
| Springs and timelines jump to their end state instead of animating | [ ] | [ ] |
| Everything still works, just without the motion | [ ] | [ ] |

## Afterwards

Send the notes and recordings to Claude for step 21. Each fix gets re-checked on the same device.
