export type RoadmapItem = { name: string; note: string }
export type RoadmapColumn = { title: string; status: string; items: RoadmapItem[] }

export const ROADMAP: RoadmapColumn[] = [
  {
    title: "Now",
    status: "Shipped",
    items: [
      { name: "61 components", note: "AI review, motion, 3D and everyday UI" },
      { name: "Three skins", note: "Ledger, Terminal and Folio" },
      { name: "Install by CLI", note: "One command with the shadcn CLI" },
    ],
  },
  {
    title: "Next",
    status: "In progress",
    items: [
      { name: "Dashboard screen", note: "A full screen built from Spotcheck parts" },
      { name: "Field notes", note: "How the components were made" },
      { name: "shadcn directory", note: "Listed where people look for registries" },
    ],
  },
  {
    title: "Later",
    status: "Planned",
    items: [
      { name: "Region Globe", note: "A WebGL globe for regional data" },
      { name: "Voice Orb", note: "An orb that follows live mic level" },
      { name: "Configurator", note: "A 3D product configurator" },
      { name: "21st.dev", note: "Components listed on 21st.dev" },
    ],
  },
]
