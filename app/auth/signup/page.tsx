"use client";

import { Card, CardHeader, CardBody, HeroUIProvider } from '@heroui/react';
import { SignUpForm } from '@/components/SignUpForm';

export default function SignUpPage() {
  return (
    <HeroUIProvider>
      <div className="container mx-auto max-w-6xl px-4 py-8 min-h-screen flex items-center justify-center">
        <Card className="bg-pm-blue shadow-md rounded-lg p-6 w-full max-w-md text-pm-white">
          <CardHeader className="border-b pb-3 mb-6">
            <h1 className="text-3xl font-anton text-pm-white">Sign Up</h1>
          </CardHeader>
          <CardBody>
            <SignUpForm />
          </CardBody>
        </Card>
      </div>
    </HeroUIProvider>
  );
}