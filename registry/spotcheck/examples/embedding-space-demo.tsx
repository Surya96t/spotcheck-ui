"use client"

import dynamic from "next/dynamic"

import type {
  EmbeddingPoint,
  EmbeddingQuery,
  EmbeddingVector,
} from "@/registry/spotcheck/components/spotcheck/embedding-space"

// three.js is heavy, so it loads on the client after the page is ready.
const EmbeddingSpace = dynamic(
  () => import("@/registry/spotcheck/components/spotcheck/embedding-space").then((module) => module.EmbeddingSpace),
  { ssr: false },
)

const CLUSTER_SIZE = 80
const NEIGHBOURS = 6
const SCALE = 9
const SPREAD = 0.85
// Queries sit just outside their cluster, so the lines to their neighbours have room to show.
const QUERY_OFFSET = 1.25

const CLUSTERS = [
  { center: [-3.2, 0.8, 0.4], topics: ["Invoice due dates", "GST on subscriptions", "Card declined retries", "Proration rules", "Duplicate charges", "Refund to wallet"] },
  { center: [3, 0.2, -1], topics: ["Courier partners", "Delivery to Sri Lanka", "Tracking delays", "Customs duty", "Split shipments", "Address changes"] },
  { center: [0.2, -1.9, 2.9], topics: ["Password reset", "Two-factor login", "Team seats", "SSO setup", "Email change", "Delete account"] },
  { center: [0.6, 2.6, -3], topics: ["Return window", "Opened items", "Exchange flow", "Pickup scheduling", "Damaged on arrival", "Return labels"] },
] as const

const QUESTIONS = [
  { label: "Why was I charged twice?", cluster: 0 },
  { label: "Where is my parcel?", cluster: 1 },
  { label: "I forgot my password", cluster: 2 },
  { label: "Can I return an opened box?", cluster: 3 },
] as const

function seeded(seed: number) {
  let state = seed
  return () => {
    state = (state * 16807) % 2147483647
    return (state - 1) / 2147483646
  }
}

function gaussian(random: () => number) {
  return Math.sqrt(-2 * Math.log(random() || 1)) * Math.cos(2 * Math.PI * random())
}

// Invented data: these positions and scores come from a seeded random cloud, not a real model.
const random = seeded(7)
const POINTS: EmbeddingPoint[] = CLUSTERS.flatMap(({ center, topics }, cluster) =>
  Array.from({ length: CLUSTER_SIZE }, (_, index) => ({
    id: `${cluster}-${index}`,
    position: center.map((axis) => axis + gaussian(random) * SPREAD) as EmbeddingVector,
    label: `${topics[index % topics.length]} · ${String(index + 1).padStart(2, "0")}`,
  })),
)

function distance(a: EmbeddingVector, b: EmbeddingVector) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
}

const QUERIES: EmbeddingQuery[] = QUESTIONS.map(({ label, cluster }, index) => {
  const center = CLUSTERS[cluster]!.center
  const reach = Math.hypot(...center)
  const position = center.map((axis) => axis + (axis / reach) * QUERY_OFFSET) as EmbeddingVector
  const neighbours = POINTS.map((point) => ({ id: point.id, score: 1 - distance(point.position, position) / SCALE }))
    .toSorted((a, b) => b.score - a.score)
    .slice(0, NEIGHBOURS)
  return { id: `query-${index}`, label, position, neighbours }
})

export function EmbeddingSpaceDemo() {
  return (
    <EmbeddingSpace
      points={POINTS}
      queries={QUERIES}
      label={`Point cloud of ${POINTS.length} invented document chunks in four clusters. Drag to rotate.`}
    />
  )
}
