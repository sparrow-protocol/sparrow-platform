export type ChartDataPoint = {
  date: string // e.g., "2023-01-01"
  value: number
}

export type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}
