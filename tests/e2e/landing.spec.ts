import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test.describe("landing page", () => {
  for (const skin of ["ledger", "terminal", "folio"]) {
    test(`the headlines fit edge to edge in ${skin}`, async ({ page }) => {
      await page.addInitScript((choice) => localStorage.setItem("spotcheck-skin", choice), skin)
      await page.goto("/")
      await page.waitForLoadState("networkidle")
      await expect(page.getByRole("heading", { level: 1 })).toContainText(/keep the books/i)

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
    await expect(page.getByText(/npx shadcn@latest add .*chat-screen\.json/).first()).toBeVisible()
    await expect(page.getByRole("link", { name: "Components", exact: true })).toHaveAttribute("href", "/components")
  })

  test("the answer streams when you reach it", async ({ page }) => {
    await page.goto("/")
    await page.getByTestId("entry-1").scrollIntoViewIfNeeded()
    await expect(page.getByTestId("entry-1").getByTestId("stream-status")).toHaveText("done", { timeout: 15000 })
    await expect(page.getByTestId("entry-1").locator("strong")).toHaveText("manager approval")
  })

  test("signing closes the books and prints the receipt", async ({ page, isMobile }) => {
    await page.goto("/")
    const entry = page.getByTestId("entry-5")
    await entry.scrollIntoViewIfNeeded()
    await expect(page.getByText("The receipt prints when you sign")).toBeVisible()
    await entry.getByRole("button", { name: "Approve" }).click()
    await expect(entry.getByText("Run R-2041")).toBeVisible({ timeout: 5000 })
    if (!isMobile) await expect(page.getByTestId("spotcheck-state")).toHaveText("Books closed")
    await expect(page.getByRole("complementary", { name: "Running tally" })).toContainText("0")

    await entry.getByRole("button", { name: "Reopen the file" }).click()
    await expect(page.getByText("The receipt prints when you sign")).toBeVisible()
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
