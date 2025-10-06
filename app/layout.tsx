import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GOD'S WORD - KJV Bible",
  description: "Read the Word of God with Strong's Concordance",
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
      </body>
    </html>
  );
}
