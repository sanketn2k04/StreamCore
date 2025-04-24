import React from 'react'
import { LoginForm } from '@/components/forms/LoginForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                    <p className="mt-2 text-gray-600">Sign in to continue to StreamCore</p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
