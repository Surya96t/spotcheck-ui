import { createUIMessageStream, createUIMessageStreamResponse } from "ai"

// A real AI SDK stream with scripted text, so the demos need no model or API key.
const ANSWER =
  "Refunds over 30 days need **manager approval** [1]. Partial refunds are allowed when the order shipped in parts [2], and store credit is issued instantly while card refunds take 5 to 7 business days [3]."

const SOURCES = [
  { sourceId: "refund-policy", url: "https://example.com/refund-policy", title: "refund-policy.md §2" },
  { sourceId: "split-shipments", url: "https://example.com/split-shipments", title: "fulfilment/split.md" },
  { sourceId: "payments-faq", url: "https://example.com/payments-faq", title: "payments-faq.pdf p.4" },
]

const TOKEN_DELAY_MS = 22

const wait = (ms: number) => new Promise((done) => setTimeout(done, ms))

export const dynamic = "force-dynamic"

export async function POST() {
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      writer.write({ type: "start", messageId: crypto.randomUUID() })
      writer.write({ type: "text-start", id: "answer" })
      for (const token of ANSWER.split(/(\s+)/)) {
        writer.write({ type: "text-delta", id: "answer", delta: token })
        await wait(TOKEN_DELAY_MS)
      }
      writer.write({ type: "text-end", id: "answer" })
      for (const source of SOURCES) writer.write({ type: "source-url", ...source })
      writer.write({ type: "finish" })
    },
  })

  return createUIMessageStreamResponse({ stream })
}
