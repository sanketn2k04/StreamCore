import { MainLayout } from '@/components/layout/MainLayout';
import { ChannelHeader } from '@/components/channel/ChannelHeader';
import { VideoGrid } from '@/components/videos/VideoGrid';
import { api } from '@/lib/api/axios';

interface ChannelPageProps {
    params: {
        userId: string;
    };
}

export default function ChannelPage({ params }: ChannelPageProps) {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <ChannelHeader userId={params.userId} />
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Uploaded Videos</h2>
                    <VideoGrid userId={params.userId} />
                </div>
            </div>
        </MainLayout>
    );
}