function resolveUrl() {
  if (process.env.LEDGER_REGISTRY_URL) return process.env.LEDGER_REGISTRY_URL.replace(/\/$/, "")
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  return vercel ? `https://${vercel}` : "http://localhost:3000"
}

export const siteUrl = resolveUrl()

export function installCommand(name: string) {
  return `npx shadcn@latest add ${siteUrl}/r/${name}.json`
}
