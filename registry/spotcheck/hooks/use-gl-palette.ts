"use client"

import * as React from "react"

const WATCHED_ATTRIBUTES = ["class", "style", "data-theme", "data-skin"]

/** Resolves any CSS colour (oklch, color-mix, light-dark) to a hex string that three.js can read. */
export function toHex(cssColor: string) {
  const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true })
  if (!context) return "#000000"
  context.fillStyle = cssColor
  context.fillRect(0, 0, 1, 1)
  const [r = 0, g = 0, b = 0] = context.getImageData(0, 0, 1, 1).data
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`
}

function readTokens<T extends string>(element: Element, tokens: readonly T[]) {
  // A probe inherits the element's scope, so nested data-theme and data-skin values are honoured.
  const probe = document.createElement("span")
  probe.hidden = true
  element.appendChild(probe)
  const palette = {} as Record<T, string>
  for (const token of tokens) {
    probe.style.color = `var(${token})`
    palette[token] = toHex(getComputedStyle(probe).color)
  }
  probe.remove()
  return palette
}

/** Reads CSS colour tokens for a WebGL scene and re-reads them when the theme or skin changes. */
export function useGlPalette<T extends string>(
  ref: React.RefObject<Element | null>,
  tokens: readonly T[],
) {
  const [palette, setPalette] = React.useState<Record<T, string> | null>(null)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => setPalette(readTokens(element, tokens))
    update()

    const observer = new MutationObserver(update)
    for (let node: Element | null = element.parentElement; node; node = node.parentElement) {
      observer.observe(node, { attributes: true, attributeFilter: WATCHED_ATTRIBUTES })
    }
    const scheme = window.matchMedia("(prefers-color-scheme: dark)")
    scheme.addEventListener("change", update)

    return () => {
      observer.disconnect()
      scheme.removeEventListener("change", update)
    }
  }, [ref, tokens])

  return palette
}
