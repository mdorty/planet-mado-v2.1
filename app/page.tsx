'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl text-dbz-orange mb-4">
        Welcome to DBZ RPG!
      </h1>
      <p className="text-lg mb-6">
        {status === 'authenticated'
          ? `Welcome back, ${session.user?.name}! Create your character and battle in the Dragon Ball Z universe.`
          : 'Sign up or sign in to create your character and battle in the Dragon Ball Z universe.'}
      </p>
      <Link
        href={status === 'authenticated' ? '/characters' : '/auth/signin'}
        className="bg-dbz-blue text-white px-4 py-2 rounded hover:bg-dbz-blue/80"
      >
        {status === 'authenticated' ? 'Go to Characters' : 'Get Started'}
      </Link>
    </div>
  );
}