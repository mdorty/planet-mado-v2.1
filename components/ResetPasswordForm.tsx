'use client';

import { useState } from 'react';
import { Input, Button } from '@heroui/react';

// Temporary component to reset password via API
export function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      console.log('Resetting password with:', { email, newPassword });
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setResult('Password reset successful!');
      } else {
        setResult(data.message || 'Password reset failed.');
      }
    } catch (error) {
      setResult('Error occurred during reset.');
      console.error('Error resetting password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reset-email" className="block font-roboto font-medium mb-1 text-pm-white">
          Email
        </label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
          required
        />
      </div>
      <div>
        <label htmlFor="reset-password" className="block font-roboto font-medium mb-1 text-pm-white">
          New Password
        </label>
        <Input
          id="reset-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        variant="solid"
        className="w-full font-roboto font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Resetting...' : 'Reset Password'}
      </Button>
      {result && <p className={`mt-4 text-center font-roboto ${result.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>{result}</p>}
    </form>
  );
}
