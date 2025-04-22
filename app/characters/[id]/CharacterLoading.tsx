'use client';

import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@heroui/react';

export default function CharacterLoading() {
  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-anton text-pm-white mb-6">Character Details</h1>
        <Link href="/characters" className="inline-block mb-4 hover:underline font-roboto text-pm-white">
          Back to Characters
        </Link>
        
        {/* Skeleton loading state */}
        <Card className="bg-pm-blue p-6 rounded shadow-md mb-8 text-pm-white">
          <CardHeader className="border-b pb-2 mb-4">
            <div className="h-8 w-48 bg-gray-600 animate-pulse rounded"></div>
          </CardHeader>
          <CardBody className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-6 bg-gray-600 animate-pulse rounded w-3/4"></div>
                ))}
              </div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-6 bg-gray-600 animate-pulse rounded w-3/4"></div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="h-8 w-48 bg-gray-600 animate-pulse rounded mb-4"></div>
              <div className="flex justify-center">
                <div className="w-[150px] h-[150px] rounded-full bg-gray-600 animate-pulse"></div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
