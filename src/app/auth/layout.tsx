import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className='bg-gradient-auth min-h-screen justify-center items-center flex'>
      {children}
    </section>
  )
}

export default AuthLayout