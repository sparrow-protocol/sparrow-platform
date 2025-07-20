import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image src="/placeholder-logo.png" alt="Logo" width={32} height={32} className="rounded-full" />
      <span className="text-lg font-bold">Sparrow</span>
    </Link>
  )
}
