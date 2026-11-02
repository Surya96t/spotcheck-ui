import { render, screen } from "@testing-library/react"
import { createUIMessageStream, createUIMessageStreamResponse } from "ai"
import { describe, expect, it } from "vitest"

import { traceProgress, type TraceStep } from "@/registry/ledger/components/ledger/agent-trace"
import { reviewCounts, type DiffHunk } from "@/registry/ledger/components/ledger/diff-review"
import { EvalMatrix, scoreShare } from "@/registry/ledger/components/ledger/eval-matrix"
import { finishPlaces, type RaceLane } from "@/registry/ledger/components/ledger/model-race"
import { tornEdge } from "@/registry/ledger/components/ledger/run-receipt"
import { finishedSentences, linkCitations } from "@/registry/ledger/components/ledger/stream-response"
import { flattenSpans, formatMs, type Span } from "@/registry/ledger/components/ledger/trace-waterfall"
import { applyAiSdkPart, readSseEvents, type StreamState } from "@/registry/ledger/hooks/use-stream"

const EMPTY: StreamState = { text: "", sources: [], tools: [] }

async function readAll(response: Response) {
  const raw = await response.text()
  return readSseEvents(raw).events.reduce(applyAiSdkPart, EMPTY)
}

describe("useStream against the real AI SDK", () => {
  it("reads text, sources and tools from a real UI message stream", async () => {
    const stream = createUIMessageStream({
      execute({ writer }) {
        writer.write({ type: "start", messageId: "m1" })
        writer.write({ type: "text-start", id: "t" })
        writer.write({ type: "text-delta", id: "t", delta: "Refunds need " })
        writer.write({ type: "text-delta", id: "t", delta: "approval [1]." })
        writer.write({ type: "text-end", id: "t" })
        writer.write({ type: "source-url", sourceId: "s1", url: "https://example.com/a", title: "Policy" })
        writer.write({ type: "tool-input-start", toolCallId: "c1", toolName: "search" })
        writer.write({ type: "tool-input-available", toolCallId: "c1", toolName: "search", input: { q: "refund" } })
        writer.write({ type: "tool-output-available", toolCallId: "c1", output: { hits: 3 } })
        writer.write({ type: "finish" })
      },
    })
    const response = createUIMessageStreamResponse({ stream })

    expect(response.headers.get("x-vercel-ai-ui-message-stream")).toBe("v1")
    expect(await readAll(response)).toEqual({
      text: "Refunds need approval [1].",
      sources: [{ id: "s1", title: "Policy", url: "https://example.com/a" }],
      tools: [{ id: "c1", name: "search", input: { q: "refund" }, output: { hits: 3 }, done: true }],
    })
  })

  it("throws a stream's own error message", () => {
    expect(() => applyAiSdkPart(EMPTY, JSON.stringify({ type: "error", errorText: "Rate limited" }))).toThrow("Rate limited")
  })
})

describe("readSseEvents", () => {
  it("keeps an incomplete event for the next chunk", () => {
    const { events, rest } = readSseEvents('data: one\n\ndata: tw')
    expect(events).toEqual(["one"])
    expect(rest).toBe("data: tw")
  })

  it("joins multi-line data and handles CRLF", () => {
    expect(readSseEvents("data: a\r\ndata: b\r\n\r\n").events).toEqual(["a\nb"])
  })
})

describe("linkCitations", () => {
  it("links markers and leaves markdown links alone", () => {
    expect(linkCitations("See [1] and [docs](https://x.test) [2]")).toBe("See [1](#cite-1) and [docs](https://x.test) [2](#cite-2)")
  })

  it("doesn't touch a link that's a number", () => {
    expect(linkCitations("[1](https://x.test)")).toBe("[1](https://x.test)")
  })
})

describe("finishedSentences", () => {
  it("counts only finished sentences", () => {
    expect(finishedSentences("One. Two is still going")).toEqual(["One."])
  })

  it("doesn't split decimals", () => {
    expect(finishedSentences("It costs 2.50 today. Next")).toEqual(["It costs 2.50 today."])
  })
})

describe("traceProgress", () => {
  it("measures finished time, counting errors as finished", () => {
    const steps: TraceStep[] = [
      { id: "a", tool: "a", argument: "", state: "done", ms: 100 },
      { id: "b", tool: "b", argument: "", state: "error", ms: 100 },
      { id: "c", tool: "c", argument: "", state: "running", ms: 200 },
    ]
    expect(traceProgress(steps)).toBe(0.5)
  })

  it("handles an empty run", () => {
    expect(traceProgress([])).toBe(0)
  })
})

describe("flattenSpans", () => {
  const spans: Span[] = [
    { id: "root", name: "run", start: 0, end: 10 },
    { id: "b", parent: "root", name: "second", start: 5, end: 9 },
    { id: "a", parent: "root", name: "first", start: 1, end: 4 },
    { id: "leaf", parent: "a", name: "leaf", start: 2, end: 3 },
  ]

  it("orders depth first by start time", () => {
    expect(flattenSpans(spans).map((row) => [row.span.id, row.depth])).toEqual([
      ["root", 0],
      ["a", 1],
      ["leaf", 2],
      ["b", 1],
    ])
  })

  it("hides everything inside a collapsed span", () => {
    expect(flattenSpans(spans, new Set(["a"])).map((row) => row.span.id)).toEqual(["root", "a", "b"])
  })
})

describe("formatMs", () => {
  it("switches to seconds", () => {
    expect(formatMs(640)).toBe("640 ms")
    expect(formatMs(2840)).toBe("2.84 s")
  })
})

describe("finishPlaces", () => {
  const lane = (id: string, ms: number, status: RaceLane["status"] = "done"): RaceLane => ({ id, model: id, text: "", status, ms, cost: 0 })

  it("ranks finished lanes and ignores running ones", () => {
    const places = finishPlaces([lane("a", 300), lane("b", 100), lane("c", 50, "streaming")])
    expect(places.get("b")).toBe(1)
    expect(places.get("a")).toBe(2)
    expect(places.has("c")).toBe(false)
  })

  it("lets ties share a place", () => {
    const places = finishPlaces([lane("a", 100), lane("b", 100)])
    expect([places.get("a"), places.get("b")]).toEqual([1, 1])
  })
})

describe("reviewCounts", () => {
  it("counts decided hunks", () => {
    const hunks: DiffHunk[] = [{ id: "a", file: "a", lines: [] }, { id: "b", file: "b", lines: [] }]
    expect(reviewCounts(hunks, { a: "accepted" })).toEqual({ reviewed: 1, remaining: 1 })
  })
})

describe("scoreShare", () => {
  it("maps the domain to a percentage and clamps", () => {
    expect(scoreShare(0.8, [0.6, 1])).toBe(50)
    expect(scoreShare(0.2, [0.6, 1])).toBe(0)
    expect(scoreShare(1.2, [0.6, 1])).toBe(100)
  })
})

describe("EvalMatrix", () => {
  it("is a real table with row and column headers", () => {
    render(<EvalMatrix label="Scores" rows={["atlas-l"]} cols={["QA"]} values={[[0.93]]} />)
    expect(screen.getByRole("rowheader", { name: "atlas-l" })).toBeInTheDocument()
    expect(screen.getByRole("columnheader", { name: "QA" })).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: "0.93" })).toBeInTheDocument()
  })
})

describe("tornEdge", () => {
  it("builds a closed polygon with the right number of points", () => {
    const edge = tornEdge(4, 7)
    expect(edge.startsWith("polygon(0 0, 100% 0,")).toBe(true)
    expect(edge.split(",")).toHaveLength(2 + 9)
  })
})
