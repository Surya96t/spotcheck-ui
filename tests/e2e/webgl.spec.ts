import { expect, test, type Page } from "@playwright/test"

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
  await expect(demo.locator("canvas")).toBeVisible()
  return demo
}

async function drawsSomething(page: Page, slug: string) {
  const demo = await open(page, slug)
  await page.waitForTimeout(600)
  return demo.locator("canvas").screenshot()
}

/** Holds a colour-counting canvas up to the WebGL one, so a blank frame fails. */
async function paintedPixels(page: Page) {
  const shot = await page.getByTestId("demo").locator("canvas").screenshot()
  return page.evaluate(async (png) => {
    const image = await createImageBitmap(await (await fetch(`data:image/png;base64,${png}`)).blob())
    const canvas = document.createElement("canvas")
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) return 0
    context.drawImage(image, 0, 0)
    const { data } = context.getImageData(0, 0, image.width, image.height)
    const [r, g, b] = [data[0], data[1], data[2]]
    let painted = 0
    for (let index = 0; index < data.length; index += 4) {
      if (Math.abs((data[index] ?? 0) - (r ?? 0)) + Math.abs((data[index + 1] ?? 0) - (g ?? 0)) + Math.abs((data[index + 2] ?? 0) - (b ?? 0)) > 30) painted++
    }
    return painted
  }, shot.toString("base64"))
}

test.describe("gl-stage", () => {
  test("/components mounts canvases near the viewport and scrolls end to end with no errors", async ({ page }) => {
    const errors = watchErrors(page)
    await page.goto("/components")
    await page.waitForLoadState("networkidle")
    const height = await page.evaluate(() => document.documentElement.scrollHeight)
    await expect(page.locator("canvas")).toHaveCount(0)
    const counts: number[] = []
    for (let top = 0; top < height; top += 700) {
      await page.evaluate((y) => window.scrollTo(0, y), top)
      await page.waitForTimeout(120)
      counts.push(await page.locator("canvas").count())
    }
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(300)
    expect(Math.max(...counts)).toBe(3)
    expect(counts.at(-1)).toBe(0)
    await expect(page.locator("canvas")).toHaveCount(0)
    expect(errors).toEqual([])
  })

  test("shows the description when the browser drops the canvas", async ({ page }) => {
    const errors = watchErrors(page)
    const demo = await open(page, "bar-terrain")
    await page.waitForTimeout(300)
    await demo.locator("canvas").evaluate((canvas) => {
      ;(canvas as HTMLCanvasElement).getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext()
    })
    await expect(demo.locator("canvas")).toHaveCount(0)
    await expect(demo.getByText("3D bar field that rises under the pointer")).toBeVisible()
    expect(errors).toEqual([])
  })

  test("shows the description when WebGL isn't available", async ({ page }) => {
    const errors = watchErrors(page)
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...rest: unknown[]) {
        return kind.startsWith("webgl") ? null : original.call(this, kind as "2d", ...(rest as []))
      } as typeof original
    })
    await page.goto("/components/bar-terrain")
    await page.waitForLoadState("networkidle")
    const demo = page.getByTestId("demo")
    await expect(demo.getByText("3D bar field that rises under the pointer")).toBeVisible()
    await expect(demo.locator("canvas")).toHaveCount(0)
    expect(errors).toEqual([])
  })
})

test.describe("linked bars", () => {
  test("hovering or focusing a row raises its bars in the accent", async ({ page, isMobile }) => {
    test.skip(isMobile, "Hover needs a mouse")
    const errors = watchErrors(page)
    const demo = await open(page, "linked-bars")
    const row = demo.getByRole("row", { name: /Singapore/ })
    await page.waitForTimeout(600)
    const before = await demo.locator("canvas").screenshot()
    await row.hover()
    await expect(row).toHaveAttribute("data-active", "true")
    await page.waitForTimeout(600)
    const after = await demo.locator("canvas").screenshot()
    expect(before.equals(after)).toBe(false)

    await page.mouse.move(0, 0)
    await expect(row).not.toHaveAttribute("data-active")
    await demo.getByRole("button", { name: "Oregon" }).focus()
    await expect(demo.getByRole("row", { name: /Oregon/ })).toHaveAttribute("data-active", "true")
    expect(errors).toEqual([])
  })

  test("hovering a bar highlights its row and shows a tooltip", async ({ page, isMobile }) => {
    test.skip(isMobile, "Hover needs a mouse")
    const errors = watchErrors(page)
    const demo = await open(page, "linked-bars")
    await page.waitForTimeout(800)
    const box = await demo.getByTestId("linked-bars-chart").boundingBox()
    if (!box) throw new Error("No chart box")
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    await page.mouse.move(box.x + box.width / 2 + 2, box.y + box.height / 2 + 1)
    const tip = demo.getByTestId("linked-bars-tip")
    await expect(tip).toBeVisible()
    await expect(tip).toHaveText(/^\w+ · W\d · [\d.]+$/)
    await expect(demo.locator("tbody tr[data-active]")).toHaveCount(1)
    const region = (await tip.textContent())?.split(" · ")[0] ?? ""
    await expect(demo.locator("tbody tr[data-active] th")).toHaveText(region)
    expect(errors).toEqual([])
  })

  test("tapping a row or a bar sets the highlight on touch", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Touch only")
    const errors = watchErrors(page)
    const demo = await open(page, "linked-bars")
    await page.waitForTimeout(800)
    await demo.getByRole("button", { name: "Frankfurt" }).tap()
    await expect(demo.getByRole("row", { name: /Frankfurt/ })).toHaveAttribute("data-active", "true")
    await demo.getByRole("button", { name: "Frankfurt" }).tap()
    await expect(demo.locator("tbody tr[data-active]")).toHaveCount(0)

    const box = await demo.getByTestId("linked-bars-chart").boundingBox()
    if (!box) throw new Error("No chart box")
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2)
    await expect(demo.locator("tbody tr[data-active]")).toHaveCount(1)
    await expect(demo.getByTestId("linked-bars-tip")).toBeVisible()
    expect(errors).toEqual([])
  })

  test("stacks into one column at 390px", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Phone width only")
    const demo = await open(page, "linked-bars")
    const table = await demo.getByRole("table").boundingBox()
    const chart = await demo.getByTestId("linked-bars-chart").boundingBox()
    if (!table || !chart) throw new Error("No boxes")
    expect(table.y).toBeGreaterThanOrEqual(chart.y + chart.height - 1)
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0)
  })

  test("draws its bars", async ({ page }) => {
    await drawsSomething(page, "linked-bars")
    await expect.poll(() => paintedPixels(page)).toBeGreaterThan(1000)
  })
})

test.describe("embedding space", () => {
  test("choosing a query updates the marker, the lines and the list together", async ({ page }) => {
    const errors = watchErrors(page)
    const demo = await open(page, "embedding-space")
    const list = demo.getByRole("list", { name: "Top 6 neighbours" })
    await expect(list.getByRole("listitem")).toHaveCount(6)
    const before = await list.textContent()

    await demo.getByRole("button", { name: "Where is my parcel?" }).click()
    await expect(demo.getByRole("button", { name: "Where is my parcel?" })).toHaveAttribute("aria-pressed", "true")
    await expect(list).not.toHaveText(before ?? "")
    await expect(demo.getByRole("status")).toHaveText(/Where is my parcel\?/)
    expect(errors).toEqual([])
  })

  test("colours follow the theme", async ({ page }) => {
    await drawsSomething(page, "embedding-space")
    expect(await paintedPixels(page)).toBeGreaterThan(100)
  })

  test("drag rotates the cloud", async ({ page, isMobile }) => {
    test.skip(isMobile, "Uses the mouse")
    const demo = await open(page, "embedding-space")
    const box = await demo.getByTestId("embedding-space-cloud").boundingBox()
    if (!box) throw new Error("No box")
    await page.mouse.move(box.x + 100, box.y + 100)
    await page.mouse.down()
    await page.waitForTimeout(150)
    const before = await demo.locator("canvas").screenshot()
    await page.mouse.move(box.x + 300, box.y + 100, { steps: 6 })
    await page.waitForTimeout(150)
    const after = await demo.locator("canvas").screenshot()
    await page.mouse.up()
    expect(before.equals(after)).toBe(false)
  })

  test("leaves vertical page scroll working on phones", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Touch only")
    const demo = await open(page, "embedding-space")
    await expect(demo.getByTestId("embedding-space-cloud")).toHaveCSS("touch-action", "pan-y")
  })

  test.describe("under reduced motion", () => {
    test.use({ reducedMotion: "reduce" })

    test("holds still, and redraws once for a new query", async ({ page }) => {
      const demo = await open(page, "embedding-space")
      await page.waitForTimeout(500)
      const first = await demo.locator("canvas").screenshot()
      await page.waitForTimeout(500)
      expect(first.equals(await demo.locator("canvas").screenshot())).toBe(true)

      await demo.getByRole("button", { name: "I forgot my password" }).click()
      await page.waitForTimeout(300)
      const next = await demo.locator("canvas").screenshot()
      expect(first.equals(next)).toBe(false)
      await page.waitForTimeout(400)
      expect(next.equals(await demo.locator("canvas").screenshot())).toBe(true)
    })
  })
})
