import { DefaultSeoProps } from 'next-seo';

export const defaultSEO: DefaultSeoProps = {
  titleTemplate: "%s | GOD'S WORD - KJV Bible",
  defaultTitle: "GOD'S WORD - King James Version Bible with Strong's Concordance",
  description: "Read the Word of God with Strong's Concordance. Study the King James Version Bible with original Hebrew and Greek word meanings.",
  canonical: 'https://gods-word.vercel.app',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gods-word.vercel.app',
    siteName: "GOD'S WORD - KJV Bible",
    title: "GOD'S WORD - King James Version Bible",
    description: "Read the Word of God with Strong's Concordance. Study the King James Version Bible with original Hebrew and Greek word meanings.",
    images: [
      {
        url: 'https://gods-word.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: "GOD'S WORD - KJV Bible",
        type: 'image/png',
      },
    ],
  },
  twitter: {
    handle: '@godsword',
    site: '@godsword',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'Bible, KJV, King James Version, Strong\'s Concordance, Hebrew, Greek, Scripture, Biblical, Old Testament, New Testament',
    },
    {
      name: 'author',
      content: "GOD'S WORD",
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=5',
    },
    {
      name: 'theme-color',
      content: '#2563eb',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
};
