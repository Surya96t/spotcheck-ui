"use client"

import * as React from "react"

export function useInView<T extends Element>(ref: React.RefObject<T | null>, rootMargin = "0px") {
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => setInView(entries.some((entry) => entry.isIntersecting)),
      { rootMargin },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return inView
}
