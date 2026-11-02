import { readdirSync } from "node:fs"

import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

const slugs = (directory: string) => readdirSync(directory).map((file) => file.replace(/\.mdx$/, ""))

const ROUTES = [
  "/",
  "/components",
  ...slugs("content/components").map((slug) => `/components/${slug}`),
  ...slugs("content/docs").map((slug) => `/docs/${slug}`),
]

function watchErrors(page: Page) {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  return errors
}

async function expectClean(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)

  const { violations } = await new AxeBuilder({ page }).analyze()
  const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical")
  expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([])
}

for (const route of ROUTES) {
  test(`${route} loads cleanly`, async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto(route)
    await page.waitForLoadState("networkidle")
    await expect(page.locator("h1")).toBeVisible()
    await expectClean(page)
    expect(errors).toEqual([])
  })
}

for (const skin of ["ledger", "terminal", "folio"] as const) {
  for (const theme of ["light", "dark"] as const) {
    test(`component page in ${skin} ${theme}`, async ({ page }, testInfo) => {
      await page.addInitScript(
        (appearance) => {
          localStorage.setItem("ledger-skin", appearance.skin)
          localStorage.setItem("ledger-theme", appearance.theme)
        },
        { skin, theme },
      )
      await page.goto("/components/detent-slider")
      await page.waitForLoadState("networkidle")
      await page.evaluate(() => document.fonts.ready)
      await expectClean(page)
      await page.screenshot({
        path: `test-results/screens/${testInfo.project.name}-${skin}-${theme}.png`,
        fullPage: true,
      })
    })
  }
}

test("component page has everything the template promises", async ({ page }) => {
  await page.goto("/components/detent-slider")
  await expect(page.getByTestId("demo").getByRole("slider")).toBeVisible()
  await expect(page.getByText("npx shadcn@latest add", { exact: false }).first()).toContainText("/r/detent-slider.json")
  await expect(page.getByText("Also installs motion.")).toBeVisible()
  await expect(page.getByRole("heading", { name: "Usage" })).toBeVisible()
  const props = page.getByRole("region", { name: "Props" })
  await expect(props.getByText("onValueChange", { exact: true })).toBeVisible()
  await expect(props.getByText("Distance between detents.")).toBeVisible()
  await expect(page.getByRole("region", { name: "Keyboard" }).getByText("Jump to the maximum")).toBeVisible()
  await expect(page.getByRole("region", { name: "Reduced motion" })).toContainText("jumps straight to its step")
  await expect(page).toHaveTitle("Detent Slider · Ledger UI")
})

test("install command copies", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium", "Clipboard permissions are Chromium only")
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto("/components/roll-number")
  await page.waitForLoadState("networkidle")
  await page.getByRole("region", { name: "Install" }).getByRole("button", { name: "Copy" }).click()
  await expect(page.getByRole("region", { name: "Install" }).getByRole("button", { name: "Copied" })).toBeVisible()
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied).toMatch(/^npx shadcn@latest add .+\/r\/roll-number\.json$/)
})

test("rail marks the current page", async ({ page }) => {
  await page.goto("/components/bar-terrain")
  await expect(page.getByRole("navigation", { name: "Components" }).getByRole("link", { name: /Bar Terrain/ })).toHaveAttribute("aria-current", "page")
})

test("rail shows the current page on phones", async ({ page, isMobile }) => {
  test.skip(!isMobile, "The rail only scrolls sideways on phones")
  await page.goto("/components/command-palette")
  await page.waitForLoadState("networkidle")
  await expect(page.getByRole("navigation", { name: "Components" }).getByRole("link", { name: /Command Palette/ })).toBeInViewport({ ratio: 0.9 })
})

test("next link moves through the catalog", async ({ page }) => {
  await page.goto("/components/roll-number")
  await page.getByRole("navigation", { name: "Other components" }).getByRole("link", { name: /Scramble Text/ }).click()
  await expect(page).toHaveURL(/scramble-text/)
})

test.describe("search", () => {
  test("opens with the hotkey, filters and navigates from the keyboard", async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    await page.keyboard.press("Control+k")
    const input = page.getByRole("combobox", { name: "Search components" })
    await expect(input).toBeFocused()
    await input.fill("bar ter")
    await expect(page.getByRole("option").first()).toHaveText(/Bar Terrain/)
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/\/components\/bar-terrain/)
    await expect(input).toBeHidden()
    expect(errors).toEqual([])
  })

  test("arrow keys move the selection and Esc returns focus", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    const trigger = page.getByRole("button", { name: /Search/ })
    await trigger.click()
    const input = page.getByRole("combobox", { name: "Search components" })
    await expect(input).toBeFocused()
    const first = await input.getAttribute("aria-activedescendant")
    await page.keyboard.press("ArrowDown")
    await expect(input).not.toHaveAttribute("aria-activedescendant", first ?? "")
    await page.keyboard.press("Escape")
    await expect(input).toBeHidden()
    await expect(trigger).toBeFocused()
  })

  test("can switch the skin", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    await page.getByRole("button", { name: /Search/ }).click()
    await page.getByRole("combobox", { name: "Search components" }).fill("folio")
    await page.keyboard.press("Enter")
    await expect(page.locator("html")).toHaveAttribute("data-skin", "folio")
  })

  test("says when nothing matches", async ({ page }) => {
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    await page.getByRole("button", { name: /Search/ }).click()
    await page.getByRole("combobox", { name: "Search components" }).fill("zzzz")
    await expect(page.getByText("No command matches")).toBeVisible()
  })
})

test("choices survive a reload without a flash", async ({ page }) => {
  await page.goto("/components")
  await page.waitForLoadState("networkidle")
  await page.getByRole("group", { name: "Skin" }).getByRole("button", { name: "terminal" }).click()
  await page.getByRole("group", { name: "Theme" }).getByRole("button", { name: "dark" }).click()
  await page.reload()
  await expect(page.locator("html")).toHaveAttribute("data-skin", "terminal")
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark")
})

test("palette demo runs a command", async ({ page }) => {
  await page.goto("/components/command-palette")
  await page.waitForLoadState("networkidle")
  await page.getByRole("button", { name: "Open palette" }).click()
  await page.getByRole("combobox", { name: "Type a command" }).fill("export")
  await page.keyboard.press("Enter")
  await expect(page.getByTestId("palette-result")).toHaveText("Ran: Export table as CSV")
})

test("unknown pages get the styled 404", async ({ page }) => {
  await page.goto("/components/nope")
  await expect(page.getByRole("heading", { name: "Not in the ledger" })).toBeVisible()
})
