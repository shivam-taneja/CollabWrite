import { Metadata } from 'next'

import React from 'react'

import { defaultMetadata } from '@/utils/metadata'

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
        <div>
          <p className='flex w-full h-screen justify-center items-center'>
            Page Not Found!
          </p>
        </div>
      </section>
    </main>
  )
}

export default NotFoundPage