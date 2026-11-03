// Takes the share card from the real landing hero on the graphics card, so it matches the site.
// Run the site first (`pnpm build && pnpm start`), then: node scripts/og-image.mjs [url]
import { chromium } from "@playwright/test"

const url = process.argv[2] ?? "http://localhost:3000/"
const out = "app/opengraph-image.jpg"

const browser = await chromium.launch({ args: ["--use-angle=metal", "--enable-gpu", "--ignore-gpu-blocklist"] })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 })
await page.addInitScript(() => localStorage.setItem("spotcheck-theme", "light"))
await page.goto(url)
await page.waitForLoadState("networkidle")

if (await page.locator("[data-paused]").count()) throw new Error("The hero paused, so there's no graphics card. Run this on a machine with one.")

// The install strip would show as a cut-off edge at this height, and a share card can't be clicked anyway.
await page.addStyleTag({ content: ".landing-enter:has(> a[href='/components']) { visibility: hidden }" })

// Waits for a lifted bar whose label is fully shown, clear of the nav and to the right of the headline.
await page.waitForFunction(
  () => {
    const label = document.querySelector("[data-pick-label]")
    const nav = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0
    if (!label || label.parentElement?.style.opacity !== "1") return false
    const box = label.getBoundingClientRect()
    return box.top > nav + 40 && box.left > 640 && box.right < innerWidth - 40 && box.bottom < 380
  },
  null,
  { timeout: 60000, polling: 100 },
)

await page.screenshot({ path: out, type: "jpeg", quality: 86 })
await browser.close()
console.log(`Wrote ${out}`)
