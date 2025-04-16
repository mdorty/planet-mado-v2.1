"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardBody, Button, Input } from '@heroui/react';
import { HeroUIWrapper } from '../../../components/HeroUIWrapper';

// Page for resetting password using a token
export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const router = useRouter();
  const token = searchParams.token || '';

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setError('No reset token provided');
        setCheckingToken(false);
        return;
      }

      try {
        setCheckingToken(true);
        // For simplicity, we assume token check happens on submit
        // In a real app, you might want to validate token upfront via API
        setTokenValid(true);
      } catch (err) {
        setError('Invalid or expired token');
        setTokenValid(false);
      } finally {
        setCheckingToken(false);
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('No reset token provided');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/password-reset/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(true);
        setTimeout(() => router.push('/auth/signin'), 3000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error resetting password:', error);
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <HeroUIWrapper>
        <div className="container mx-auto max-w-6xl px-4 py-8 min-h-screen flex items-center justify-center">
          <Card className="shadow-md rounded-lg p-6 w-full max-w-md">
            <CardBody>
              <p>Checking token...</p>
            </CardBody>
          </Card>
        </div>
      </HeroUIWrapper>
    );
  }

  if (!tokenValid) {
    return (
      <HeroUIWrapper>
        <div className="container mx-auto max-w-6xl px-4 py-8 min-h-screen flex items-center justify-center">
          <Card className="shadow-md rounded-lg p-6 w-full max-w-md">
            <CardHeader className="border-b pb-3 mb-6">
              <h1 className="text-3xl font-anton">Reset Password</h1>
            </CardHeader>
            <CardBody>
              <p className="text-red-500">{error}</p>
              <p className="mt-4">
                <a href="/auth/signin" className="text-blue-500 hover:underline">Return to Sign In</a>
              </p>
            </CardBody>
          </Card>
        </div>
      </HeroUIWrapper>
    );
  }

  if (success) {
    return (
      <HeroUIWrapper>
        <div className="container mx-auto max-w-6xl px-4 py-8 min-h-screen flex items-center justify-center">
          <Card className="shadow-md rounded-lg p-6 w-full max-w-md">
            <CardHeader className="border-b pb-3 mb-6">
              <h1 className="text-3xl font-anton">Reset Password</h1>
            </CardHeader>
            <CardBody>
              <p className="text-green-500">Password reset successful! You will be redirected to the sign-in page shortly.</p>
            </CardBody>
          </Card>
        </div>
      </HeroUIWrapper>
    );
  }

  return (
    <HeroUIWrapper>
      <div className="container mx-auto max-w-6xl px-4 py-8 min-h-screen flex items-center justify-center">
        <Card className="shadow-md rounded-lg p-6 w-full max-w-md">
          <CardHeader className="border-b pb-3 mb-6">
            <h1 className="text-3xl font-anton">Reset Password</h1>
          </CardHeader>
          <CardBody>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium">
                  New Password
                </label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium">
                  Confirm New Password
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <Button type="submit" variant="solid" className="bg-blue-600 text-white hover:bg-blue-700 font-roboto font-medium w-full mt-4">
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </HeroUIWrapper>
  );
}
