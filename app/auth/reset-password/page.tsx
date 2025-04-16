"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    return <div className="container mx-auto max-w-6xl px-4 py-8">Checking token...</div>;
  }

  if (!tokenValid) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-anton mb-6">Reset Password</h1>
        <p className="text-red-500">{error}</p>
        <p className="mt-4">
          <a href="/auth/signin" className="text-blue-500 hover:underline">Return to Sign In</a>
        </p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-anton mb-6">Reset Password</h1>
        <p className="text-green-500">Password reset successful! You will be redirected to the sign-in page shortly.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-anton mb-6">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        {error && <p className="text-red-500">{error}</p>}
        <div>
          <label htmlFor="new-password" className="block text-sm font-medium">
            New Password
          </label>
          <input
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
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-dbz-blue text-white p-2 rounded hover:bg-dbz-blue/80 disabled:bg-gray-400"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
