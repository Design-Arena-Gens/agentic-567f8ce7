import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Daily ASMR Agent',
  description: 'Get a satisfying ASMR video every day at 1pm',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
