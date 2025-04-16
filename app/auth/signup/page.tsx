"use client";

import { Card, CardHeader, CardBody } from '@heroui/react';
import { HeroUIWrapper } from '@/components/HeroUIWrapper';
import { SignUpForm } from '@/components/SignUpForm';

export default function SignUpPage() {
  return (
    <HeroUIWrapper>
      <div className="container mx-auto max-w-6xl px-4 py-8 min-h-screen flex items-center justify-center">
        <Card className="shadow-md rounded-lg p-6 w-full max-w-md">
          <CardHeader className="border-b pb-3 mb-6">
            <h1 className="text-3xl font-anton">Sign Up</h1>
          </CardHeader>
          <CardBody>
            <SignUpForm />
          </CardBody>
        </Card>
      </div>
    </HeroUIWrapper>
  );
}