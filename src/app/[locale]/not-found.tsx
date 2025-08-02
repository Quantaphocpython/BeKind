import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="mx-auto flex max-w-[500px] flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-muted p-3">
          <Icons.alertCircle className="h-10 w-10 text-primary" aria-hidden="true" />
        </div>

        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">404</h1>
        <h2 className="mt-3 text-xl font-semibold sm:text-2xl">Page Not Found</h2>

        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/" className="flex items-center gap-2">
              <Icons.moveLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
