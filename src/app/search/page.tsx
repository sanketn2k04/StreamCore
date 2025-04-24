import { MainLayout } from '@/components/layout/MainLayout';
import { VideoGrid } from '@/components/videos/VideoGrid';

interface SearchPageProps {
    searchParams: {
        q?: string;
    };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-semibold mb-6">
                    {searchParams.q
                        ? `Search results for "${searchParams.q}"`
                        : 'Search videos'
                    }
                </h1>
                <VideoGrid searchQuery={searchParams.q} />
            </div>
        </MainLayout>
    );
}