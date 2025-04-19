'use client';

import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import Link from 'next/link';
import { HeroUIProvider, Button, Input, Card, CardHeader, CardBody, CardFooter } from '@heroui/react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const changePassword = trpc.auth.changePassword.useMutation({
    onSuccess: () => {
      setSuccess('Password changed successfully!');
      setError('');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    },
    onError: (err) => {
      setError(err.message);
      setSuccess('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    changePassword.mutate({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });
  };

  if (status === 'loading') {
    return <div className="text-center text-pm-text-dark">Loading...</div>;
  }

  if (status !== 'authenticated') {
    return (
      <div className="text-center p-8">
        <p className="font-roboto text-pm-text-dark">You must be logged in to view your profile.</p>
        <Link href="/auth/signin" className="font-roboto font-medium text-blue-600 hover:underline">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <HeroUIProvider>
      <div className="container mx-auto p-8 max-w-6xl">
        <h1 className="text-3xl font-anton text-pm-white mb-6">Profile</h1>
        <Card className="bg-pm-blue shadow-md rounded-lg p-6 max-w-lg mx-auto text-pm-white">
          <CardHeader className="border-b pb-3 mb-6">
            <h2 className="text-xl font-anton text-pm-white">Change Password</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-roboto font-medium text-pm-text-dark mb-1">Current Password</label>
                <Input
                  type="password"
                  value={form.currentPassword}
                  onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                  placeholder="Enter current password"
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block font-roboto font-medium text-pm-text-dark mb-1">New Password</label>
                <Input
                  type="password"
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block font-roboto font-medium text-pm-text-dark mb-1">Confirm New Password</label>
                <Input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  required
                  className="w-full"
                />
              </div>
              {error && <p className="text-red-500 font-roboto text-sm">{error}</p>}
              {success && <p className="text-green-500 font-roboto text-sm">{success}</p>}
              <Button type="submit" variant="solid" className="bg-blue-600 text-white hover:bg-blue-700 font-roboto font-medium w-full mt-4">
                Update Password
              </Button>
            </form>
          </CardBody>
          <CardFooter className="border-t pt-3 mt-6 text-center">
            <Link href="/" className="font-roboto font-medium text-blue-600 hover:underline">
              Back to Home
            </Link>
          </CardFooter>
        </Card>
      </div>
    </HeroUIProvider>
  );
}