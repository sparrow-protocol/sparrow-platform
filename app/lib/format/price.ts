export function formatPrice(value: number | string, currency = "USD", locale = "en-US"): string {
  const numValue = typeof value === "string" ? Number.parseFloat(value) : value
  if (isNaN(numValue)) {
    return "N/A"
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 6, // Allow more for crypto prices
  }).format(numValue)
}
