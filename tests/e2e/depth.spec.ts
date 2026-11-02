import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Locator, type Page } from "@playwright/test"

function watchErrors(page: Page) {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  return errors
}

async function open(page: Page, slug: string) {
  await page.goto(`/components/${slug}`)
  await page.waitForLoadState("networkidle")
  const demo = page.getByTestId("demo")
  await demo.scrollIntoViewIfNeeded()
  return demo
}

const rotation = (page: Page, selector: string, axis: string) =>
  page.locator(selector).first().evaluate((element, name) => {
    const match = (element as HTMLElement).style.transform.match(new RegExp(`${name}\\((-?[\\d.]+)deg\\)`))
    return match ? Number(match[1]) : 0
  }, axis)

const selectedDrumRow = (page: Page) => page.getByTestId("demo").getByRole("option", { selected: true })

test.describe("drum picker", () => {
  const ROW_ANGLE = 22

  test("arrow keys, Home and End land on a row, and the specs follow", async ({ page }) => {
    const errors = watchErrors(page)
    const demo = await open(page, "drum-picker")
    const list = demo.getByRole("listbox", { name: "Model" })
    await list.focus()
    await page.keyboard.press("ArrowDown")
    await expect(selectedDrumRow(page)).toHaveText("atlas-s")
    await expect(demo.getByTestId("drum-name")).toHaveText("atlas-s")
    await page.keyboard.press("End")
    await expect(selectedDrumRow(page)).toHaveText("local/8b")
    await page.keyboard.press("Home")
    await expect(selectedDrumRow(page)).toHaveText("atlas-l")
    await expect(list).toHaveAttribute("aria-activedescendant", (await selectedDrumRow(page).getAttribute("id")) ?? "")
    await expect.poll(() => rotation(page, "[data-part=wheel]", "rotateX"), { timeout: 3000 }).toBeCloseTo(0, 1)
    expect(errors).toEqual([])
  })

  test("a flick coasts and lands exactly on a row", async ({ page, isMobile }) => {
    test.skip(isMobile, "Uses the mouse")
    const demo = await open(page, "drum-picker")
    const box = await demo.getByRole("listbox").boundingBox()
    if (!box) throw new Error("No box")
    await page.mouse.move(box.x + box.width / 2, box.y + box.height - 20)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2, box.y + 20, { steps: 4 })
    await page.mouse.up()
    await expect(selectedDrumRow(page)).not.toHaveText("atlas-m")
    await page.waitForTimeout(1200)
    const rows = (await rotation(page, "[data-part=wheel]", "rotateX")) / ROW_ANGLE
    expect(rows).toBeCloseTo(Math.round(rows), 1)
    const index = await demo.getByRole("option").evaluateAll((options) => options.findIndex((option) => option.getAttribute("aria-selected") === "true"))
    expect(Math.round(rows)).toBe(index)
  })

  test("the mouse wheel turns the drum, then scrolls the page at the last row", async ({ page, isMobile }) => {
    test.skip(isMobile, "Uses the mouse")
    const demo = await open(page, "drum-picker")
    const list = demo.getByRole("listbox")
    await list.hover()
    const start = await page.evaluate(() => window.scrollY)
    await page.mouse.wheel(0, 100)
    await expect(selectedDrumRow(page)).toHaveText("atlas-s")
    expect(await page.evaluate(() => window.scrollY)).toBe(start)

    await list.focus()
    await page.keyboard.press("End")
    await list.hover()
    const before = await page.evaluate(() => window.scrollY)
    await page.mouse.wheel(0, 120)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before)
    await expect(selectedDrumRow(page)).toHaveText("local/8b")
  })

  test("the mouse wheel scrolls the page at the first row", async ({ page, isMobile }) => {
    test.skip(isMobile, "Uses the mouse")
    const demo = await open(page, "drum-picker")
    const list = demo.getByRole("listbox")
    await list.focus()
    await page.keyboard.press("Home")
    await page.evaluate(() => window.scrollBy(0, 200))
    await page.waitForTimeout(100)
    await list.hover()
    const before = await page.evaluate(() => window.scrollY)
    await page.mouse.wheel(0, -120)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(before)
  })

  test("only the wheel blocks touch scrolling, and it leaves a gutter at 390px", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Phone width only")
    const demo = await open(page, "drum-picker")
    const list = demo.getByRole("listbox")
    await expect(list).toHaveCSS("touch-action", "none")
    const box = await list.boundingBox()
    if (!box) throw new Error("No box")
    expect(390 - (box.x + box.width)).toBeGreaterThanOrEqual(48)
  })

  test.describe("under reduced motion", () => {
    test.use({ reducedMotion: "reduce" })

    test("jumps straight to the row", async ({ page }) => {
      const demo = await open(page, "drum-picker")
      await demo.getByRole("listbox").focus()
      await page.keyboard.press("End")
      expect(await rotation(page, "[data-part=wheel]", "rotateX")).toBe(9 * ROW_ANGLE)
    })
  })
})

test.describe("coverflow", () => {
  const selected = (page: Page) => page.getByTestId("demo").getByRole("option", { selected: true })

  test("buttons and arrow keys change the selection", async ({ page }) => {
    const errors = watchErrors(page)
    const demo = await open(page, "coverflow")
    await expect(selected(page)).toHaveAccessibleName(/invoices-ocr/)
    await demo.getByRole("button", { name: "Next" }).click()
    await expect(selected(page)).toHaveAccessibleName(/refund-intents/)
    await demo.getByRole("button", { name: "Previous" }).click()
    await expect(selected(page)).toHaveAccessibleName(/invoices-ocr/)
    await demo.getByRole("listbox", { name: "Datasets" }).focus()
    await page.keyboard.press("ArrowLeft")
    await expect(selected(page)).toHaveAccessibleName(/tool-use/)
    await expect(demo.getByTestId("coverflow-summary")).toHaveText(/^tool-use · 1,180 pairs/)
    expect(errors).toEqual([])
  })

  test("clicking a side card selects it", async ({ page, isMobile }) => {
    test.skip(isMobile, "Uses the mouse")
    const demo = await open(page, "coverflow")
    await page.waitForTimeout(300)
    const box = await demo.getByRole("listbox").boundingBox()
    if (!box) throw new Error("No box")
    await page.mouse.click(box.x + box.width / 2 + 200, box.y + box.height / 2)
    await expect(selected(page)).not.toHaveAccessibleName(/invoices-ocr/)
  })

  test("a flick carries momentum and lands on the nearest card", async ({ page, isMobile }) => {
    test.skip(isMobile, "Uses the mouse")
    const demo = await open(page, "coverflow")
    const box = await demo.getByRole("listbox").boundingBox()
    if (!box) throw new Error("No box")
    await page.mouse.move(box.x + box.width / 2 + 120, box.y + 40)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width / 2 - 60, box.y + 40, { steps: 3 })
    await page.mouse.up()
    await expect(selected(page)).not.toHaveAccessibleName(/invoices-ocr/)
    await page.waitForTimeout(1200)
    const offset = await selected(page).evaluate((card) => {
      const rect = card.getBoundingClientRect()
      const stage = card.parentElement!.getBoundingClientRect()
      return Math.abs(rect.left + rect.width / 2 - (stage.left + stage.width / 2))
    })
    expect(offset).toBeLessThan(1)
  })

  test("tapping a side card selects it, and vertical scroll stays with the page", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Touch only")
    const demo = await open(page, "coverflow")
    const list = demo.getByRole("listbox")
    await expect(list).toHaveCSS("touch-action", "pan-y")
    await page.waitForTimeout(300)
    const box = await list.boundingBox()
    if (!box) throw new Error("No box")
    await page.touchscreen.tap(box.x + box.width - 16, box.y + box.height / 2)
    await expect(selected(page)).not.toHaveAccessibleName(/invoices-ocr/)
  })
})

test.describe("coverflow under reduced motion", () => {
  test.use({ reducedMotion: "reduce" })

  test("jumps to the card", async ({ page }) => {
    const demo = await open(page, "coverflow")
    await demo.getByRole("button", { name: "Next" }).click()
    const offset = await demo.getByRole("option", { selected: true }).evaluate((card) => {
      const rect = card.getBoundingClientRect()
      const stage = card.parentElement!.getBoundingClientRect()
      return Math.abs(rect.left + rect.width / 2 - (stage.left + stage.width / 2))
    })
    expect(offset).toBeLessThan(1)
  })
})

test.describe("fold report", () => {
  /** Clicks a header and watches its rows frame by frame, to see which ones start moving first. */
  const sampleRows = (header: Locator) =>
    header.evaluate(
      (button) =>
        new Promise<{ spread: number; firstMovedAt: number; lastMovedAt: number }>((done) => {
          const panel = document.getElementById(button.getAttribute("aria-controls") ?? "")
          const rows = [...(panel?.querySelectorAll<HTMLElement>("[data-fold-row]") ?? [])]
          const moved = (row?: HTMLElement) => {
            const opacity = row ? Number(getComputedStyle(row).opacity) : 1
            return opacity > 0.02 && opacity < 0.98
          }
          let spread = 0
          let firstMovedAt = Infinity
          let lastMovedAt = Infinity
          ;(button as HTMLElement).click()
          const start = performance.now()
          const sample = () => {
            const now = performance.now() - start
            spread = Math.max(spread, new Set(rows.map((row) => getComputedStyle(row).opacity)).size)
            if (firstMovedAt === Infinity && moved(rows[0])) firstMovedAt = now
            if (lastMovedAt === Infinity && moved(rows.at(-1))) lastMovedAt = now
            if (now > 600) done({ spread, firstMovedAt, lastMovedAt })
            else requestAnimationFrame(sample)
          }
          requestAnimationFrame(sample)
        }),
    )

  test("opens with a stagger, closes from the last row and leaves no fixed height", async ({ page }) => {
    const errors = watchErrors(page)
    const demo = await open(page, "fold-report")
    const header = demo.getByRole("button", { name: /Root cause/ })
    const panel = demo.getByRole("region", { name: /Root cause/ })
    await expect(header).toHaveAttribute("aria-expanded", "false")
    await expect(panel).toBeHidden()

    const opening = await sampleRows(header)
    await expect(header).toHaveAttribute("aria-expanded", "true")
    expect(opening.spread).toBeGreaterThan(1)
    expect(opening.firstMovedAt).toBeLessThan(opening.lastMovedAt)

    await expect.poll(() => panel.evaluate((element) => element.style.height)).toBe("")
    await expect(panel.locator("[data-fold-row]").last()).toBeVisible()
    await expect.poll(() => panel.locator("[data-fold-row]").last().evaluate((row) => row.style.transform)).toBe("")
    const contentFits = await panel.evaluate((element) => element.scrollHeight <= element.clientHeight)
    expect(contentFits).toBe(true)

    const closing = await sampleRows(header)
    await expect(header).toHaveAttribute("aria-expanded", "false")
    expect(closing.lastMovedAt).toBeLessThan(closing.firstMovedAt)
    await expect(panel).toBeHidden()
    expect(errors).toEqual([])
  })

  test("opens to the full height of its content at phone width too", async ({ page }) => {
    const demo = await open(page, "fold-report")
    const panel = demo.getByRole("region", { name: /Timeline/ })
    await demo.getByRole("button", { name: /Follow-ups/ }).click()
    await expect(panel).toBeHidden()
    await demo.getByRole("button", { name: /Timeline/ }).click()
    await expect.poll(() => panel.evaluate((element) => element.style.height)).toBe("")
    await expect(panel.locator("[data-fold-row]")).toHaveCount(5)
    await expect(panel.locator("[data-fold-row]").last()).toBeInViewport()
  })

  test("survives being toggled mid-fold", async ({ page }) => {
    const errors = watchErrors(page)
    const demo = await open(page, "fold-report")
    const header = demo.getByRole("button", { name: /Fix/ })
    const panel = demo.getByRole("region", { name: /Fix/ })
    await header.click()
    await header.click()
    await header.click()
    await expect(header).toHaveAttribute("aria-expanded", "true")
    await expect.poll(() => panel.evaluate((element) => element.style.height)).toBe("")
    await expect(panel.locator("[data-fold-row]").last()).toHaveCSS("opacity", "1")
    expect(errors).toEqual([])
  })

  test.describe("under reduced motion", () => {
    test.use({ reducedMotion: "reduce" })

    test("opens at once", async ({ page }) => {
      const demo = await open(page, "fold-report")
      await demo.getByRole("button", { name: /Fix/ }).click()
      await expect(demo.getByRole("region", { name: /Fix/ }).locator("[data-fold-row]").first()).toBeVisible({ timeout: 100 })
      expect(await demo.getByRole("region", { name: /Fix/ }).evaluate((element) => element.style.height)).toBe("")
    })
  })
})

test.describe("cube tabs", () => {
  const rotationOf = (page: Page) => page.getByTestId("cube").getAttribute("data-rotation").then(Number)
  const shownRotation = (page: Page) => rotation(page, "[data-testid=cube]", "rotateY")

  test("arrow keys move between tabs, and the cube lands on a multiple of 90", async ({ page }) => {
    const errors = watchErrors(page)
    const demo = await open(page, "cube-tabs")
    const first = demo.getByRole("tab", { name: "Latency" })
    await first.focus()
    await page.keyboard.press("ArrowRight")
    const cost = demo.getByRole("tab", { name: "Cost" })
    await expect(cost).toBeFocused()
    await expect(cost).toHaveAttribute("aria-selected", "true")
    const panel = await cost.getAttribute("aria-controls")
    await expect(page.locator(`[id="${panel}"]`)).toContainText("$212")
    expect(Math.abs((await rotationOf(page)) % 90)).toBe(0)
    await expect.poll(() => shownRotation(page), { timeout: 4000 }).toBe(await rotationOf(page))
    expect(errors).toEqual([])
  })

  test("first to last turns one face back, not three forward", async ({ page }) => {
    const demo = await open(page, "cube-tabs")
    await demo.getByRole("tab", { name: "Volume" }).click()
    expect(await rotationOf(page)).toBe(90)
    await expect.poll(() => shownRotation(page), { timeout: 4000 }).toBe(90)
  })

  test("every tab fits at 390px", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Phone width only")
    const demo = await open(page, "cube-tabs")
    await expect(demo.getByRole("tab", { name: "Volume" })).toBeInViewport({ ratio: 1 })
  })

  test("faces turned away can't be reached by keyboard", async ({ page }) => {
    const demo = await open(page, "cube-tabs")
    await expect(demo.getByRole("tabpanel")).toHaveCount(1)
    await expect(demo.getByRole("tabpanel")).toContainText("840")
  })

  test.describe("under reduced motion", () => {
    test.use({ reducedMotion: "reduce" })

    test("jumps to the face with no turn", async ({ page }) => {
      const demo = await open(page, "cube-tabs")
      await demo.getByRole("tab", { name: "Quality" }).click()
      expect(Math.abs(await shownRotation(page))).toBe(180)
    })
  })
})

test.describe("tilt card", () => {
  test("tilts toward the pointer and settles back", async ({ page, isMobile }) => {
    test.skip(isMobile, "Hover needs a mouse")
    const errors = watchErrors(page)
    const demo = await open(page, "tilt-card")
    const card = demo.getByTestId("tilt-card")
    const box = await card.boundingBox()
    if (!box) throw new Error("No box")
    await page.mouse.move(box.x + box.width - 10, box.y + 10)
    await page.mouse.move(box.x + box.width - 5, box.y + 12)
    await expect.poll(() => card.evaluate((element) => element.style.transform)).toContain("rotate")
    await expect(demo.locator("[data-part=glare]")).toBeAttached()
    await page.mouse.move(0, 0)
    await expect.poll(() => card.evaluate((element) => element.style.transform), { timeout: 4000 }).toBe("none")
    expect(errors).toEqual([])
  })

  test("the yearly switch rolls the price", async ({ page }) => {
    const errors = watchErrors(page)
    const demo = await open(page, "tilt-card")
    await expect(demo.getByTestId("tilt-price").locator(".sr-only")).toHaveText("₹2,400")
    await demo.getByRole("switch", { name: "Bill yearly · save 17%" }).click()
    await expect(demo.getByTestId("tilt-price").locator(".sr-only")).toHaveText("₹1,990")
    expect(errors).toEqual([])
  })

  test("stays flat on touch", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Touch only")
    const demo = await open(page, "tilt-card")
    const card = demo.getByTestId("tilt-card")
    await card.tap()
    expect(await card.evaluate((element) => getComputedStyle(element).transform)).toBe("none")
    await expect(demo.locator("[data-part=glare]")).toHaveCount(0)
  })

  for (const skin of ["ledger", "terminal", "folio"] as const) {
    for (const theme of ["light", "dark"] as const) {
      test(`highlight token resolves in ${skin} ${theme}`, async ({ page }) => {
        await page.addInitScript(
          (appearance) => {
            localStorage.setItem("spotcheck-skin", appearance.skin)
            localStorage.setItem("spotcheck-theme", appearance.theme)
          },
          { skin, theme },
        )
        const demo = await open(page, "tilt-card")
        const color = await demo.getByTestId("tilt-card").evaluate((element) => {
          const probe = document.createElement("span")
          probe.style.color = "var(--highlight)"
          element.appendChild(probe)
          const value = getComputedStyle(probe).color
          probe.remove()
          return value
        })
        expect(color).toBe(theme === "light" ? "rgb(255, 255, 255)" : "rgb(232, 234, 229)")
      })
    }
  }

  test.describe("under reduced motion", () => {
    test.use({ reducedMotion: "reduce" })

    test("stays flat", async ({ page, isMobile }) => {
      test.skip(isMobile, "Hover needs a mouse")
      const demo = await open(page, "tilt-card")
      const card = demo.getByTestId("tilt-card")
      await card.hover()
      await page.waitForTimeout(300)
      expect(await card.evaluate((element) => getComputedStyle(element).transform)).toBe("none")
    })
  })
})

const PIECES = ["linked-bars", "embedding-space", "drum-picker", "coverflow", "fold-report", "cube-tabs", "tilt-card"]

for (const slug of PIECES) {
  for (const skin of ["ledger", "terminal", "folio"] as const) {
    for (const theme of ["light", "dark"] as const) {
      test(`${slug} passes axe with no sideways scroll in ${skin} ${theme}`, async ({ page }) => {
        await page.addInitScript(
          (appearance) => {
            localStorage.setItem("spotcheck-skin", appearance.skin)
            localStorage.setItem("spotcheck-theme", appearance.theme)
          },
          { skin, theme },
        )
        await open(page, slug)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        expect(overflow).toBeLessThanOrEqual(0)
        const { violations } = await new AxeBuilder({ page }).include("[data-testid=demo]").analyze()
        const serious = violations.filter((v) => v.impact === "serious" || v.impact === "critical")
        expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(" | ")}`)).toEqual([])
      })
    }
  }
}
