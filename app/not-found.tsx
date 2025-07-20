import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-var(--site-header-height))] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl text-muted-foreground">Page Not Found</p>
      <Link href="/" className="mt-4 text-primary hover:underline">
        Go back home
      </Link>
    </div>
  )
}
