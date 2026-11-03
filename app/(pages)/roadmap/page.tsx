import type { Metadata } from "next"

import { PageTitle } from "@/components/site/page-title"
import { RoadmapColumns } from "@/components/site/roadmap-columns"

export const metadata: Metadata = {
  title: "Roadmap",
  description: "What Spotcheck UI has shipped, what's next and what comes later.",
}

export default function RoadmapPage() {
  return (
    <>
      <PageTitle trail={[{ label: "Roadmap" }]} title="What's next" />
      <RoadmapColumns notes />
    </>
  )
}
