import { copiedComponents, countCopy, isCountedPage } from "@/lib/counts"
import registry from "@/registry.json"

// Receives a beacon from the site's Copy buttons and adds one to a private count. Nothing is
// returned and nothing on the site reads it back.
const known = new Set(registry.items.map((item) => item.name))
const MAX_TEXT = 4000

export async function POST(request: Request) {
  let body: { text?: unknown; page?: unknown }
  try {
    body = JSON.parse(await request.text())
  } catch {
    return new Response(null, { status: 400 })
  }
  const { text, page } = body
  if (typeof text !== "string" || typeof page !== "string" || text.length > MAX_TEXT || !isCountedPage(page)) {
    return new Response(null, { status: 400 })
  }
  await countCopy(copiedComponents(text, known), page)
  return new Response(null, { status: 204 })
}
