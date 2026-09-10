import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'The Star Experience | Kwesi Dain Live at The Republic Bar & Grill',
  description:
    'Mobile-first food and drink ordering for The Star Experience by Kwesi Dain at The Republic Bar and Grill, Osu, Accra, Ghana (3rd December).',
  keywords: ['The Star Experience', 'Kwesi Dain', 'The Republic Bar', 'Osu Accra', 'Food and Drink Order'],
  appleWebApp: {
    capable: true,
    title: 'The Star Experience',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0A0A0A',
};

import { GlobalBackground } from '@/components/GlobalBackground';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-[#0A0A0A]">
      <body className="min-h-screen bg-[#0A0A0A] text-white antialiased selection:bg-star-gold selection:text-black">
        <GlobalBackground />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
