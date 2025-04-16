"use client";

import { useState } from 'react';
import { Input, Button } from '@heroui/react';

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
          <label htmlFor="forgot-email" className="block font-roboto font-medium text-pm-text-dark mb-1">
            Email
          </label>
          <Input
            id="forgot-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full"
          />
        </div>
        <Button
          type="submit"
          variant="solid"
          disabled={loading}
          className="bg-pm-nav-orange text-white hover:bg-orange-700 w-full font-roboto font-medium"
        >
          {loading ? 'Sending...' : 'Reset Password'}
        </Button>
        {result && (
          <div className="mt-4 font-roboto text-pm-text-dark">
            {result}
            {resetUrl && (
              <div className="mt-2">
                <a href={resetUrl} className="text-blue-600 hover:underline font-medium">
                  Click here to reset your password
                </a>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
