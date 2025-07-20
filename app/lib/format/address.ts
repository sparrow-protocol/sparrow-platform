export function formatAddress(address: string, numChars = 4): string {
  if (!address) return ""
  return `${address.slice(0, numChars)}...${address.slice(-numChars)}`
}
