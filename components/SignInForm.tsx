'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SignInForm() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    console.log('Attempting sign in with endpoint:', window.location.origin + '/api/auth/callback/credentials');
    
    // Get values directly from form inputs
    const form = e.currentTarget;
    const formEmail = form.elements.namedItem('email') as HTMLInputElement;
    const formPassword = form.elements.namedItem('password') as HTMLInputElement;
    const email = formEmail ? formEmail.value : '';
    const password = formPassword ? formPassword.value : '';
    console.log('Credentials directly from form inputs:', { email, password });

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
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
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
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-dbz-blue text-white p-2 rounded hover:bg-dbz-blue/80"
      >
        Sign In
      </button>
      <p className="text-sm">
        Don't have an account?{' '}
        <a href="/auth/signup" className="text-dbz-orange hover:underline">
          Sign Up
        </a>
      </p>
    </form>
  );
}