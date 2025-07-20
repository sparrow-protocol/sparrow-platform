import { encodeURL } from "@solana/pay"
import { type PublicKey, Keypair } from "@solana/web3.js"
import { ADMIN_WALLET_ADDRESS } from "@/app/lib/constants"

interface CreateSolanaPayUrlParams {
  recipient: PublicKey
  amount: number
  splToken?: PublicKey
  reference?: PublicKey | PublicKey[]
  label?: string
  message?: string
  memo?: string
}

export function createSolanaPayUrl({
  recipient,
  amount,
  splToken,
  reference,
  label,
  message,
  memo,
}: CreateSolanaPayUrlParams): URL {
  const url = encodeURL({
    recipient,
    amount,
    splToken,
    reference,
    label,
    message,
    memo,
  })
  return url
}

// Example usage (for demonstration, not directly used in UI)
export function generateExampleSolanaPayQR() {
  const recipient = ADMIN_WALLET_ADDRESS // Example recipient
  const amount = 0.001 // Example amount in SOL
  const reference = Keypair.generate().publicKey // Example reference

  const url = createSolanaPayUrl({
    recipient,
    amount,
    reference,
    label: "Sparrow Donation",
    message: "Thank you for your support!",
  })

  // For displaying in a browser, you'd typically convert this URL to a QR code image
  // const qrCode = createQR(url, 256, 'transparent');
  // qrCode.append(document.getElementById('qr-code-container'));
  console.log("Solana Pay URL:", url.toString())
  return url
}
