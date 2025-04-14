'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';

export function SignUpForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const signupMutation = trpc.auth.signup.useMutation({
    onSuccess: () => {
      router.push('/auth/signin');
    },
    onError: (err) => {
      setError(err.message || 'Failed to sign up');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    signupMutation.mutate({
      username,
      email,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label htmlFor="username" className="block text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        disabled={signupMutation.isLoading}
        className="w-full bg-dbz-blue text-white p-2 rounded hover:bg-dbz-blue/80 disabled:opacity-50"
      >
        {signupMutation.isLoading ? 'Signing Up...' : 'Sign Up'}
      </button>
      <p className="text-sm">
        Already have an account?{' '}
        <a href="/auth/signin" className="text-dbz-orange hover:underline">
          Sign In
        </a>
      </p>
    </form>
  );
}