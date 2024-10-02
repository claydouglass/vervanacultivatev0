// app/layout.tsx
import './globals.css';
import localFont from 'next/font/local';
import { ReactNode } from 'react';

const geistMono = localFont({
  src: '/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={geistMono.variable}>
        {children}
      </body>
    </html>
  );
}