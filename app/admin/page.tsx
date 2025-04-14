'use client';

import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="text-center">Loading...</div>;
  }

  if (status !== 'authenticated' || session?.user?.role !== 'admin') {
    return (
      <div className="text-center">
        <p>Access denied. Admins only.</p>
        <Link href="/" className="text-dbz-orange hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl text-dbz-orange mb-6">Admin Dashboard</h1>

        {/* Navigation Links to Separate Management Pages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-anton mb-2">Manage Users</h2>
            <p className="font-roboto text-gray-600 mb-4">Create, update, or delete user accounts.</p>
            <Link href="/admin/users" className="inline-block bg-pm-nav-orange text-white font-roboto font-medium py-2 px-4 rounded-md hover:opacity-90 transition-opacity">
              Go to Users
            </Link>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-anton mb-2">Manage Characters</h2>
            <p className="font-roboto text-gray-600 mb-4">View, edit, or remove character profiles.</p>
            <Link href="/admin/characters" className="inline-block bg-pm-nav-orange text-white font-roboto font-medium py-2 px-4 rounded-md hover:opacity-90 transition-opacity">
              Go to Characters
            </Link>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-anton mb-2">Manage Maps</h2>
            <p className="font-roboto text-gray-600 mb-4">Create, edit, and delete game maps</p>
            <Link href="/admin/maps" className="inline-block bg-pm-nav-orange text-white font-roboto font-medium py-2 px-4 rounded-md hover:opacity-90 transition-opacity">
              Go to Maps
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}