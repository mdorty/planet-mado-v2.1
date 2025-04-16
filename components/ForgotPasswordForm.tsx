'use client';

import { useState } from 'react';

// Component for requesting a password reset
export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setResetUrl(null);

    try {
      console.log('Requesting password reset for:', email);
      const response = await fetch('/api/password-reset/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setResult(data.message || 'Request processed.');
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch (error) {
      setResult('Error occurred during request.');
      console.error('Error requesting password reset:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="forgot-email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-500/80 disabled:bg-gray-400"
        >
          {loading ? 'Requesting...' : 'Request Reset Link'}
        </button>
      </form>
      {result && <p className="mt-4 text-center text-sm">{result}</p>}
      {resetUrl && (
        <p className="mt-2 text-center text-sm">
          <a href={resetUrl} className="text-blue-500 hover:underline">Click here to reset your password</a>
        </p>
      )}
    </div>
  );
}
