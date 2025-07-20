export function formatPrice(price: number | null | undefined, currency = "USD"): string {
  if (price === null || price === undefined) {
    return "N/A"
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 6, // For crypto prices
  }).format(price)
}
