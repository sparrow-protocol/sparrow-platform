"use client"

import type * as React from "react"
import { VictoryAxis, VictoryChart, VictoryLine, VictoryTheme, VictoryTooltip, VictoryVoronoiContainer } from "victory"
import { format } from "date-fns"
import {
  CartesianGrid,
  LineChart,
  BarChart,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from "recharts"
import {
  ChartContainer as RechartsChartContainer,
  ChartTooltip as RechartsChartTooltip,
  ChartTooltipContent as RechartsChartTooltipContent,
} from "@/components/ui/chart" // Assuming chart.tsx is in the same directory

import { cn } from "@/lib/utils"
import type { ChartDataPoint } from "@/app/types/chart"

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ChartDataPoint[]
  title?: string
  description?: string
  xLabel?: string
  yLabel?: string
  lineColor?: string
}

export function Chart({
  data,
  title,
  description,
  xLabel,
  yLabel,
  lineColor = "#8884d8",
  className,
  ...props
}: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={cn("flex h-64 items-center justify-center rounded-lg bg-muted", className)} {...props}>
        <p className="text-muted-foreground">No data available for chart.</p>
      </div>
    )
  }

  // Format data for VictoryChart
  const formattedData = data.map((d) => ({
    x: new Date(d.date),
    y: d.value,
    label: `${format(new Date(d.date), "MMM dd, yyyy")}: $${d.value.toLocaleString()}`,
  }))

  return (
    <div className={cn("w-full", className)} {...props}>
      {title && <h3 className="text-lg font-semibold">{title}</h3>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <VictoryChart
          theme={VictoryTheme.material}
          containerComponent={
            <VictoryVoronoiContainer
              labels={({ datum }) => datum.label}
              labelComponent={<VictoryTooltip style={{ fontSize: 10 }} />}
            />
          }
          padding={{ top: 20, bottom: 60, left: 60, right: 20 }}
          scale={{ x: "time", y: "linear" }}
        >
          <VictoryAxis
            label={xLabel}
            tickFormat={(x) => format(new Date(x), "MMM dd")}
            style={{
              axisLabel: { padding: 30 },
              tickLabels: { fontSize: 10, padding: 5 },
            }}
          />
          <VictoryAxis
            dependentAxis
            label={yLabel}
            tickFormat={(y) => `$${y.toLocaleString()}`}
            style={{
              axisLabel: { padding: 40 },
              tickLabels: { fontSize: 10, padding: 5 },
            }}
          />
          <VictoryLine
            data={formattedData}
            style={{
              data: { stroke: lineColor },
            }}
          />
        </VictoryChart>
      </ResponsiveContainer>
    </div>
  )
}

// Re-exporting components from recharts and the local chart components
export {
  CartesianGrid,
  Line,
  LineChart,
  BarChart,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RechartsChartContainer as ChartContainer,
  RechartsChartTooltip as ChartTooltip,
  RechartsChartTooltipContent as ChartTooltipContent,
}
