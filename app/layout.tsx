// Removed 'use server' as it's not needed for layout component

import './globals.css';
import '@fontsource/anton';
import { SessionProvider } from 'next-auth/react';
import { TRPCProvider } from '../components/TRPCProvider';
import { Navigation } from '@/components/Navigation';

export const metadata = {
  title: 'Planet Mado - DBZ RPG',
  description: 'A Dragon Ball Z role-playing game inspired by Planet Mado',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className="bg-pm-white text-pm-text-dark font-roboto">
          <TRPCProvider>
            <Navigation />
            <main className="container pt-20 pb-8">{children}</main>
          </TRPCProvider>
        </body>
      </html>
    </SessionProvider>
  );
}