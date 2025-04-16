// Removed 'use server' as it's not needed for layout component

import './globals.css';
import '@fontsource/anton';
import { SessionProvider } from 'next-auth/react';
import { TRPCProvider } from './_trpc/Provider';
import { Navigation } from '@/components/Navigation';
import { Providers } from "./providers";

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
        <body className="font-roboto">
          <TRPCProvider>
            <Providers>
              <Navigation />
              {children}
            </Providers>
          </TRPCProvider>
        </body>
      </html>
    </SessionProvider>
  );
}