import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DBZ RPG - Auth',
  description: 'Sign in or sign up to play DBZ RPG',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full">
        {children}
      </div>
    </div>
  );
}