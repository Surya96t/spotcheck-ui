import { readdirSync } from "node:fs"

import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

const slugs = (directory: string) => readdirSync(directory).map((file) => file.replace(/\.mdx$/, ""))

const ROUTES = [
  "/",
  "/components",
  "/docs",
  "/roadmap",
  "/compare",
  "/support",
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

  // Text that's still fading in has a lower contrast than it settles at.
  await page.evaluate(() =>
    Promise.all(
      [...document.querySelectorAll(".landing-enter")].flatMap((element) => element.getAnimations().map((animation) => animation.finished)),
    ),
  )
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
          localStorage.setItem("spotcheck-skin", appearance.skin)
          localStorage.setItem("spotcheck-theme", appearance.theme)
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
  await expect(page).toHaveTitle("Detent Slider · Spotcheck UI")
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

test.describe("site structure", () => {
  const PAGES = ["/", "/components", "/components/diff-review", "/docs", "/docs/theming", "/roadmap", "/compare", "/support"]

  for (const route of PAGES) {
    test(`${route} has the nav, a way home and the footer`, async ({ page }) => {
      await page.goto(route)
      const nav = page.getByRole("navigation", { name: "Main" })
      await expect(nav.getByRole("link", { name: "Spotcheck UI home" })).toHaveAttribute("href", "/")
      await expect(page.getByRole("contentinfo")).toBeVisible()
      await expect(nav.getByText(/pricing|account/i)).toHaveCount(0)
    })
  }

  test("the nav has the four sections", async ({ page, isMobile }) => {
    test.skip(isMobile, "Phones use the menu")
    await page.goto("/")
    const nav = page.getByRole("navigation", { name: "Main" })
    await expect(nav.getByRole("button", { name: "Products" })).toBeVisible()
    await expect(nav.getByRole("button", { name: "Resources" })).toBeVisible()
    await expect(nav.getByRole("link", { name: "Docs" })).toHaveAttribute("href", "/docs")
    await expect(nav.getByRole("link", { name: "Support" })).toHaveAttribute("href", "/support")
  })

  test("a nav menu goes to a component group, from the keyboard too", async ({ page, isMobile }) => {
    test.skip(isMobile, "Phones use the menu")
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    await page.getByRole("button", { name: "Products" }).click()
    await page.getByRole("menuitem", { name: /3D and WebGL/ }).click()
    await expect(page).toHaveURL(/\/components#webgl$/)
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    await page.getByRole("button", { name: "Resources" }).focus()
    await page.keyboard.press("Enter")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/\/(roadmap|compare)$/)
  })

  test("the phone menu opens and navigates", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Only phones use the sheet")
    await page.goto("/")
    await page.waitForLoadState("networkidle")
    await page.getByRole("button", { name: "Menu" }).click()
    await page.getByRole("navigation", { name: "Menu" }).getByRole("link", { name: "Docs" }).click()
    await expect(page).toHaveURL(/\/docs$/)
    await expect(page.getByRole("heading", { level: 1, name: "Introduction" })).toBeVisible()
  })

  test("/components lists each component once, with no sidebar", async ({ page }) => {
    await page.goto("/components")
    await expect(page.getByRole("heading", { level: 3 })).toHaveCount(readdirSync("content/components").length)
    await expect(page.getByRole("navigation", { name: /components$/ })).toHaveCount(0)
    await expect(page.getByRole("heading", { level: 2 }).first()).toHaveText("AI")
  })

  test("a jump lands on its group after the demos above it load", async ({ page }) => {
    await page.goto("/components#webgl")
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(2800)
    await expect(page.getByRole("heading", { level: 2, name: "WebGL" })).toBeInViewport()
  })

  test("a component page lists only its own group", async ({ page, isMobile }) => {
    test.skip(isMobile, "The group list is hidden on phones")
    await page.goto("/components/bar-terrain")
    const group = page.getByRole("navigation", { name: "WebGL components" })
    await expect(group.getByRole("link", { name: "Bar Terrain" })).toHaveAttribute("aria-current", "page")
    await expect(group.getByRole("link", { name: "Diff Review" })).toHaveCount(0)
  })

  test("docs and components don't list each other", async ({ page, isMobile }) => {
    test.skip(isMobile, "The group list is hidden on phones")
    await page.goto("/docs/installation")
    const docs = page.getByRole("navigation", { name: "Docs" })
    await expect(docs.getByRole("link", { name: "Installation" })).toHaveAttribute("aria-current", "page")
    await expect(docs.getByRole("link", { name: "Diff Review" })).toHaveCount(0)
    await page.goto("/components/diff-review")
    await expect(page.getByRole("navigation", { name: "Docs" })).toHaveCount(0)
  })

  test("the old tally rail is gone", async ({ page }) => {
    await page.goto("/components")
    await expect(page.getByRole("navigation", { name: "Components", exact: true })).toHaveCount(0)
  })
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

test("choices survive a reload without a flash", async ({ page, isMobile }) => {
  await page.goto("/components")
  await page.waitForLoadState("networkidle")
  await page.getByRole("button", { name: isMobile ? "Menu" : "Skin" }).click()
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
  await expect(page.getByRole("heading", { name: "Not on file" })).toBeVisible()
})
