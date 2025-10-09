import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://gods-word.vercel.app'),
  title: {
    default: "GOD'S WORD - KJV Bible",
    template: "%s | GOD'S WORD - KJV Bible",
  },
  description:
    "Read the Word of God with Strong's Concordance. Study the King James Version Bible with original Hebrew and Greek word meanings.",
  keywords: [
    'Bible',
    'KJV',
    'King James Version',
    "Strong's Concordance",
    'Hebrew',
    'Greek',
    'Scripture',
    'Biblical',
    'Old Testament',
    'New Testament',
  ],
  authors: [{ name: "GOD'S WORD" }],
  creator: "GOD'S WORD",
  publisher: "GOD'S WORD",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gods-word.vercel.app',
    siteName: "GOD'S WORD - KJV Bible",
    title: "GOD'S WORD - King James Version Bible",
    description:
      "Read the Word of God with Strong's Concordance. Study the King James Version Bible with original Hebrew and Greek word meanings.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "GOD'S WORD - KJV Bible",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "GOD'S WORD - King James Version Bible",
    description: "Read the Word of God with Strong's Concordance",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
