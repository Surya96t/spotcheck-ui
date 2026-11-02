import { SwipeReview, type ReviewItem } from "@/registry/spotcheck/components/spotcheck/swipe-review"

const QUEUE: ReviewItem[] = [
  {
    id: "gst",
    question: "Can I get GST invoices for last year?",
    answer: "Yes. Go to Billing, then Invoices, choose the year and download the PDF bundle.",
    meta: "atlas-m · 0.82 confidence",
  },
  {
    id: "card",
    question: "Why did my card fail?",
    answer: "Your card was declined by the bank. Please try again later or contact our support team.",
    meta: "atlas-s · 0.41 confidence",
  },
  {
    id: "ship",
    question: "Do you ship to Colombo?",
    answer: "We ship to Sri Lanka in 6 to 9 working days. Customs duty is collected on delivery.",
    meta: "atlas-l · 0.91 confidence",
  },
  {
    id: "cancel",
    question: "How do I cancel?",
    answer: "Settings, then Plan, then Cancel plan. You keep access until the end of the paid period.",
    meta: "atlas-m · 0.88 confidence",
  },
]

export function SwipeReviewDemo() {
  return <SwipeReview items={QUEUE} />
}
