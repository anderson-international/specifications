import React from 'react'
import type { Metadata } from 'next'
import '@/styles/globals.css'
import { AuthProvider } from '@/lib/auth-context'
import DevAuthWrapper from '@/components/auth/DevAuthWrapper'
import AppLayout from '@/components/layout/AppLayout'

export const metadata: Metadata = {
  title: 'Snuff Specifications',
  description: 'Specification management system for snuff products',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <DevAuthWrapper>
            <AppLayout>
              {children}
            </AppLayout>
          </DevAuthWrapper>
        </AuthProvider>  
      </body>
    </html>
  )
}
