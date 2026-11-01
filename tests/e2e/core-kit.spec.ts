import { expect, test, type Page } from "@playwright/test"

async function open(page: Page, slug: string) {
  await page.goto(`/components/${slug}`)
  await page.waitForLoadState("networkidle")
  return page.getByTestId("demo")
}

test("button moves into its shadow on press", async ({ page, isMobile }) => {
  test.skip(isMobile, "Uses the mouse")
  const demo = await open(page, "button")
  const button = demo.getByRole("button", { name: "Deploy" })
  const box = await button.boundingBox()
  if (!box) throw new Error("No box")
  await page.mouse.move(box.x + 5, box.y + 5)
  await page.mouse.down()
  await expect(button).toHaveCSS("translate", "4px 4px")
  await page.mouse.up()
})

test.describe("hold button", () => {
  test("confirms after a full hold with the keyboard", async ({ page }) => {
    const demo = await open(page, "hold-button")
    await demo.getByRole("button", { name: "Hold to delete" }).focus()
    await page.keyboard.down("Space")
    await expect(page.getByTestId("hold-count")).toHaveText("Confirmed 1 times", { timeout: 3000 })
    await page.keyboard.up("Space")
  })

  test("cancels if released early", async ({ page }) => {
    const demo = await open(page, "hold-button")
    const button = demo.getByRole("button", { name: "Hold to delete" })
    await button.focus()
    await page.keyboard.down("Enter")
    await page.waitForTimeout(300)
    await page.keyboard.up("Enter")
    await page.waitForTimeout(1200)
    await expect(page.getByTestId("hold-count")).toHaveText("Confirmed 0 times")
    await expect(button.locator("[data-part=fill]")).toHaveCSS("transform", "matrix(0, 0, 0, 1, 0, 0)")
  })

  test("another key doesn't cancel the hold", async ({ page }) => {
    const demo = await open(page, "hold-button")
    await demo.getByRole("button", { name: "Hold to delete" }).focus()
    await page.keyboard.down("Space")
    await page.keyboard.press("Shift")
    await expect(page.getByTestId("hold-count")).toHaveText("Confirmed 1 times", { timeout: 3000 })
    await page.keyboard.up("Space")
  })
})

test("field connects its error to the input", async ({ page }) => {
  const demo = await open(page, "field")
  const input = demo.getByRole("textbox", { name: "API key" })
  await expect(input).toHaveAttribute("aria-invalid", "true")
  await expect(input).toHaveAccessibleDescription(/Paste the full key/)
  await input.fill("sk-1234567890")
  await expect(input).not.toHaveAttribute("aria-invalid", "true")
})

test("tabs move with arrow keys and the bar follows", async ({ page }) => {
  const demo = await open(page, "tabs")
  const first = demo.getByRole("tab", { name: "Overview" })
  await first.focus()
  await page.keyboard.press("ArrowRight")
  await expect(demo.getByRole("tab", { name: "Tokens" })).toBeFocused()
  await page.keyboard.press("Enter")
  // Base UI keeps the old panel inert for a frame while the new one mounts.
  await expect(demo.locator("[role=tabpanel]:not([inert])")).toContainText("three type roles")
  await expect(demo.getByRole("tab", { name: "Tokens" })).toHaveAttribute("aria-controls", /.+/)
})

test("tab bar lands under the active tab", async ({ page }) => {
  const demo = await open(page, "tabs")
  await demo.getByRole("tab", { name: "License" }).click()
  await expect
    .poll(() =>
      demo.getByRole("tablist").evaluate((list) => {
        const tab = list.querySelector("[aria-selected=true]")?.getBoundingClientRect()
        const bar = list.lastElementChild?.getBoundingClientRect()
        return Math.abs((tab?.left ?? 0) - (bar?.left ?? 99)) + Math.abs((tab?.width ?? 0) - (bar?.width ?? 99))
      }),
    )
    .toBeLessThan(1)
})

test("switch toggles from its label", async ({ page }) => {
  const demo = await open(page, "switch")
  const control = demo.getByRole("switch", { name: "Cache prompts" })
  await expect(control).toHaveAttribute("aria-checked", "false")
  await demo.getByText("Cache prompts").click()
  await expect(control).toHaveAttribute("aria-checked", "true")
})

test("checkbox toggles with the keyboard", async ({ page }) => {
  const demo = await open(page, "checkbox")
  const box = demo.getByRole("checkbox", { name: "Email the whole team" })
  await box.focus()
  await page.keyboard.press("Space")
  await expect(box).toBeChecked()
})

test("radio moves with arrow keys", async ({ page }) => {
  const demo = await open(page, "radio-group")
  await demo.getByRole("radio", { name: "90 days" }).focus()
  await page.keyboard.press("ArrowDown")
  await expect(demo.getByRole("radio", { name: "One year" })).toBeChecked()
})

test("select chooses from its list", async ({ page }) => {
  const demo = await open(page, "select")
  const trigger = demo.getByRole("combobox", { name: "Model" })
  await trigger.click()
  await page.getByRole("option", { name: "atlas-s" }).click()
  await expect(trigger).toContainText("atlas-s")
})

test("combobox filters as you type", async ({ page }) => {
  const demo = await open(page, "combobox")
  const input = demo.getByRole("combobox", { name: "Region" })
  await input.fill("sing")
  await expect(page.getByRole("option")).toHaveCount(1)
  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Enter")
  await expect(input).toHaveValue("Singapore")
})

test("calendar moves with the keyboard and picks a day", async ({ page }) => {
  const demo = await open(page, "date-picker")
  const today = demo.getByRole("gridcell", { name: /12 November 2026/ })
  await today.focus()
  await page.keyboard.press("ArrowRight")
  await page.keyboard.press("ArrowDown")
  await expect(demo.getByRole("gridcell", { name: /20 November 2026/ })).toBeFocused()
  await page.keyboard.press("PageDown")
  await expect(demo.getByRole("gridcell", { name: /20 December 2026/ })).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(demo.getByRole("button", { name: /Billing starts: 20 Dec 2026/ })).toBeVisible()
})

test("date picker closes after choosing", async ({ page }) => {
  const demo = await open(page, "date-picker")
  await demo.getByRole("button", { name: /Billing starts/ }).click()
  await page.getByRole("dialog").getByRole("gridcell", { name: /15 November 2026/ }).click()
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(demo.getByRole("button", { name: /Billing starts: 15 Nov 2026/ })).toBeVisible()
})

test("pagination moves and marks the page", async ({ page }) => {
  const demo = await open(page, "pagination")
  await demo.getByRole("button", { name: "Next page" }).click()
  await expect(demo.getByRole("button", { name: "Page 8" })).toHaveAttribute("aria-current", "page")
})

test("ledger table sorts from its headers", async ({ page }) => {
  const demo = await open(page, "ledger-table")
  await expect(demo.getByRole("columnheader", { name: /Score/ })).toHaveAttribute("aria-sort", "descending")
  await expect(demo.getByRole("row").nth(1)).toContainText("R-2037")
  await demo.getByRole("button", { name: /p50 ms/ }).click()
  await expect(demo.getByRole("row").nth(1)).toContainText("R-2038")
})

test("dialog traps focus, closes on Esc and returns focus", async ({ page }) => {
  const demo = await open(page, "dialog")
  const trigger = demo.getByRole("button", { name: "Compare runs" })
  await trigger.click()
  await expect(page.getByRole("dialog", { name: "Compare two runs" })).toBeVisible()
  await page.keyboard.press("Tab")
  await expect(page.getByRole("button", { name: "Done" })).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("sheet opens from the side and closes", async ({ page }) => {
  const demo = await open(page, "sheet")
  const trigger = demo.getByRole("button", { name: "Run details" })
  await trigger.click()
  await expect(page.getByRole("dialog", { name: "R-2041" })).toBeVisible()
  await page.getByRole("button", { name: "Close" }).click()
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(trigger).toBeFocused()
})

test("dropdown runs an item and skips disabled ones", async ({ page }) => {
  const demo = await open(page, "dropdown-menu")
  await demo.getByRole("button", { name: "Actions" }).click()
  await expect(page.getByRole("menuitem", { name: "Delete run" })).toHaveAttribute("aria-disabled", "true")
  await page.getByRole("menuitem", { name: "Export CSV" }).click()
  await expect(page.getByTestId("menu-result")).toHaveText("Export CSV")
})

test("popover opens and closes on Esc", async ({ page }) => {
  const demo = await open(page, "popover")
  await demo.getByRole("button", { name: "Token usage" }).click()
  await expect(page.getByText("2,140")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByText("2,140")).toBeHidden()
})

test("tooltip shows on keyboard focus", async ({ page }) => {
  const demo = await open(page, "tooltip")
  await demo.getByRole("button", { name: "Queue run" }).focus()
  await expect(page.locator("[data-open]").getByText("Runs in the background")).toBeVisible()
})

test("toast announces and can be dismissed", async ({ page }) => {
  const demo = await open(page, "toast")
  await demo.getByRole("button", { name: "Queue a run" }).click()
  await expect(page.getByText("Run queued")).toBeVisible()
  await page.locator("[aria-label=Dismiss]").click()
  await expect(page.getByText("Run queued")).toBeHidden()
})

test("toast can be dismissed from the keyboard", async ({ page }) => {
  const demo = await open(page, "toast")
  await demo.getByRole("button", { name: "Queue a run" }).focus()
  await page.keyboard.press("Enter")
  await expect(page.getByText("Run queued")).toBeVisible()
  await page.keyboard.press("F6")
  await page.keyboard.press("Tab")
  await page.keyboard.press("Tab")
  await expect(page.getByRole("button", { name: "Dismiss" })).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(page.getByText("Run queued")).toBeHidden()
})

test.describe("settings screen, the Phase 2 exit check", () => {
  test("every tab works with Ledger parts alone", async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    const demo = await open(page, "settings-screen")

    const name = demo.getByRole("textbox", { name: "Workspace name" })
    await name.fill("")
    await expect(demo.getByRole("button", { name: "Save" })).toBeDisabled()
    await expect(name).toHaveAccessibleDescription(/Give the workspace a name/)
    await name.fill("eval-team")
    await expect(demo.getByText("9/32")).toBeVisible()
    await demo.getByRole("combobox", { name: "Default model" }).click()
    await page.getByRole("option", { name: "atlas-s" }).click()
    await demo.getByRole("button", { name: "Save" }).click()
    await expect(page.getByText("eval-team is up to date.")).toBeVisible()

    await demo.getByRole("tab", { name: "Alerts" }).click()
    await demo.getByText("Post spend alerts to the team").click()
    await expect(demo.getByRole("switch", { name: "Post spend alerts to the team" })).toHaveAttribute("aria-checked", "true")
    await demo.getByRole("button", { name: "Weekly" }).click()
    await expect(demo.getByRole("button", { name: "Weekly" })).toHaveAttribute("aria-pressed", "true")

    await demo.getByRole("tab", { name: "API keys" }).click()
    await expect(demo.getByRole("row").nth(1)).toContainText("ci-runner")
    await demo.getByRole("button", { name: "New key" }).click()
    await expect(page.getByRole("dialog", { name: "New API key" })).toBeVisible()
    await page.getByRole("button", { name: "Cancel" }).click()

    await demo.getByRole("tab", { name: "Danger" }).click()
    await demo.getByRole("button", { name: "Hold to delete workspace" }).focus()
    await page.keyboard.down("Space")
    await expect(demo.getByText("Workspace deleted")).toBeVisible({ timeout: 3000 })
    await page.keyboard.up("Space")
    expect(errors).toEqual([])
  })
})
