"use client"

import { DiffReview, type DiffHunk } from "@/registry/spotcheck/components/spotcheck/diff-review"

const HUNKS: DiffHunk[] = [
  {
    id: "window",
    file: "lib/refunds.ts",
    summary: "Require approval past 30 days",
    lines: [
      { kind: "context", text: "export function route(days: number) {" },
      { kind: "remove", text: "  if (days > 60) return approve()" },
      { kind: "add", text: "  if (days > 30) return requestApproval()" },
      { kind: "context", text: "  return approve()" },
    ],
  },
  {
    id: "copy",
    file: "content/refund-policy.md",
    summary: "Update the policy window",
    lines: [
      { kind: "remove", text: "Refunds within 60 days are automatic." },
      { kind: "add", text: "Refunds within 30 days are automatic." },
    ],
  },
  {
    id: "test",
    file: "tests/refunds.test.ts",
    summary: "Cover the new boundary",
    lines: [
      { kind: "add", text: 'it("asks for approval on day 31", () => {' },
      { kind: "add", text: '  expect(route(31)).toBe("approval")' },
      { kind: "add", text: "})" },
    ],
  },
]

export function DiffReviewDemo() {
  return <DiffReview hunks={HUNKS} />
}
