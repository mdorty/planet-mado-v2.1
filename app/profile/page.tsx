'use client';

import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/trpc/client';
import { useState } from 'react';
import Link from 'next/link';

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
      <div className="text-center text-pm-text-dark">
        <p>Please sign in to change your password.</p>
        <Link href="/auth/signin" className="text-pm-nav-orange hover:text-pm-nav-orange-hover">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pm-white p-4">
      <div className="container max-w-md">
        <h1 className="text-3xl font-anton text-pm-text-dark mb-6">Change Password</h1>
        <div className="bg-pm-white border border-gray-300 p-6 rounded shadow-md">
          {error && <p className="text-red-600 mb-4">{error}</p>}
          {success && <p className="text-green-600 mb-4">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pm-text-dark">
                Current Password
              </label>
              <input
                type="password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-pm-white text-pm-text-dark"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pm-text-dark">
                New Password
              </label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-pm-white text-pm-text-dark"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-pm-text-dark">
                Confirm New Password
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-pm-white text-pm-text-dark"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-pm-nav-orange text-pm-white px-4 py-2 rounded hover:bg-pm-nav-orange-hover disabled:opacity-50"
              disabled={changePassword.isPending}
            >
              {changePassword.isPending ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}