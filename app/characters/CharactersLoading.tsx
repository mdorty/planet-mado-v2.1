'use client';

import { Card, CardHeader, CardBody, CardFooter } from '@heroui/react';

export default function CharactersLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="bg-pm-blue shadow-md rounded-lg overflow-hidden animate-pulse text-pm-white">
          <CardHeader className="border-b pb-2 bg-pm-dark-blue">
            <div className="h-6 bg-gray-600 rounded w-3/4"></div>
          </CardHeader>
          <CardBody className="p-4 flex flex-col gap-2">
            <div className="h-4 bg-gray-600 rounded w-1/2"></div>
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-600 rounded w-1/2"></div>
          </CardBody>
          <CardFooter className="p-4 pt-0">
            <div className="h-10 bg-gray-600 rounded w-full"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
