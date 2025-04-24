import { MainLayout } from '@/components/layout/MainLayout';

export default function ChannelLoading() {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                {/* Channel header skeleton */}
                <div className="space-y-4">
                    <div className="relative h-48 rounded-lg bg-gray-200 animate-pulse" />
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
                                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                            </div>
                        </div>
                        <div className="h-10 w-28 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                </div>

                {/* Videos grid skeleton */}
                <div className="mt-8">
                    <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array(8).fill(null).map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-video bg-gray-200 rounded-lg" />
                                <div className="mt-2 flex gap-3">
                                    <div className="h-9 w-9 rounded-full bg-gray-200" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}