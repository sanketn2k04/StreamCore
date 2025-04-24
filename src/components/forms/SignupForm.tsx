import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth';
import type { RegisterInput } from '@/lib/types/user';

const signupSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    avatar: z.any().optional(),
    coverImage: z.any().optional(),
});

export function SignupForm() {
    const [error, setError] = useState('');
    const router = useRouter();
    const register = useAuthStore((state) => state.register);

    const {
        register: registerField,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: RegisterInput) => {
        try {
            await register(data);
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-gray-700">
                    Username
                </label>
                <input
                    {...registerField('username')}
                    type="text"
                    id="username"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Choose a username"
                />
                {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    {...registerField('email')}
                    type="email"
                    id="email"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                />
                {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    {...registerField('password')}
                    type="password"
                    id="password"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Create a password"
                />
                {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="avatar" className="text-sm font-medium text-gray-700">
                    Profile Picture (Optional)
                </label>
                <input
                    {...registerField('avatar')}
                    type="file"
                    id="avatar"
                    accept="image/*"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="coverImage" className="text-sm font-medium text-gray-700">
                    Cover Image (Optional)
                </label>
                <input
                    {...registerField('coverImage')}
                    type="file"
                    id="coverImage"
                    accept="image/*"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
        </form>
    );
}