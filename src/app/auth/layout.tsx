import { Metadata } from 'next'

import { defaultMetadata } from '@/utils/metadata'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Auth | CollabWrite",
}

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className='bg-gradient-auth min-h-screen justify-center items-center flex'>
      {children}
    </section>
  )
}

export default AuthLayout