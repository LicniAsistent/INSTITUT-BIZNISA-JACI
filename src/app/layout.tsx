import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navigation } from '@/components/Navigation';
import { SmoothScroll } from '@/components/SmoothScroll';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Institut Biznisa - Buducnost Preduzetništva na Balkanu',
  description: 'Edukaciona platforma, zajednica i inkubacija za preduzetnike na Balkanu. Učite, povezujte se i razvijajte svoje poslovanje.',
  keywords: 'biznis, preduzetništvo, edukacija, kursevi, Balkan, Srbija, Hrvatska, Bosna',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <Providers>
          <SmoothScroll />
          <Navigation />
          <main className="min-h-screen bg-kimi">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
