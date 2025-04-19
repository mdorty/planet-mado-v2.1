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
        <label htmlFor="email" className="block font-roboto font-medium mb-1 text-pm-white">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
        />
      </div>
      <div>
        <label htmlFor="password" className="block font-roboto font-medium mb-1 text-pm-white">
          Password
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
          className="w-full border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white/90 text-gray-900 placeholder-gray-400 font-roboto"
        />
      </div>
      <Button type="submit" variant="solid" className="w-full font-roboto font-medium bg-blue-600 text-white hover:bg-blue-700">
        Sign In
      </Button>
      <p className="text-sm text-pm-white">
        Don't have an account?{' '}
        <a href="/auth/signup" className="text-blue-400 hover:text-blue-300 hover:underline">
          Sign Up
        </a>
      </p>
    </form>
  );
}