"use client"

import * as React from "react"

const SETTLE_MS = 2500

/** Demos load as they near the screen and push the page down, so keep a jump on its target until they settle. */
export function HoldAnchor() {
  React.useEffect(() => {
    let release = () => {}

    const hold = () => {
      release()
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
      if (!target) return
      const place = () => target.scrollIntoView()
      const resizes = new ResizeObserver(place)
      const stop = () => release()
      resizes.observe(document.body)
      const timer = setTimeout(stop, SETTLE_MS)
      for (const type of ["wheel", "touchstart", "keydown"]) window.addEventListener(type, stop, { once: true })
      release = () => {
        resizes.disconnect()
        clearTimeout(timer)
        for (const type of ["wheel", "touchstart", "keydown"]) window.removeEventListener(type, stop)
        release = () => {}
      }
    }

    hold()
    window.addEventListener("hashchange", hold)
    return () => {
      release()
      window.removeEventListener("hashchange", hold)
    }
  }, [])

  return null
}
