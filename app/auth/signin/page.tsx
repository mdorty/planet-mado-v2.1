"use client";

import { Card, CardHeader, CardBody } from '@heroui/react';
import { HeroUIWrapper } from '../../../components/HeroUIWrapper';
import { SignInForm } from '../../../components/SignInForm';
import { ResetPasswordForm } from '../../../components/ResetPasswordForm';
import { useState } from 'react';

export default function SignInPage() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <HeroUIWrapper>
      <div className="container mx-auto max-w-6xl px-4 py-8 min-h-screen">
        <h1 className="text-3xl font-anton mb-6">Sign In</h1>
        <div className="grid grid-cols-1 gap-8">
          <Card className="shadow-md rounded-lg p-6 max-w-md mx-auto w-full">
            <CardHeader className="border-b pb-3 mb-6">
              <h2 className="text-xl font-anton">Sign In Form</h2>
            </CardHeader>
            <CardBody>
              <SignInForm />
              <button 
                onClick={() => setShowForgotPassword(!showForgotPassword)} 
                className="mt-4 text-blue-600 hover:underline font-roboto text-sm"
              >
                Forgot Password?
              </button>
            </CardBody>
          </Card>
          {showForgotPassword && (
            <Card className="shadow-md rounded-lg p-6 max-w-md mx-auto w-full">
              <CardHeader className="border-b pb-3 mb-6">
                <h2 className="text-xl font-anton">Reset Password</h2>
              </CardHeader>
              <CardBody>
                <ResetPasswordForm />
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </HeroUIWrapper>
  );
}