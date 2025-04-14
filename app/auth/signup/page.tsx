import { SignUpForm } from '@/components/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl text-dbz-orange mb-4">Sign Up</h1>
        <SignUpForm />
      </div>
    </div>
  );
}