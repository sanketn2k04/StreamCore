import { MainLayout } from '@/components/layout/MainLayout';

export default function WatchLoading() {
    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto py-6 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Video player skeleton */}
                        <div className="aspect-video bg-gray-200 rounded-lg animate-pulse" />

                        {/* Video info skeleton */}
                        <div className="space-y-4">
                            <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                                        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                                    </div>
                                </div>
                                <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse" />
                            </div>
                        </div>

                        {/* Comments skeleton */}
                        <div className="space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
                            {Array(3).fill(null).map((_, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                                        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Related videos skeleton */}
                    <div className="hidden lg:block space-y-4">
                        {Array(4).fill(null).map((_, i) => (
                            <div key={i} className="flex gap-2">
                                <div className="w-40 aspect-video bg-gray-200 rounded animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}