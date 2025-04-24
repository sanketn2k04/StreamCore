import { SignupForm } from '@/components/forms/SignupForm';

export default function SignupPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="mt-2 text-gray-600">Join StreamCore today</p>
                </div>
                <SignupForm />
            </div>
        </div>
    );
}