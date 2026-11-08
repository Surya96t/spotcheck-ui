import { Redis } from "@upstash/redis"

// Counts fetches of the registry files under /r/, which is what `npx shadcn add` downloads.
// Only counts are stored: no IP address, user agent or anything else about who fetched.
// Without the Upstash variables (local dev, CI, previews) this does nothing.

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
const redis = url && token ? new Redis({ url, token }) : null

const DAY_KEY_TTL = 60 * 60 * 24 * 400

export function componentFromPath(pathname: string): string | null {
  return /^\/r\/([a-z0-9-]+)\.json$/.exec(pathname)?.[1] ?? null
}

// Browsers send a user agent starting "Mozilla/". The shadcn CLI and other tools don't.
export function fetchKind(userAgent: string | null): "browser" | "cli" {
  return userAgent?.startsWith("Mozilla/") ? "browser" : "cli"
}

export async function countRegistryFetch(name: string, userAgent: string | null, now = new Date()) {
  if (!redis) return
  const kind = fetchKind(userAgent)
  const dayKey = `registry:${kind}:${now.toISOString().slice(0, 10)}`
  try {
    await redis
      .pipeline()
      .hincrby(`registry:${kind}`, name, 1)
      .hincrby(dayKey, name, 1)
      .expire(dayKey, DAY_KEY_TTL)
      .exec()
  } catch {
    // A missed count must never break an install.
  }
}
