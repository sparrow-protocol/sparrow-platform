import type React from "react"

export type ChartConfig = {
  [k: string]: {
    label?: string
    color?: string
    icon?: React.ComponentType<{ className?: string }>
  }
}

export type ChartContainerProps = React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ReactNode
}

export interface ChartData {
  date: string
  value: number
}

export type ChartPeriod = "24h" | "7d" | "1m" | "3m" | "1y" | "all"
