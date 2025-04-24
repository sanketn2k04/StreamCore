import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { VideoGrid } from '@/components/videos/VideoGrid';
import { Lock } from 'lucide-react';
import { api } from '@/lib/api/axios';

interface PlaylistPageProps {
    params: {
        playlistId: string;
    };
}

export default function PlaylistPage({ params }: PlaylistPageProps) {
    const { data, isLoading } = useQuery({
        queryKey: ['playlist', params.playlistId],
        queryFn: () => api.get(`/playlists/${params.playlistId}`),
    });

    if (isLoading) {
        return (
            <MainLayout>
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array(8).fill(null).map((_, i) => (
                                <div key={i} className="aspect-video bg-gray-200 rounded" />
                            ))}
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const playlist = data?.data.playlist;

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-semibold">{playlist.name}</h1>
                        {playlist.isPrivate && (
                            <Lock className="h-5 w-5 text-gray-500" />
                        )}
                    </div>
                    {playlist.description && (
                        <p className="text-gray-600 mt-2">{playlist.description}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-4">
                        {playlist.videos.length} {playlist.videos.length === 1 ? 'video' : 'videos'}
                    </p>
                </div>

                <VideoGrid videos={playlist.videos} />
            </div>
        </MainLayout>
    );
}