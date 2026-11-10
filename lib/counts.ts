import { Redis } from "@upstash/redis"

// Private counts for Surya, kept in Upstash Redis and read with `pnpm installs`. Nothing on the
// site shows them. Only counts are stored: no IP address, user agent or anything else about who.
// Without the Upstash variables (local dev, CI, previews) every function here does nothing.
//
// - registry:{cli|browser}        fetches of /r/{name}.json, which is what `npx shadcn add` downloads
// - copies:install                Copy clicks on an install command, per component
// - copies:code                   Copy clicks on a code block, per page
// Each also has a per-day key, `{key}:{YYYY-MM-DD}` in UTC, kept for 400 days.

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
const redis = url && token ? new Redis({ url, token }) : null

const DAY_KEY_TTL = 60 * 60 * 24 * 400

async function bump(key: string, fields: string[], now: Date) {
  if (!redis || fields.length === 0) return
  const dayKey = `${key}:${now.toISOString().slice(0, 10)}`
  const pipeline = redis.pipeline()
  for (const field of fields) pipeline.hincrby(key, field, 1).hincrby(dayKey, field, 1)
  pipeline.expire(dayKey, DAY_KEY_TTL)
  try {
    await pipeline.exec()
  } catch {
    // A missed count must never break an install or a copy.
  }
}

export function componentFromPath(pathname: string): string | null {
  return /^\/r\/([a-z0-9-]+)\.json$/.exec(pathname)?.[1] ?? null
}

// Browsers send a user agent starting "Mozilla/". The shadcn CLI and other tools don't.
export function fetchKind(userAgent: string | null): "browser" | "cli" {
  return userAgent?.startsWith("Mozilla/") ? "browser" : "cli"
}

export function countRegistryFetch(name: string, userAgent: string | null, now = new Date()) {
  return bump(`registry:${fetchKind(userAgent)}`, [name], now)
}

/** The registry components named in copied text, such as an install command. */
export function copiedComponents(text: string, known: ReadonlySet<string>): string[] {
  const names = [...text.matchAll(/\/r\/([a-z0-9-]+)\.json/g)].map((match) => match[1] ?? "")
  return [...new Set(names)].filter((name) => known.has(name))
}

/** Only the site's own pages are counted, so the hash can't fill with made-up paths. */
export function isCountedPage(page: string): boolean {
  return page.length <= 100 && /^\/((components|docs|field-notes)(\/[a-z0-9-]+)*)?$/.test(page)
}

/** An install command counts once per component in it; any other copy counts against its page. */
export function countCopy(components: string[], page: string, now = new Date()) {
  return components.length > 0 ? bump("copies:install", components, now) : bump("copies:code", [page], now)
}
