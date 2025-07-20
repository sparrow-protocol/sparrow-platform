import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shell } from "@/components/shell"
import { PageHeader, PageHeaderHeading, PageHeaderDescription } from "@/components/page-header"

export default function NotFound() {
  return (
    <Shell layout="centered">
      <PageHeader className="flex flex-col items-center text-center">
        <PageHeaderHeading className="text-9xl font-extrabold text-primary">404</PageHeaderHeading>
        <PageHeaderDescription className="mt-4 text-xl text-muted-foreground">
          Oops! The page you're looking for doesn't exist.
        </PageHeaderDescription>
        <Button asChild className="mt-8">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </PageHeader>
    </Shell>
  )
}
