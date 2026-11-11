import { readdirSync } from "node:fs"

import { expect, test } from "@playwright/test"

const slugs = readdirSync("content/components").map((file) => file.replace(/\.mdx$/, ""))

/* Stands in for a host app whose own font is not Spotcheck's. Any text that still renders in it
   is text a component left to the host, which is what this test is here to catch. */
const HOST_FONT = "HostAppFont"

/* Components whose content opens in a layer outside the demo, and what opens it. */
const OPENERS: Record<string, { role: "button" | "combobox"; hover?: boolean }> = {
  "dialog": { role: "button" },
  "sheet": { role: "button" },
  "popover": { role: "button" },
  "dropdown-menu": { role: "button" },
  "select": { role: "combobox" },
  "combobox": { role: "combobox" },
  "date-picker": { role: "button" },
  "command-palette": { role: "button" },
  "toast": { role: "button" },
  "tooltip": { role: "button", hover: true },
}

test.describe("components bring their own fonts", () => {
  test.skip(({ isMobile }) => isMobile, "Fonts don't depend on the viewport")

  for (const slug of slugs) {
    test(slug, async ({ page }) => {
      await page.goto(`/components/${slug}`)
      await page.waitForLoadState("networkidle")
      await page.addStyleTag({ content: `html { font-family: ${HOST_FONT}, serif !important; }` })

      const demo = page.getByTestId("demo")
      const opener = OPENERS[slug]
      if (opener) {
        const trigger = demo.getByRole(opener.role).first()
        if (opener.hover) await trigger.hover()
        else await trigger.click()
        await page.waitForTimeout(400)
      }

      const inherited = await page.evaluate((hostFont) => {
        const roots = [
          document.querySelector("[data-testid=demo]"),
          ...document.querySelectorAll("body > [data-base-ui-portal], body > [role=dialog], body > [role=presentation]"),
        ].filter((root): root is Element => root !== null)
        const found = new Set<string>()
        for (const root of roots) {
          const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const text = node.textContent?.trim()
            const element = node.parentElement
            if (!text || !element) continue
            if (getComputedStyle(element).fontFamily.startsWith(hostFont)) found.add(text.slice(0, 40))
          }
          for (const field of root.querySelectorAll("input, textarea, select, button")) {
            // Base UI keeps a hidden input for form posts, which nobody sees.
            if (field.getAttribute("aria-hidden") === "true" || field.getAttribute("type") === "hidden") continue
            if (getComputedStyle(field).fontFamily.startsWith(hostFont)) {
              found.add(`<${field.tagName.toLowerCase()}> ${(field.getAttribute("aria-label") ?? field.getAttribute("placeholder") ?? "").slice(0, 30)}`)
            }
          }
        }
        return [...found]
      }, HOST_FONT)

      expect(inherited, "text left in the host app's font").toEqual([])
    })
  }
})
