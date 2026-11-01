// The Phase 0 exit check: install components over HTTP into a brand-new shadcn app, build it,
// and assert that Ledger didn't disturb the app's own theme.
import { spawn } from "node:child_process"
import { existsSync, mkdtempSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import { extname, join, resolve } from "node:path"
import { chromium } from "@playwright/test"

const NEXT_VERSION = "16.4.3"
const SHADCN_VERSION = "4.23.0"
const PORT = 4310
const APP_PORT = 4320
const COMPONENTS = ["roll-number", "detent-slider", "bar-terrain", "command-palette"]
const REGISTRY_URL = process.env.LEDGER_REGISTRY_URL?.replace(/\/$/, "") ?? `http://127.0.0.1:${PORT}`
const serveLocally = !process.env.LEDGER_REGISTRY_URL
const ROOT = process.cwd()

// Asynchronous, because the registry server below runs in this same process.
function run(command, args, cwd) {
  console.log(`\n$ ${command} ${args.join(" ")}`)
  return new Promise((done, fail) => {
    spawn(command, args, { cwd, stdio: "inherit", env: { ...process.env, CI: "1", LEDGER_REGISTRY_URL: REGISTRY_URL } })
      .on("error", fail)
      .on("exit", (code) => (code === 0 ? done() : fail(new Error(`${command} exited with ${code}`))))
  })
}

function serveRegistry() {
  const directory = resolve(ROOT, "public")
  const server = createServer((request, response) => {
    const file = join(directory, new URL(request.url, "http://x").pathname)
    if (!file.startsWith(directory) || !existsSync(file) || !statSync(file).isFile()) {
      response.writeHead(404).end()
      return
    }
    response.writeHead(200, { "content-type": extname(file) === ".json" ? "application/json" : "text/plain" })
    response.end(readFileSync(file))
  })
  return new Promise((done) => server.listen(PORT, "127.0.0.1", () => done(server)))
}

function assertIncludes(text, expected, message) {
  if (!text.includes(expected)) throw new Error(`Install test failed: ${message}`)
  console.log(`ok - ${message}`)
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) throw new Error(`Install test failed: ${message} (got ${actual}, wanted ${expected})`)
  console.log(`ok - ${message}`)
}

/** A build can't prove the tokens work, so this reads real colours from the running app. */
async function checkInBrowser(app) {
  const server = spawn("pnpm", ["exec", "next", "start", "-p", String(APP_PORT)], { cwd: app, stdio: "ignore", detached: true })
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] })
  try {
    const page = await browser.newPage()
    const errors = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
    for (let attempt = 0; attempt < 50; attempt++) {
      if (await fetch(`http://127.0.0.1:${APP_PORT}`).then(() => true, () => false)) break
      await new Promise((done) => setTimeout(done, 200))
    }
    await page.goto(`http://127.0.0.1:${APP_PORT}`)
    await page.waitForSelector("canvas")

    const background = () => page.locator("#ledger").evaluate((el) => getComputedStyle(el).backgroundColor)
    const LIGHT = "rgb(237, 239, 236)"
    const DARK = "rgb(12, 13, 15)"
    assertEqual(await background(), LIGHT, "tokens are light by default")
    await page.click("#toggle")
    assertEqual(await background(), DARK, ".dark on an inner element switches the tokens")
    await page.click("#toggle")
    await page.evaluate(() => document.documentElement.classList.add("dark"))
    assertEqual(await background(), DARK, ".dark on <html> switches the tokens")
    await page.evaluate(() => {
      document.documentElement.classList.remove("dark")
      document.querySelector("#ledger").dataset.theme = "dark"
    })
    assertEqual(await background(), DARK, "data-theme on an inner element switches the tokens")

    await page.keyboard.press("Control+k")
    await page.getByRole("combobox").waitFor()
    assertEqual(await page.getByRole("option").count(), 1, "the command palette opens with its hotkey")
    await page.keyboard.press("Escape")

    const stretch = await page.getByTestId("roll").evaluate((el) => getComputedStyle(el).fontStretch)
    assertEqual(stretch, "62%", "display type uses the condensed width")
    const loaded = await page.evaluate(async () => {
      await document.fonts.ready
      return [...document.fonts].some((font) => font.family.includes("Archivo") && font.status === "loaded")
    })
    assertEqual(loaded, true, "Archivo loaded in the installed app")
    assertEqual(errors.length, 0, "no console errors")
  } finally {
    await browser.close()
    process.kill(-server.pid)
  }
}

function assertExcludes(text, unexpected, message) {
  if (text.includes(unexpected)) throw new Error(`Install test failed: ${message}`)
  console.log(`ok - ${message}`)
}

const server = serveLocally ? await serveRegistry() : null

try {
  if (serveLocally) await run("node", ["scripts/build-registry.mjs"], ROOT)

  const workspace = mkdtempSync(join(tmpdir(), "ledger-install-"))
  const app = join(workspace, "app")
  await run(
    "pnpm",
    ["dlx", `create-next-app@${NEXT_VERSION}`, app, "--ts", "--tailwind", "--app", "--eslint", "--no-src-dir",
      "--import-alias", "@/*", "--use-pnpm", "--turbopack", "--disable-git", "--yes"],
    workspace,
  )
  await run("pnpm", ["dlx", `shadcn@${SHADCN_VERSION}`, "init", "--defaults", "--yes", "--force"], app)

  const cssBefore = readFileSync(join(app, "app/globals.css"), "utf8")
  const shadcnAccent = cssBefore.match(/\n\s*--accent:\s*[^;]+;/)?.[0]
  if (!shadcnAccent) throw new Error("Install test failed: the clean app has no shadcn --accent token")

  const urls = COMPONENTS.map((name) => `${REGISTRY_URL}/r/${name}.json`)
  await run("pnpm", ["dlx", `shadcn@${SHADCN_VERSION}`, "add", ...urls, "--yes", "--overwrite"], app)

  const css = readFileSync(join(app, "app/globals.css"), "utf8")
  assertIncludes(css, "--paper:", "tokens were added to the app's stylesheet")
  assertIncludes(css, "@fontsource-variable/archivo/wdth.css", "the width axis of Archivo was imported")
  assertIncludes(css, shadcnAccent, "the app's own --accent is unchanged")
  for (const name of COMPONENTS) {
    assertIncludes(readFileSync(join(app, `components/ledger/${name}.tsx`), "utf8"), "export", `${name} installed`)
  }
  const terrain = readFileSync(join(app, "components/ledger/bar-terrain.tsx"), "utf8")
  assertIncludes(terrain, '"@/hooks/use-gl-palette"', "registry imports were rewritten to the app's hooks")
  assertExcludes(terrain, "@/registry/", "no registry paths remain in installed code")

  writeFileSync(
    join(app, "app/page.tsx"),
    `"use client"
import { useState } from "react"
import { BarTerrain } from "@/components/ledger/bar-terrain"
import { CommandPalette } from "@/components/ledger/command-palette"
import { DetentSlider } from "@/components/ledger/detent-slider"
import { RollNumber } from "@/components/ledger/roll-number"

export default function Page() {
  const [dark, setDark] = useState(false)
  const [palette, setPalette] = useState(false)
  return (
    <main id="ledger" className={dark ? "dark" : ""} style={{ background: "var(--paper)", color: "var(--ink)", padding: 24 }}>
      <button id="toggle" onClick={() => setDark(!dark)}>Toggle dark</button>
      <RollNumber data-testid="roll" value={1284903} style={{ fontSize: 64 }} />
      <DetentSlider label="Temperature" min={0} max={2} step={0.2} defaultValue={0.8} />
      <BarTerrain className="h-80" />
      <CommandPalette groups={[{ label: "Actions", commands: [{ id: "a", label: "Run it", onSelect: () => {} }] }]} open={palette} onOpenChange={setPalette} />
    </main>
  )
}
`,
  )
  await run("pnpm", ["exec", "next", "build"], app)
  await checkInBrowser(app)
  console.log(`\nInstalled, built and checked in ${app}`)
} finally {
  server?.close()
}
