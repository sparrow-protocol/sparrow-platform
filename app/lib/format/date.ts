import { format } from "date-fns"

export function formatDate(date: Date | string, dateFormat = "MMM dd, yyyy") {
  if (typeof date === "string") {
    date = new Date(date)
  }
  return format(date, dateFormat)
}

export function formatTime(date: Date | string, timeFormat = "HH:mm:ss") {
  if (typeof date === "string") {
    date = new Date(date)
  }
  return format(date, timeFormat)
}

export function formatTimestamp(timestamp: number | Date): string {
  const date = typeof timestamp === "number" ? new Date(timestamp) : timestamp
  return format(date, "MMM dd, yyyy HH:mm:ss")
}
