'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { HeroUIProvider, Button } from '@heroui/react';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <HeroUIProvider>
    <div className="text-center p-8">
      <h1 className="text-4xl mb-4 font-anton">
        Welcome to DBZ RPG!
      </h1>
      <p className="text-lg mb-6 font-roboto">
        {status === 'authenticated'
          ? `Welcome back, ${session.user?.name}! Create your character and battle in the Dragon Ball Z universe.`
          : 'Sign up or sign in to create your character and battle in the Dragon Ball Z universe.'}
      </p>
      <Link
        href={status === 'authenticated' ? '/characters' : '/auth/signin'}
      >
        <Button variant="solid" className="text-white font-roboto font-medium">
          {status === 'authenticated' ? 'Go to Characters' : 'Get Started'}
        </Button>
      </Link>
    </div>
    </HeroUIProvider>
  );
}