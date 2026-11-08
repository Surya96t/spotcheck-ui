// Prints how often each registry file was fetched, from the Upstash database the site counts into.
// Get the variables first with `vercel env pull .env.local`, then run `pnpm installs`.
// Pass a number of days to see recent ones only: `pnpm installs 7`.
import { Redis } from "@upstash/redis"

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
if (!url || !token) {
  console.error("No Upstash variables. Run `vercel env pull .env.local` first.")
  process.exit(1)
}
const redis = new Redis({ url, token })
const days = Number(process.argv[2]) || 0

async function totals(kind) {
  if (!days) return (await redis.hgetall(`registry:${kind}`)) ?? {}
  const sum = {}
  for (let i = 0; i < days; i++) {
    const day = new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10)
    for (const [name, n] of Object.entries((await redis.hgetall(`registry:${kind}:${day}`)) ?? {})) {
      sum[name] = (sum[name] ?? 0) + Number(n)
    }
  }
  return sum
}

const cli = await totals("cli")
const browser = await totals("browser")
const names = [...new Set([...Object.keys(cli), ...Object.keys(browser)])]
const rows = names
  .map((name) => ({ component: name, cli: Number(cli[name] ?? 0), browser: Number(browser[name] ?? 0) }))
  .sort((a, b) => b.cli - a.cli || b.browser - a.browser)

console.log(days ? `Last ${days} day(s), India and UTC days may differ by one.` : "All time.")
console.log("cli = the shadcn CLI and other tools. browser = someone opened the JSON in a browser.\n")
console.table(rows)
