'use client';

import { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <MainLayout>
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
                <p className="text-gray-600 mb-6">{error.message}</p>
                <button
                    onClick={reset}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Try again
                </button>
            </div>
        </MainLayout>
    );
}