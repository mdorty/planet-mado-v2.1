'use client';

import { useState } from 'react';

// Temporary component to test password validation via API
export function TestPasswordForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      console.log('Testing password with:', { email, password });
      const response = await fetch('/api/test-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setResult('Password is valid!' );
      } else {
        setResult(data.message || 'Password test failed.');
      }
    } catch (error) {
      setResult('Error occurred during test.');
      console.error('Error testing password:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Test Password Validation</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="test-email" className="block text-sm font-medium">
            Email
          </label>
          <input
            id="test-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="test-password" className="block text-sm font-medium">
            Password
          </label>
          <input
            id="test-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-500/80 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test Password'}
        </button>
      </form>
      {result && <p className={`mt-4 text-center ${result.includes('valid') ? 'text-green-500' : 'text-red-500'}`}>{result}</p>}
    </div>
  );
}
