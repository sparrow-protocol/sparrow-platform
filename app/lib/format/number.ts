export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("en-US", options).format(value)
}

export function formatPercentage(value: number | string, options?: Intl.NumberFormatOptions, locale = "en-US"): string {
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value
  if (isNaN(numValue)) {
    return "N/A"
  }
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(numValue / 100) // Assuming input is 5 for 5%
}
