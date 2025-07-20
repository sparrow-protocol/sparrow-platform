import type { PublicKey } from "@solana/web3.js"
import { encodeURL, createQR } from "@solana/pay"

export function generateSolanaPayUrl(
  recipient: PublicKey,
  amount: number,
  splToken?: PublicKey,
  reference?: PublicKey,
  label?: string,
  message?: string,
): URL {
  const url = encodeURL({
    recipient,
    amount,
    splToken,
    reference,
    label,
    message,
  })
  return url
}

export function generateSolanaPayQR(
  recipient: PublicKey,
  amount: number,
  splToken?: PublicKey,
  reference?: PublicKey,
  label?: string,
  message?: string,
): string {
  const url = generateSolanaPayUrl(recipient, amount, splToken, reference, label, message)
  const qr = createQR(url)
  // For simplicity, we'll return the SVG string. In a real app, you might render this directly.
  return qr.toString()
}
