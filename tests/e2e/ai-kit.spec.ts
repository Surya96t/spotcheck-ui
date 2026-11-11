import { expect, test, type Locator, type Page } from "@playwright/test"

async function open(page: Page, slug: string) {
  await page.goto(`/components/${slug}`)
  await page.waitForLoadState("networkidle")
  return page.getByTestId("demo")
}

test.describe("stream response, the Phase 4 exit check", () => {
  test("renders a real AI SDK stream with markdown, citations and sources", async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    const responsePromise = page.waitForResponse("**/api/demo/chat")
    const demo = await open(page, "stream-response")
    await demo.getByRole("button", { name: "Ask about the refund policy" }).click()
    const response = await responsePromise
    expect(response.headers()["x-vercel-ai-ui-message-stream"]).toBe("v1")

    await expect(page.getByTestId("stream-caret")).toBeVisible()
    await expect(page.getByTestId("stream-status")).toHaveText("done", { timeout: 10000 })
    await expect(page.getByTestId("stream-caret")).toBeHidden()
    await expect(demo.locator("strong")).toHaveText("manager approval")
    await expect(demo.getByRole("link", { name: "Source 1" })).toBeVisible()
    await expect(demo.getByRole("link", { name: "refund-policy.md §2" })).toHaveAttribute("href", "https://example.com/refund-policy")
    await expect(demo.getByText("[1]").first()).toBeVisible()
    await expect(demo.getByText("[object Object]")).toHaveCount(0)
    expect(errors).toEqual([])
  })

  test("stops partway and regenerates", async ({ page }) => {
    const demo = await open(page, "stream-response")
    await demo.getByRole("button", { name: "Ask about the refund policy" }).click()
    await demo.getByRole("button", { name: "Stop" }).click()
    await expect(page.getByTestId("stream-status")).toHaveText("stopped")
    await expect(demo.getByRole("link", { name: "refund-policy.md §2" })).toHaveCount(0)
    await demo.getByRole("button", { name: "Regenerate" }).click()
    await expect(page.getByTestId("stream-status")).toHaveText("done", { timeout: 10000 })
    await expect(demo.getByRole("link", { name: "refund-policy.md §2" })).toBeVisible()
  })

  test("screen readers get sentences, not tokens", async ({ page }) => {
    const demo = await open(page, "stream-response")
    await demo.getByRole("button", { name: "Ask about the refund policy" }).click()
    const status = demo.locator('[role="status"].sr-only')
    await expect(status).toContainText("Refunds over 30 days", { timeout: 8000 })
    await expect(status).toHaveText("Response complete.", { timeout: 10000 })
  })

  test("shows a clear message when the request fails", async ({ page }) => {
    await page.route("**/api/demo/chat", (route) => route.fulfill({ status: 500, body: "nope" }))
    const demo = await open(page, "stream-response")
    await demo.getByRole("button", { name: "Ask about the refund policy" }).click()
    await expect(demo.getByRole("alert")).toContainText("500")
    await expect(page.getByTestId("stream-status")).toHaveText("error")
  })
})

test("chat screen sends, streams and switches threads", async ({ page }) => {
  const demo = await open(page, "chat-screen")
  await expect(demo.getByRole("log")).toContainText("What changed in the refund policy")
  await demo.getByRole("textbox", { name: "Reply" }).fill("And for split orders?")
  await demo.getByRole("button", { name: "Send" }).click()
  await expect(demo.getByRole("log")).toContainText("And for split orders?")
  await expect(demo.getByTestId("stream-status")).toHaveText("done", { timeout: 10000 })
  await expect(demo.getByRole("log")).toContainText("manager approval")
  await demo.getByRole("button", { name: /Q3 ticket clustering/ }).click()
  await expect(demo.getByRole("log")).toContainText("Cluster the Q3 tickets")
  await expect(demo.getByRole("log")).not.toContainText("And for split orders?")
  await demo.getByRole("button", { name: /Refund policy summary/ }).click()
  await expect(demo.getByRole("log")).toContainText("And for split orders?")
})

test.describe("chat screen keeps each conversation intact", () => {
  async function send(demo: Locator, text: string) {
    await demo.getByRole("textbox", { name: "Reply" }).fill(text)
    await demo.getByRole("button", { name: "Send" }).click()
    await expect(demo.getByTestId("stream-status")).toHaveText("done", { timeout: 10000 })
  }

  const thread = (demo: Locator, name: RegExp) => demo.getByRole("button", { name }).click()

  test("sends the last reply with the next request", async ({ page }) => {
    const bodies: { messages: { role: string; text: string }[] }[] = []
    page.on("request", (request) => {
      if (request.url().endsWith("/api/demo/chat")) bodies.push(request.postDataJSON())
    })
    const demo = await open(page, "chat-screen")
    await send(demo, "first")
    await send(demo, "second")

    const messages = bodies[1]!.messages
    expect(messages.map((message) => message.role).slice(-3)).toEqual(["user", "assistant", "user"])
    expect(messages.at(-3)?.text).toBe("first")
    expect(messages.at(-2)?.text).toContain("Refunds over 30 days")
    expect(messages.at(-1)?.text).toBe("second")
  })

  test("a reply stays in its own thread and is saved once", async ({ page }) => {
    const demo = await open(page, "chat-screen")
    const log = demo.getByRole("log")
    await send(demo, "first")

    await thread(demo, /Q3 ticket clustering/)
    await expect(log).toContainText("Cluster the Q3 tickets")
    await expect(log).not.toContainText("Refunds over 30 days")
    await thread(demo, /Onboarding email draft/)
    await expect(log).not.toContainText("Refunds over 30 days")
    await thread(demo, /Refund policy summary/)
    await thread(demo, /Refund policy summary/)
    await thread(demo, /Q3 ticket clustering/)
    await thread(demo, /Refund policy summary/)
    await expect(log.getByText("Refunds over 30 days")).toHaveCount(1)
  })

  test("a saved reply keeps its formatting and sources", async ({ page }) => {
    const errors: string[] = []
    page.on("console", (message) => message.type() === "error" && errors.push(`${message.text()} ${message.location().url}`))
    const demo = await open(page, "chat-screen")
    const log = demo.getByRole("log")
    await send(demo, "first")
    await thread(demo, /Q3 ticket clustering/)
    await thread(demo, /Refund policy summary/)

    await expect(log.locator("strong")).toHaveText("manager approval")
    await expect(log).not.toContainText("**")
    await expect(log.getByRole("link", { name: "refund-policy.md §2" })).toBeVisible()

    await send(demo, "second")
    const targets = await log
      .getByRole("link", { name: "Source 1" })
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")!.slice(1)))
    expect(new Set(targets).size).toBe(2)
    for (const id of targets) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1)
    expect(errors).toEqual([])
  })
})

test("agent trace finishes and expands a step", async ({ page }) => {
  const demo = await open(page, "agent-trace")
  await expect(demo.getByText("Done in 2.80 s")).toBeVisible({ timeout: 6000 })
  await demo.getByRole("button", { name: /rerank/ }).click()
  await expect(demo.getByText("kept 5, dropped 9 below 0.42")).toBeVisible()
  await expect(demo.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100")
})

test("trace waterfall collapses a parent", async ({ page }) => {
  const demo = await open(page, "trace-waterfall")
  await expect(demo.getByText("search.kb")).toBeVisible()
  await demo.getByRole("button", { name: "retrieve" }).click()
  await expect(demo.getByText("search.kb")).toBeHidden()
  await expect(demo.getByRole("button", { name: "retrieve" })).toHaveAttribute("aria-expanded", "false")
})

test("waterfall bars sit on the shared timeline", async ({ page, isMobile }) => {
  test.skip(isMobile, "The chart scrolls on phones")
  const demo = await open(page, "trace-waterfall")
  const bar = (id: string) => demo.locator(`[data-span="${id}"] i`)
  await page.waitForTimeout(700)
  const kb = await bar("kb").boundingBox()
  const tickets = await bar("web").boundingBox()
  expect(Math.abs((kb?.x ?? 0) - (tickets?.x ?? 99))).toBeLessThan(6)
  expect(tickets?.width ?? 0).toBeGreaterThan(kb?.width ?? 0)
})

test("waterfall tick labels stay on one line", async ({ page }) => {
  const demo = await open(page, "trace-waterfall")
  const ticks = demo.locator("[data-tick]")
  await expect(ticks.last()).toHaveText("2.84 s")
  const heights = await ticks.evaluateAll((labels) => labels.map((label) => label.getBoundingClientRect().height))
  expect(new Set(heights).size, `tick heights ${heights.join(", ")}`).toBe(1)
})

test.describe("composer", () => {
  test("sends with the keyboard and tracks context", async ({ page }) => {
    const demo = await open(page, "composer")
    const box = demo.getByRole("textbox", { name: "Prompt" })
    const before = await demo.getByRole("progressbar", { name: "Context used" }).getAttribute("aria-valuenow")
    await demo.getByRole("button", { name: "Remove q3-tickets.csv" }).click()
    await expect(demo.getByRole("progressbar", { name: "Context used" })).not.toHaveAttribute("aria-valuenow", before ?? "")
    await box.focus()
    await page.keyboard.press("Control+Enter")
    await expect(page.getByTestId("composer-result")).toHaveText("Sent to atlas-m")
  })

  test("won't send an empty prompt", async ({ page }) => {
    const demo = await open(page, "composer")
    await demo.getByRole("textbox", { name: "Prompt" }).fill("   ")
    await expect(demo.getByRole("button", { name: /Send/ })).toBeDisabled()
  })
})

test("context budget compacts history", async ({ page }) => {
  const demo = await open(page, "context-budget")
  await expect(demo.getByText("41.2k")).toBeVisible()
  await demo.getByRole("button", { name: "Compact history" }).click()
  await expect(demo.getByText("14.4k")).toBeVisible()
  await expect(demo.getByRole("img")).toHaveAccessibleName(/History 14.4k/)
})

test("run receipt prints and lands in place", async ({ page }) => {
  const demo = await open(page, "run-receipt")
  await expect(demo.getByText("$0.0092")).toBeVisible()
  await page.waitForTimeout(1200)
  await expect(page.getByTestId("receipt-paper")).toHaveCSS("transform", /matrix\(1, 0, 0, 1, 0, 0\)|none/)
})

test.describe("diff review", () => {
  test("decides hunks one at a time and undoes", async ({ page }) => {
    const demo = await open(page, "diff-review")
    await expect(page.getByTestId("review-count")).toHaveText("0 of 3 reviewed")
    await demo.getByRole("button", { name: "Accept change to lib/refunds.ts" }).click()
    await expect(page.getByTestId("review-count")).toHaveText("1 of 3 reviewed")
    await expect(demo.getByText("requestApproval")).toBeHidden()
    await demo.getByRole("button", { name: "Undo" }).click()
    await expect(page.getByTestId("review-count")).toHaveText("0 of 3 reviewed")
    await expect(demo.getByText("requestApproval")).toBeVisible()
  })

  test("accepts everything left", async ({ page }) => {
    const demo = await open(page, "diff-review")
    await demo.getByRole("button", { name: "Reject change to lib/refunds.ts" }).click()
    await demo.getByRole("button", { name: "Accept 2 left" }).click()
    await expect(page.getByTestId("review-count")).toHaveText("3 of 3 reviewed")
    await expect(demo.getByText("rejected")).toBeVisible()
    await expect(demo.getByRole("button", { name: /left/ })).toBeDisabled()
  })
})

test("model race marks the fastest model", async ({ page }) => {
  const demo = await open(page, "model-race")
  await demo.getByRole("button", { name: "Start race" }).click()
  await expect(page.getByTestId("race-result")).toHaveText("atlas-s finished first", { timeout: 8000 })
  await expect(demo.getByRole("region", { name: "atlas-s" }).getByText("First")).toBeVisible()
  await expect(demo.getByRole("region", { name: "atlas-l" })).toHaveAttribute("data-status", "done", { timeout: 8000 })
})

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" })

  test("the caret holds still", async ({ page }) => {
    const demo = await open(page, "stream-response")
    await demo.getByRole("button", { name: "Ask about the refund policy" }).click()
    await expect(page.getByTestId("stream-caret")).toHaveCSS("animation-name", "none")
  })

  test("thinking bars stand still and the label doesn't rotate", async ({ page }) => {
    const demo = await open(page, "thinking")
    await expect(demo.locator("i").first()).toHaveCSS("animation-name", "none")
    await page.waitForTimeout(1800)
    await expect(demo.getByRole("status")).toHaveText("Reading 14 sources")
  })

  test("waterfall bars don't grow", async ({ page }) => {
    const demo = await open(page, "trace-waterfall")
    await expect(demo.locator("[data-span=run] i")).toHaveCSS("animation-name", "none")
  })

  test("the receipt doesn't print", async ({ page }) => {
    await open(page, "run-receipt")
    await page.waitForTimeout(100)
    const transform = await page.getByTestId("receipt-paper").evaluate((element) => getComputedStyle(element).transform)
    expect(transform).toBe("none")
  })

  test("decided hunks close at once", async ({ page }) => {
    const demo = await open(page, "diff-review")
    await demo.getByRole("button", { name: "Accept change to lib/refunds.ts" }).click()
    await expect(demo.getByText("requestApproval")).toBeHidden({ timeout: 150 })
  })
})
