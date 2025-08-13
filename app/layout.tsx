import DevAuthWrapper from '@/components/auth/DevAuthWrapper'
import AppLayout from '@/components/layout/AppLayout'
import { AuthProvider } from '@/lib/auth-context'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Snuff Specifications',
  description: 'Specification management system for snuff products',
  icons: {
    icon: '/favicon.ico',
  },
}


export const viewport = 'width=device-width, initial-scale=1'

export default React.memo(function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="en">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=optional" 
        />
      </head>
      <body>
        <AuthProvider>
          <DevAuthWrapper>
            <AppLayout>{children}</AppLayout>
          </DevAuthWrapper>
        </AuthProvider>
      </body>
    </html>
  )
})
