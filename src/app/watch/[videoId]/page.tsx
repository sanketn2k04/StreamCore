import { Suspense, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoPlayer } from '@/components/videos/VideoPlayer';
import { VideoInfo } from '@/components/videos/VideoInfo';
import { CommentSection } from '@/components/comments/CommentSection';
import { RelatedVideos } from '@/components/videos/RelatedVideos';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import type { Video } from '@/lib/types/video';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useHistoryStore } from '@/store/history';

interface WatchPageProps {
    params: {
        videoId: string;
    };
}

export default function WatchPage({ params }: WatchPageProps) {
    const { data, isLoading } = useQuery<{ data: { video: Video } }>({
        queryKey: ['video', params.videoId],
        queryFn: () => api.get(`/videos/v/${params.videoId}`),
    });

    const addToHistory = useHistoryStore((state) => state.addToHistory);

    useEffect(() => {
        if (data?.data.video) {
            addToHistory(data.data.video);
        }
    }, [data?.data.video, addToHistory]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!data?.data.video) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Video not found</p>
            </div>
        );
    }

    const { video } = data.data;

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <VideoPlayer videoId={params.videoId} />
                        <VideoInfo video={video} />
                        <CommentSection videoId={params.videoId} />
                    </div>
                    <div className="lg:col-span-1">
                        <RelatedVideos
                            currentVideoId={params.videoId}
                            tags={video.tags}
                            userId={video.user._id}
                        />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}