function resolveUrl() {
  if (process.env.SPOTCHECK_REGISTRY_URL) return process.env.SPOTCHECK_REGISTRY_URL.replace(/\/$/, "")
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  return vercel ? `https://${vercel}` : "http://localhost:3000"
}

export const siteUrl = resolveUrl()

export const repoUrl = "https://github.com/Surya96t/spotcheck-ui"
// The repo is private until launch, and GitHub links would 404 for visitors. Flip this when it goes public.
export const repoIsPublic = false

export function installCommand(name: string) {
  return `npx shadcn@latest add ${siteUrl}/r/${name}.json`
}
