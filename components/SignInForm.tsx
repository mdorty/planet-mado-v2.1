"use client";

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@heroui/react';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/characters');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 font-roboto">{error}</p>}
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
          placeholder="Enter your password"
          required
          className="w-full"
        />
      </div>
      <Button type="submit" variant="solid" className="w-full font-roboto font-medium">
        Sign In
      </Button>
      <p className="text-sm">
        Don't have an account?{' '}
        <a href="/auth/signup" className="hover:underline">
          Sign Up
        </a>
      </p>
    </form>
  );
}