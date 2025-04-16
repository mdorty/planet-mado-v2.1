"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import { Input, Button } from '@heroui/react';

export function SignUpForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const signupMutation = trpc.auth.signUp.useMutation({
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
      {error && <p className="text-red-500 font-roboto">{error}</p>}
      <div>
        <label htmlFor="username" className="block font-roboto font-medium mb-1">
          Username
        </label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          required
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="email" className="block font-roboto font-medium mb-1">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full"
        />
      </div>
      <div>
        <label htmlFor="password" className="block font-roboto font-medium mb-1">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          required
          className="w-full"
        />
      </div>
      <Button
        type="submit"
        variant="solid"
        disabled={signupMutation.isPending}
        className="w-full font-roboto font-medium"
      >
        {signupMutation.isPending ? 'Creating Account...' : 'Sign Up'}
      </Button>
      <p className="text-sm">
        Already have an account?{' '}
        <a href="/auth/signin" className="hover:underline">
          Sign In
        </a>
      </p>
    </form>
  );
}