import { ChatScreen, type ChatThread } from "@/registry/spotcheck/components/spotcheck/chat-screen"

const THREADS: ChatThread[] = [
  {
    id: "refunds",
    title: "Refund policy summary",
    when: "2 min ago",
    messages: [
      { role: "user", text: "What changed in the refund policy this quarter?" },
      { role: "assistant", text: "Three things. Late refunds need approval, split shipments can be refunded in parts, and store credit is instant." },
    ],
  },
  {
    id: "tickets",
    title: "Q3 ticket clustering",
    when: "Yesterday",
    messages: [{ role: "user", text: "Cluster the Q3 tickets by reason." }],
  },
  { id: "onboarding", title: "Onboarding email draft", when: "Mon", messages: [] },
]

export function ChatScreenDemo() {
  return <ChatScreen api="/api/demo/chat" threads={THREADS} />
}
