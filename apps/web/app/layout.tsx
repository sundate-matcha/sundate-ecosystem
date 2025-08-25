import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sundate Matcha - Where Every Moment is Special',
  description: 'Experience the perfect blend of comfort, quality, and ambiance at Sundate Matcha. Enjoy our carefully crafted menu, warm atmosphere, and exceptional service.',
  keywords: 'café, coffee, food, dining, restaurant, breakfast, lunch, dinner, reservations',
  authors: [{ name: 'Sundate Matcha' }],
  openGraph: {
    title: 'Sundate Matcha - Where Every Moment is Special',
    description: 'Experience the perfect blend of comfort, quality, and ambiance at Sundate Matcha.',
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
