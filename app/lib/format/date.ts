import { format, formatDistanceToNowStrict } from "date-fns"

export function formatTimestamp(timestamp: number | Date): string {
  const date = typeof timestamp === "number" ? new Date(timestamp) : timestamp
  return format(date, "MMM dd, yyyy HH:mm:ss")
}

export function timeAgo(timestamp: number | Date): string {
  const date = typeof timestamp === "number" ? new Date(timestamp) : timestamp
  return formatDistanceToNowStrict(date, { addSuffix: true })
}
