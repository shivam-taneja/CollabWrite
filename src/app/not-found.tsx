import { Metadata } from 'next'
import Link from 'next/link'

import React from 'react'

import { defaultMetadata } from '@/utils/metadata'

import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Page Not Found | CollabWrite",
  description: "The page you're looking for doesn't exist on CollabWrite. Return to the knowledge feed and explore collaborative posts.",
  robots: {
    index: false,
    follow: false,
  },
}

const NotFoundPage = () => {
  return (
    <main>
      <section>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-6 max-w-md mx-auto px-4">
            <div className="space-y-2">
              <h1 className="text-6xl font-bold text-primary">404</h1>
              <h2 className="text-2xl font-semibold">Page Not Found</h2>
              <p className="text-muted-foreground">
                Sorry, the page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button variant="gradient">
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default NotFoundPage