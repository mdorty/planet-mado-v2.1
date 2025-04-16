'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <span>Loading...</span>;
  }

  if (status === 'authenticated') {
    return (
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    );
  }

  return (
    <Link
      href="/auth/signin"
      className="px-4 py-2 rounded hover:bg-dbz-blue/80"
    >
      Sign In
    </Link>
  );
}