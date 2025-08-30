import { Metadata } from 'next'

import { defaultMetadata } from '@/utils/metadata'

import AuthForm from '@/components/auth/auth-form'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Signup | CollabWrite",
}

const SignUpPage = () => {
  return <AuthForm mode='signup' />
}

export default SignUpPage