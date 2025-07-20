import { format, formatDistanceToNowStrict } from "date-fns"

export function formatDate(date: Date | string | number, dateFormat = "PPP"): string {
  if (!date) return ""
  return format(new Date(date), dateFormat)
}

export function timeAgo(date: Date | string | number): string {
  if (!date) return ""
  return formatDistanceToNowStrict(new Date(date), { addSuffix: true })
}
