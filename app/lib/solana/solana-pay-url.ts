import { encodeURL, createQR, findReference, validateTransfer, type TransferRequestURLFields } from "@solana/pay"
import { type Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js"
import { SOLANA_PAY_RECIPIENT_ADDRESS } from "@/app/lib/constants"

export async function generateSolanaPayQR(
  amount: number,
  splToken?: PublicKey,
  reference?: PublicKey,
  label?: string,
  message?: string,
): Promise<string> {
  const recipient = new PublicKey(SOLANA_PAY_RECIPIENT_ADDRESS)

  const urlFields: TransferRequestURLFields = {
    recipient,
    amount,
    splToken,
    reference,
    label,
    message,
  }

  const url = encodeURL(urlFields)
  const qrCode = createQR(url)

  // Convert QR code to data URL (e.g., for displaying in an <img> tag)
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    qrCode.append(canvas)
    resolve(canvas.toDataURL("image/png"))
  })
}

export async function verifySolanaPayTransaction(
  connection: Connection,
  reference: PublicKey,
  amount: number,
  splToken?: PublicKey,
): Promise<boolean> {
  try {
    const signatureInfo = await findReference(connection, reference, { finality: "confirmed" })
    const { signature } = signatureInfo

    await validateTransfer(connection, signature, {
      recipient: new PublicKey(SOLANA_PAY_RECIPIENT_ADDRESS),
      amount,
      splToken,
    })
    return true
  } catch (error) {
    console.error("Solana Pay transaction verification failed:", error)
    return false
  }
}

export async function createSolanaPayTransaction(
  sender: PublicKey,
  recipient: PublicKey,
  amount: number,
  connection: Connection,
): Promise<Transaction> {
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: recipient,
      lamports: amount,
    }),
  )
  transaction.feePayer = sender
  const { blockhash } = await connection.getLatestBlockhash()
  transaction.recentBlockhash = blockhash
  return transaction
}
