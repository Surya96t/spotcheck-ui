export function setAppearance(key: "skin" | "theme", option: string) {
  document.documentElement.setAttribute(`data-${key}`, option)
  try {
    localStorage.setItem(`spotcheck-${key}`, option)
  } catch {
    // Storage can be blocked. The choice still applies for this page.
  }
}
