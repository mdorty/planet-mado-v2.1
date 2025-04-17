'use client';

import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeroUIProvider, Button, Card, CardHeader, CardBody } from '@heroui/react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className="text-center">Loading...</div>;
  }

  if (!session || status !== 'authenticated' || session?.user?.role !== 'admin') {
    return (
      <div className="text-center p-8">
        <p className="font-roboto">Access denied. Admins only.</p>
        <Link href="/" className="font-roboto font-medium text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <HeroUIProvider>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-anton mb-6">Admin Dashboard</h1>

          {/* Navigation Links to Separate Management Pages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <CardHeader className="border-b pb-2 mb-4">
                <h2 className="text-xl font-anton">Manage Users</h2>
              </CardHeader>
              <CardBody>
                <p className="font-roboto text-gray-600 mb-4">Create, update, or delete user accounts.</p>
                <Link href="/admin/users">
                  <Button variant="solid" className="bg-blue-600 text-white hover:bg-blue-700 font-roboto font-medium">
                    Go to Users
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <CardHeader className="border-b pb-2 mb-4">
                <h2 className="text-xl font-anton">Manage Characters</h2>
              </CardHeader>
              <CardBody>
                <p className="font-roboto text-gray-600 mb-4">View, edit, or remove character profiles.</p>
                <Link href="/admin/characters">
                  <Button variant="solid" className="bg-blue-600 text-white hover:bg-blue-700 font-roboto font-medium">
                    Go to Characters
                  </Button>
                </Link>
              </CardBody>
            </Card>

            <Card className="bg-gray-50 p-6 rounded-lg shadow-sm text-center">
              <CardHeader className="border-b pb-2 mb-4">
                <h2 className="text-xl font-anton text-pm-text-dark">Manage Content</h2>
              </CardHeader>
              <CardBody>
                <p className="font-roboto text-gray-600 mb-4">Edit site content, announcements, or rules.</p>
                <Link href="/admin/maps">
                  <Button variant="solid" className="bg-blue-600 text-white hover:bg-blue-700 font-roboto font-medium">
                    Go to Maps
                  </Button>
                </Link>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </HeroUIProvider>
  );
}