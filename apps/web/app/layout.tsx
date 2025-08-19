import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SunDate Café - Where Every Moment is Special',
  description: 'Experience the perfect blend of comfort, quality, and ambiance at SunDate Café. Enjoy our carefully crafted menu, warm atmosphere, and exceptional service.',
  keywords: 'café, coffee, food, dining, restaurant, breakfast, lunch, dinner, reservations',
  authors: [{ name: 'SunDate Café' }],
  openGraph: {
    title: 'SunDate Café - Where Every Moment is Special',
    description: 'Experience the perfect blend of comfort, quality, and ambiance at SunDate Café.',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
