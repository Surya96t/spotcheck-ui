"use client"

import * as React from "react"

import { Calendar, DatePicker } from "@/registry/spotcheck/components/spotcheck/date-picker"

const MONTH = new Date(2026, 10, 1)

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | null>(new Date(2026, 10, 12))

  return (
    <div className="flex flex-wrap items-start gap-6">
      <DatePicker label="Billing starts" value={date} onValueChange={setDate} defaultMonth={MONTH} />
      <Calendar value={date} onValueChange={setDate} defaultMonth={MONTH} />
    </div>
  )
}
