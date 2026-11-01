import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

function watchErrors(page: Page) {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  return errors
}

test("roll number moves to the new value", async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto("/")
  const roll = page.getByTestId("roll")
  const before = await roll.locator(".sr-only").textContent()
  await page.getByRole("button", { name: "Randomize" }).click()
  await expect(roll.locator(".sr-only")).not.toHaveText(before ?? "")
  expect(errors).toEqual([])
})

test("slider lands on a step after a drag", async ({ page, isMobile }) => {
  test.skip(isMobile, "Mouse drag only; touch is covered by the desktop pointer path")
  const errors = watchErrors(page)
  await page.goto("/")
  const slider = page.getByRole("slider", { name: "Temperature" })
  await slider.scrollIntoViewIfNeeded()
  const box = await slider.boundingBox()
  if (!box) throw new Error("Slider has no box")

  await page.mouse.move(box.x + box.width * 0.4, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * 0.73, box.y + box.height / 2, { steps: 8 })
  await page.mouse.up()

  await expect(slider).toHaveAttribute("aria-valuenow", "1.4")
  await expect(slider).toHaveAttribute("aria-valuetext", "1.4, Creative")
  await expect
    .poll(async () => {
      const thumb = await slider.locator("[data-part=thumb]").boundingBox()
      return thumb ? Number(((thumb.x + thumb.width / 2 - box.x) / box.width).toFixed(2)) : 0
    })
    .toBe(0.7)
  expect(errors).toEqual([])
})

test("slider steps with the keyboard", async ({ page }) => {
  await page.goto("/")
  const slider = page.getByRole("slider", { name: "Temperature" })
  await slider.focus()
  await page.keyboard.press("ArrowRight")
  await expect(slider).toHaveAttribute("aria-valuenow", "1")
  await page.keyboard.press("End")
  await expect(slider).toHaveAttribute("aria-valuenow", "2")
})

test("terrain renders and keeps animating", async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto("/")
  const canvas = page.locator("canvas")
  await expect(canvas).toBeVisible()
  await page.waitForTimeout(600)
  const first = await canvas.screenshot()
  await page.waitForTimeout(700)
  const second = await canvas.screenshot()
  expect(first.equals(second)).toBe(false)
  expect(errors).toEqual([])
})

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" })

  test("terrain holds still and repaints when the theme changes", async ({ page }) => {
    await page.goto("/")
    const canvas = page.locator("canvas")
    await expect(canvas).toBeVisible()
    await page.getByRole("button", { name: "light" }).click()
    await page.waitForTimeout(500)
    const first = await canvas.screenshot()
    await page.waitForTimeout(500)
    expect(first.equals(await canvas.screenshot())).toBe(true)
    await page.getByRole("button", { name: "dark", exact: true }).click()
    await page.waitForTimeout(500)
    expect(first.equals(await canvas.screenshot())).toBe(false)
  })

  test("slider jumps to its step", async ({ page }) => {
    await page.goto("/")
    const slider = page.getByRole("slider", { name: "Temperature" })
    await slider.focus()
    await page.keyboard.press("Home")
    const box = await slider.boundingBox()
    const thumb = await slider.locator("[data-part=thumb]").boundingBox()
    if (!box || !thumb) throw new Error("Slider has no box")
    expect(Math.abs(thumb.x + thumb.width / 2 - box.x)).toBeLessThan(1)
  })
})

for (const skin of ["ledger", "terminal", "folio"] as const) {
  for (const theme of ["light", "dark"] as const) {
    test(`${skin} ${theme} passes axe and has no sideways scroll`, async ({ page }, testInfo) => {
      await page.addInitScript(
        (appearance) => {
          localStorage.setItem("ledger-skin", appearance.skin)
          localStorage.setItem("ledger-theme", appearance.theme)
        },
        { skin, theme },
      )
      await page.goto("/")
      await page.waitForLoadState("networkidle")
      await page.evaluate(() => document.fonts.ready)
      await expect(page.locator("canvas")).toBeVisible()

      const width = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(width).toBeLessThanOrEqual(0)

      const { violations } = await new AxeBuilder({ page }).analyze()
      const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical")
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([])

      await page.waitForTimeout(400)
      await page.screenshot({
        path: `test-results/screens/${testInfo.project.name}-${skin}-${theme}.png`,
        fullPage: true,
      })
    })
  }
}
