import { Metadata } from 'next';

import AuthClientLayout from '@/components/auth/auth-client-layout';
import { defaultMetadata } from '@/utils/metadata';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Auth | CollabWrite",
}

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthClientLayout>{children}</AuthClientLayout>
}

export default AuthLayout