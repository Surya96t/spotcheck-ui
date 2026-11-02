import { expect, test, type Page } from "@playwright/test"

async function open(page: Page, slug: string) {
  await page.goto(`/components/${slug}`)
  await page.waitForLoadState("networkidle")
  return page.getByTestId("demo")
}

test.describe("scramble text", () => {
  test("decodes to the real text without moving the layout", async ({ page }) => {
    const demo = await open(page, "scramble-text")
    const text = demo.locator("span.spotcheck-display")
    await expect(text.locator("span").last()).toHaveText("Check the work")
    const settled = await text.boundingBox()
    await demo.getByRole("button", { name: "Replay" }).click()
    for (let sample = 0; sample < 6; sample++) {
      await page.waitForTimeout(40)
      const during = await text.boundingBox()
      expect(during?.width).toBeCloseTo(settled?.width ?? 0, 0)
      expect(during?.height).toBeCloseTo(settled?.height ?? 0, 0)
    }
    await expect(demo.locator("span.spotcheck-display > span").last()).toHaveText("Check the work")
  })
})

test.describe("marquee", () => {
  test("runs, and pauses on focus", async ({ page }) => {
    const demo = await open(page, "marquee")
    const track = demo.locator("[aria-hidden]").first()
    await expect(track).toHaveCSS("animation-play-state", "running")
    await demo.getByRole("group").focus()
    await expect(track).toHaveCSS("animation-play-state", "paused")
  })

  test("names its items once", async ({ page }) => {
    const demo = await open(page, "marquee")
    await expect(demo.getByRole("group")).toHaveAccessibleName(/Open source, React/)
  })
})

test("entry list shows every row", async ({ page }) => {
  const demo = await open(page, "entry-list")
  await expect(demo.getByRole("listitem")).toHaveCount(4)
})

test.describe("scrub input", () => {
  test("drags to change the value", async ({ page, isMobile }) => {
    test.skip(isMobile, "Uses the mouse")
    const demo = await open(page, "scrub-input")
    const control = demo.getByRole("spinbutton", { name: "Max tokens" })
    const box = await control.boundingBox()
    if (!box) throw new Error("No box")
    await page.mouse.move(box.x + 10, box.y + 10)
    await page.mouse.down()
    await page.mouse.move(box.x + 70, box.y + 10, { steps: 6 })
    await page.mouse.up()
    await expect(control).toHaveAttribute("aria-valuenow", "1700")
  })

  test("a press with no drag opens typing, and focus comes back", async ({ page, isMobile }) => {
    test.skip(isMobile, "Uses the mouse")
    const demo = await open(page, "scrub-input")
    await demo.getByRole("spinbutton", { name: "Timeout" }).click()
    const input = demo.getByRole("textbox", { name: "Timeout" })
    await expect(input).toBeFocused()
    await input.fill("75")
    await page.keyboard.press("Enter")
    const control = demo.getByRole("spinbutton", { name: "Timeout" })
    await expect(control).toHaveAttribute("aria-valuenow", "75")
    await expect(control).toBeFocused()
  })

  test("large steps and ends work from the keyboard", async ({ page }) => {
    const demo = await open(page, "scrub-input")
    const control = demo.getByRole("spinbutton", { name: "Max tokens" })
    await control.focus()
    await page.keyboard.press("PageUp")
    await expect(control).toHaveAttribute("aria-valuenow", "1700")
    await page.keyboard.press("End")
    await expect(control).toHaveAttribute("aria-valuenow", "4000")
  })
})

test.describe("magnetic button", () => {
  test("leans toward the pointer from outside its edge, then returns", async ({ page, isMobile }) => {
    test.skip(isMobile, "Hover only")
    const demo = await open(page, "magnetic-button")
    const button = demo.getByRole("button", { name: "Start a run" })
    const box = await button.boundingBox()
    if (!box) throw new Error("No box")
    await page.mouse.move(box.x + box.width + 30, box.y + box.height / 2)
    await expect.poll(async () => ((await button.boundingBox())?.x ?? box.x) - box.x).toBeGreaterThan(10)
    await page.mouse.move(0, 0)
    await expect.poll(async () => Math.abs(((await button.boundingBox())?.x ?? 0) - box.x), { timeout: 4000 }).toBeLessThan(1)
  })
})

test.describe("stamp approval", () => {
  test("approving drops a stamp and moves focus to the result", async ({ page }) => {
    const demo = await open(page, "stamp-approval")
    await expect(demo.getByText("Emails 41 refund rows to finance@example.com.")).toBeVisible()
    await demo.getByRole("button", { name: "Approve" }).click()
    await expect(demo.getByTestId("stamp")).toHaveAttribute("data-stamp", "approved")
    await expect(demo.getByRole("status")).toBeFocused()
    await expect(demo.getByRole("button", { name: "Approve" })).toBeHidden()
  })

  test("denying stamps denied", async ({ page }) => {
    const demo = await open(page, "stamp-approval")
    await demo.getByRole("button", { name: "Deny" }).click()
    await expect(demo.getByTestId("stamp")).toHaveAttribute("data-stamp", "denied")
    await expect(demo.getByRole("status")).toContainText("Denied")
  })

  test("only allowed arguments can be edited, and they lock after the decision", async ({ page }) => {
    const demo = await open(page, "stamp-approval")
    await expect(demo.getByRole("textbox")).toHaveCount(1)
    await demo.getByRole("textbox", { name: "Edit subject" }).fill("Q3 refunds, final")
    await demo.getByRole("button", { name: "Approve" }).click()
    await expect(demo.getByRole("textbox")).toHaveCount(0)
    await expect(demo.getByText("Q3 refunds, final")).toBeVisible()
  })
})

test.describe("split-flap", () => {
  test("changes only some cells and lands on the new board", async ({ page }) => {
    const demo = await open(page, "split-flap")
    await demo.getByRole("button", { name: "Next board" }).click()
    const board = demo.getByRole("region", { name: "Departures board" })
    const row = board.locator("[aria-hidden=true] > div").nth(1)
    await expect.poll(async () => (await row.innerText()).replace(/\s/g, ""), { timeout: 5000 }).toBe("INGESTINVOICESRUN")
  })

  test("pressing twice quickly still lands on the right board", async ({ page }) => {
    const demo = await open(page, "split-flap")
    const next = demo.getByRole("button", { name: "Next board" })
    await next.click()
    await page.waitForTimeout(150)
    await next.click()
    await page.waitForTimeout(2600)
    const text = await demo.getByRole("region", { name: "Departures board" }).locator("[aria-hidden=true] > div").nth(1).innerText()
    expect(text.replace(/\s/g, "")).toBe("SYNCCRM-LEADSOK")
  })

  test("headings sit on their columns", async ({ page }) => {
    const demo = await open(page, "split-flap")
    const lefts = await demo.getByRole("region", { name: "Departures board" }).evaluate((board) => {
      const left = (element: Element | null | undefined) => element?.getBoundingClientRect().left ?? 0
      const headings = board.querySelectorAll("[aria-hidden=true] > div:first-child > span")
      const cells = board.querySelectorAll("[aria-hidden=true] > div:nth-child(2) > span")
      return [left(headings[1]) - left(cells[8]), left(headings[2]) - left(cells[19])]
    })
    expect(Math.abs(lefts[0] ?? 9)).toBeLessThan(1)
    expect(Math.abs(lefts[1] ?? 9)).toBeLessThan(1)
  })
})

test.describe("ripple heatmap", () => {
  test("is one tab stop, and arrows move inside it", async ({ page }) => {
    const demo = await open(page, "ripple-heatmap")
    const grid = demo.getByRole("grid")
    await expect(grid.locator('[tabindex="0"]')).toHaveCount(1)
    await grid.locator('[tabindex="0"]').focus()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowRight")
    await expect(grid.locator('[data-cell="25"]')).toBeFocused()
  })

  test("picking ripples out from the cell", async ({ page }) => {
    const demo = await open(page, "ripple-heatmap")
    const cell = demo.getByRole("grid").locator('[data-cell="62"]')
    await cell.click()
    await expect(page.getByTestId("heat-pick")).toContainText("Wed 14:00")
    await expect(cell).toHaveAttribute("aria-selected", "true")
    await page.waitForTimeout(120)
    const far = demo.getByRole("grid").locator('[data-cell="0"]')
    const near = await cell.evaluate((element) => getComputedStyle(element).transform)
    const distant = await far.evaluate((element) => getComputedStyle(element).transform)
    expect(near).not.toBe(distant)
  })
})

test.describe("draw chart", () => {
  test("ends on the final number and keeps point positions", async ({ page }) => {
    const demo = await open(page, "draw-chart")
    const rect = demo.locator("svg rect").first()
    const y = await rect.getAttribute("y")
    await demo.getByRole("button", { name: "Redraw" }).click()
    await page.waitForTimeout(300)
    const during = await page.getByTestId("draw-chart-value").textContent()
    await expect(page.getByTestId("draw-chart-value")).toHaveText("83%", { timeout: 4000 })
    expect(await demo.locator("svg rect").first().getAttribute("y")).toBe(y)
    expect(during).toMatch(/%$/)
  })
})

test.describe("swipe review", () => {
  async function drag(page: Page, distance: number) {
    const card = page.getByTestId("review-card")
    await card.scrollIntoViewIfNeeded()
    const box = await card.boundingBox()
    if (!box) throw new Error("No box")
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + distance, y, { steps: 8 })
    await page.mouse.up()
  }

  test("a long drag accepts and a short one returns", async ({ page, isMobile }) => {
    test.skip(isMobile, "Uses the mouse")
    const demo = await open(page, "swipe-review")
    await drag(page, 80)
    await page.waitForTimeout(900)
    await expect(page.getByTestId("review-tally")).toHaveText("0 accepted · 0 rejected")
    await expect(demo.getByText("Can I get GST invoices for last year?")).toBeVisible()
    await drag(page, 160)
    await expect(page.getByTestId("review-tally")).toHaveText("1 accepted · 0 rejected")
    await expect(demo.getByText("Why did my card fail?")).toBeVisible()
    await drag(page, -160)
    await expect(page.getByTestId("review-tally")).toHaveText("1 accepted · 1 rejected")
  })

  test("buttons work alone and can't double-count a card", async ({ page }) => {
    const demo = await open(page, "swipe-review")
    const accept = demo.getByRole("button", { name: "Accept" })
    await accept.dblclick({ force: true })
    await expect(page.getByTestId("review-tally")).toHaveText("1 accepted · 0 rejected")
    await accept.click()
    await expect(page.getByTestId("review-tally")).toHaveText("2 accepted · 0 rejected")
    await accept.click()
    await expect(page.getByTestId("review-tally")).toHaveText("3 accepted · 0 rejected")
    await demo.getByRole("button", { name: "Reject" }).click()
    await expect(demo.getByText("Queue clear")).toBeVisible()
    await expect(accept).toBeDisabled()
  })
})

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" })

  test("scramble shows the text straight away", async ({ page }) => {
    const demo = await open(page, "scramble-text")
    await demo.getByRole("button", { name: "Replay" }).click()
    await expect(demo.locator("span.spotcheck-display > span").last()).toHaveText("Check the work", { timeout: 50 })
  })

  test("marquee stands still", async ({ page }) => {
    const demo = await open(page, "marquee")
    await expect(demo.locator("[aria-hidden]").first()).toHaveCSS("animation-name", "none")
  })

  test("entry list doesn't animate", async ({ page }) => {
    const demo = await open(page, "entry-list")
    await expect(demo.getByRole("listitem").first()).toHaveCSS("animation-name", "none")
  })

  test("magnetic button stays put", async ({ page, isMobile }) => {
    test.skip(isMobile, "Hover only")
    const demo = await open(page, "magnetic-button")
    const button = demo.getByRole("button", { name: "Start a run" })
    const box = await button.boundingBox()
    if (!box) throw new Error("No box")
    await page.mouse.move(box.x + box.width + 30, box.y + box.height / 2)
    await page.waitForTimeout(300)
    expect((await button.boundingBox())?.x).toBeCloseTo(box.x, 0)
  })

  test("stamp lands at once", async ({ page }) => {
    const demo = await open(page, "stamp-approval")
    await demo.getByRole("button", { name: "Approve" }).click()
    await expect(demo.getByTestId("stamp")).toHaveCSS("opacity", "1", { timeout: 100 })
  })

  test("split-flap changes at once", async ({ page }) => {
    const demo = await open(page, "split-flap")
    await demo.getByRole("button", { name: "Next board" }).click()
    const row = demo.getByRole("region", { name: "Departures board" }).locator("[aria-hidden=true] > div").nth(1)
    await expect.poll(async () => (await row.innerText()).replace(/\s/g, ""), { timeout: 150 }).toBe("INGESTINVOICESRUN")
  })

  test("heatmap picks without moving", async ({ page }) => {
    const demo = await open(page, "ripple-heatmap")
    const cell = demo.getByRole("grid").locator('[data-cell="62"]')
    await cell.click()
    await page.waitForTimeout(120)
    await expect(cell).toHaveCSS("transform", "none")
    await expect(page.getByTestId("heat-pick")).toContainText("Wed 14:00")
  })

  test("chart shows the finished state", async ({ page }) => {
    const demo = await open(page, "draw-chart")
    await expect(page.getByTestId("draw-chart-value")).toHaveText("83%")
    await expect(demo.locator("svg path")).not.toHaveAttribute("stroke-dasharray", /.+/)
  })

  test("cards leave at once", async ({ page }) => {
    const demo = await open(page, "swipe-review")
    await demo.getByRole("button", { name: "Reject" }).click()
    await expect(page.getByTestId("review-tally")).toHaveText("0 accepted · 1 rejected", { timeout: 100 })
    await expect(demo.getByText("Why did my card fail?")).toBeVisible()
  })
})

test("components index links to every part", async ({ page }) => {
  await page.goto("/components")
  await page.waitForLoadState("networkidle")
  await expect(page.getByRole("heading", { level: 1, name: "61 parts. Pick one." })).toBeVisible()
  await page.getByRole("link", { name: "Detent Slider" }).click()
  await expect(page).toHaveURL(/detent-slider/)
})
