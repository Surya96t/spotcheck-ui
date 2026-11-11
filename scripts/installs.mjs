// Prints Surya's private counts from the Upstash database the site counts into (see lib/counts.ts):
// downloads of each component's registry file, and Copy clicks on the site.
// Get the variables first with `vercel env pull .env.counts --environment=production`, then run
// `pnpm installs`. They live in their own file because Next.js loads .env.local, and a local dev
// server holding them would add to the real counts.
// Pass a number of days to see recent ones only: `pnpm installs 7`.
import { Redis } from "@upstash/redis"

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
if (!url || !token) {
  console.error("No Upstash variables. Run `vercel env pull .env.counts --environment=production` first.")
  process.exit(1)
}
const redis = new Redis({ url, token })
const days = Number(process.argv[2]) || 0

async function totals(key) {
  if (!days) return (await redis.hgetall(key)) ?? {}
  const sum = {}
  for (let i = 0; i < days; i++) {
    const day = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10)
    for (const [name, n] of Object.entries((await redis.hgetall(`${key}:${day}`)) ?? {})) {
      sum[name] = (sum[name] ?? 0) + Number(n)
    }
  }
  return sum
}

function table(columns, label) {
  const names = [...new Set(columns.flatMap(([, counts]) => Object.keys(counts)))]
  const rows = names
    .map((name) => Object.fromEntries([[label, name], ...columns.map(([title, counts]) => [title, Number(counts[name] ?? 0)])]))
    .sort((a, b) => columns.reduce((diff, [title]) => diff || b[title] - a[title], 0))
  if (rows.length === 0) console.log("  Nothing yet.\n")
  else console.table(rows)
}

console.log(days ? `Last ${days} day(s), counted in UTC days.\n` : "All time.\n")

console.log("Downloads: cli = `npx shadcn add` and other tools, browser = someone opened the JSON.")
console.log("Installing one component also downloads the files it depends on.")
table([["cli", await totals("registry:cli")], ["browser", await totals("registry:browser")]], "component")

console.log("Copy clicks on an install command, per component:")
table([["copies", await totals("copies:install")]], "component")

console.log("Copy clicks on a code block, per page:")
table([["copies", await totals("copies:code")]], "page")
