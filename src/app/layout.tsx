import type { Metadata } from 'next';
import { Syne, DM_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  title: 'Elementa — Virtual Science Lab',
  description: 'Immersive virtual science experiments for secondary school students in Ghana and Africa.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${syne.variable} ${dmMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
