"use client"

import dynamic from "next/dynamic"

// three.js is heavy, so it loads on the client after the page is ready.
const BarTerrain = dynamic(
  () => import("@/registry/ledger/components/ledger/bar-terrain").then((module) => module.BarTerrain),
  { ssr: false },
)

export function BarTerrainDemo({ className = "h-90" }: { className?: string }) {
  return <BarTerrain className={className} label="3D bar field that rises under the pointer" />
}
