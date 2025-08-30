import { Metadata } from 'next'

import { defaultMetadata } from '@/utils/metadata'

import AuthForm from '@/components/auth/auth-form'

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Login | CollabWrite",
}

const LoginPage = () => {
  return <AuthForm mode='login' />
}

export default LoginPage