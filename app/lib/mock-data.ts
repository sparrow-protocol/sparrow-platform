import type { ChartDataPoint } from "@/app/types/chart"

/**
 * Generates mock historical portfolio value data for the last `days` days.
 * @param days The number of days to generate data for.
 * @param initialValue The starting portfolio value.
 * @param volatility The degree of random fluctuation in value.
 * @returns An array of ChartDataPoint representing historical portfolio values.
 */
export function generateMockPortfolioHistory(
  days: number,
  initialValue: number,
  volatility = 0.02, // 2% daily fluctuation
): ChartDataPoint[] {
  const data: ChartDataPoint[] = []
  let currentValue = initialValue
  const now = Date.now()

  for (let i = days - 1; i >= 0; i--) {
    const timestamp = now - i * 24 * 60 * 60 * 1000 // Go back in time by days
    const change = (Math.random() * 2 - 1) * volatility * currentValue // Random change between -volatility and +volatility
    currentValue += change
    currentValue = Math.max(currentValue, 0) // Ensure value doesn't go below zero

    data.push({
      timestamp: timestamp,
      value: Number.parseFloat(currentValue.toFixed(2)),
    })
  }
  return data
}
