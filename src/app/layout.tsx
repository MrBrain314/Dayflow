import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dayflow',
  description: 'Ta journée, organisée.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider afterSignOutUrl="/sign-in">
      <html lang="fr">
        <body className={geist.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
