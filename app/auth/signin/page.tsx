import { SignInForm } from '../../../components/SignInForm';
import { ForgotPasswordForm } from '../../../components/ForgotPasswordForm';

export default function SignInPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-anton mb-6">Sign In</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">Sign In Form</h2>
          <SignInForm />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Forgot Password?</h2>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}