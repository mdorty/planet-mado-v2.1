"use client";

import { Card, CardHeader, CardBody } from '@heroui/react';
import { HeroUIWrapper } from '../../../components/HeroUIWrapper';
import { SignInForm } from '../../../components/SignInForm';
import { ForgotPasswordForm } from '../../../components/ForgotPasswordForm';

export default function SignInPage() {
  return (
    <HeroUIWrapper>
      <div className="container mx-auto max-w-6xl px-4 py-8 min-h-screen">
        <h1 className="text-3xl font-anton mb-6">Sign In</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-md rounded-lg p-6">
            <CardHeader className="border-b pb-3 mb-6">
              <h2 className="text-xl font-anton">Sign In Form</h2>
            </CardHeader>
            <CardBody>
              <SignInForm />
            </CardBody>
          </Card>
          <Card className="shadow-md rounded-lg p-6">
            <CardHeader className="border-b pb-3 mb-6">
              <h2 className="text-xl font-anton">Forgot Password?</h2>
            </CardHeader>
            <CardBody>
              <ForgotPasswordForm />
            </CardBody>
          </Card>
        </div>
      </div>
    </HeroUIWrapper>
  );
}