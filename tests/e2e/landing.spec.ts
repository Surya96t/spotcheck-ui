import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test.describe("landing page", () => {
  for (const skin of ["ledger", "terminal", "folio"]) {
    test(`the headlines fit edge to edge in ${skin}`, async ({ page }) => {
      await page.addInitScript((choice) => localStorage.setItem("spotcheck-skin", choice), skin)
      await page.goto("/")
      await page.waitForLoadState("networkidle")
      await expect(page.getByRole("heading", { level: 1 })).toContainText(/pick any part/i)

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow).toBe(0)

      const spare = await page.evaluate(() =>
        [...document.querySelectorAll(".landing-line > span, .landing-finale h2, .landing-wordmark span")]
          .filter((element) => element.getClientRects().length > 0)
          .map((element) => {
            const range = document.createRange()
            range.selectNodeContents(element)
            return element.closest("[class*='@container']")!.clientWidth - range.getBoundingClientRect().width
          }),
      )
      expect(spare.length).toBeGreaterThanOrEqual(4)
      for (const pixels of spare) expect(pixels).toBeGreaterThanOrEqual(0)
    })
  }

  test("reaches the install step without opening the catalog", async ({ page }) => {
    await page.goto("/")
    const copy = page.getByRole("button", { name: "Copy" }).first()
    await expect(page.getByText(/npx shadcn@latest add .*chat-screen\.json/).first()).toBeVisible()
    await expect(copy).toBeInViewport({ ratio: 1 })
    await expect(page.getByRole("link", { name: /Browse components/ }).first()).toBeInViewport({ ratio: 1 })
  })

  test("the answer streams when you reach it", async ({ page }) => {
    await page.goto("/")
    await page.getByTestId("check-4").getByTestId("stream-status").scrollIntoViewIfNeeded()
    await expect(page.getByTestId("check-4").getByTestId("stream-status")).toHaveText("done", { timeout: 15000 })
    await expect(page.getByTestId("check-4").locator("strong").first()).toHaveText("manager approval")
  })

  test("a chapter is stamped when you reach it", async ({ page }) => {
    await page.goto("/")
    const check = page.getByTestId("check-1")
    await expect(check.getByTestId("checked")).toHaveAttribute("data-checked", "false")
    await check.getByRole("heading").scrollIntoViewIfNeeded()
    await page.evaluate(() => window.scrollBy(0, 300))
    await expect(check.getByTestId("checked")).toHaveAttribute("data-checked", "true")
  })

  test("signing prints the receipt and stamps the last chapter", async ({ page }) => {
    await page.goto("/")
    const check = page.getByTestId("check-5")
    await check.scrollIntoViewIfNeeded()
    await expect(page.getByText("The receipt prints when you sign")).toBeVisible()
    await check.getByRole("button", { name: "Approve" }).click()
    await expect(check.getByText("5 of 5")).toBeVisible({ timeout: 5000 })
    await expect(check.getByTestId("checked")).toHaveAttribute("data-checked", "true")

    await check.getByRole("button", { name: "Reopen the file" }).click()
    await expect(page.getByText("The receipt prints when you sign")).toBeVisible()
  })

  test("keeps to the word limit", async ({ page }) => {
    await page.goto("/")
    const copy = await page.evaluate(() =>
      [...document.querySelectorAll("main h1, main h2, [data-copy]")].map((element) => element.textContent).join(" "),
    )
    expect(copy.trim().split(/\s+/).length).toBeLessThanOrEqual(150)
  })

  test("has the roadmap, and no running tally", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { name: "What's next" })).toBeAttached()
    await expect(page.getByText(/running tally/i)).toHaveCount(0)
  })

  test("a skin sheet switches the whole page", async ({ page }) => {
    await page.goto("/")
    await page.getByRole("button", { name: "Use Terminal" }).click()
    await expect(page.locator("html")).toHaveAttribute("data-skin", "terminal")
  })

  test("the skin sheets keep their own type on any page skin", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("spotcheck-skin", "terminal"))
    await page.goto("/")
    const display = (name: string) =>
      page.getByRole("heading", { name, exact: true }).evaluate((element) => getComputedStyle(element).fontFamily)
    expect(await display("Ledger")).toContain("Archivo")
    expect(await display("Folio")).toContain("Instrument Serif")
  })

  test("passes axe", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations.map((violation) => violation.id)).toEqual([])
  })
})
