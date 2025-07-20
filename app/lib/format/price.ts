export function formatPrice(value: number, currency = "USD"): string {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: currency,
  })
}
