'use client';

import { useState } from 'react';

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
    <div className="p-4 border rounded shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Reset Password (Test)</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="reset-password" className="block text-sm font-medium">
            New Password
          </label>
          <input
            id="reset-password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-500/80 disabled:bg-gray-400"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      {result && <p className={`mt-4 text-center ${result.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>{result}</p>}
    </div>
  );
}
