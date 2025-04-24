import { useQuery } from '@tanstack/react-query';
import { VideoCard } from './VideoCard';
import { api } from '@/lib/api/axios';
import type { Video } from '@/lib/types/video';

interface RelatedVideosProps {
    currentVideoId: string;
    tags?: string[];
    userId?: string;
}

export function RelatedVideos({ currentVideoId, tags = [], userId }: RelatedVideosProps) {
    const { data, isLoading } = useQuery({
        queryKey: ['related-videos', currentVideoId, tags, userId],
        queryFn: async () => {
            const response = await api.get('/videos/related', {
                params: {
                    videoId: currentVideoId,
                    tags: tags.join(','),
                    userId,
                },
            });
            return response.data.videos as Video[];
        },
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array(4)
                    .fill(null)
                    .map((_, i) => (
                        <div
                            key={i}
                            className="w-full aspect-video bg-gray-200 animate-pulse rounded-lg"
                        />
                    ))}
            </div>
        );
    }

    if (!data?.length) {
        return (
            <div className="text-center py-8 text-gray-500">
                No related videos found
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="font-semibold text-lg">Related Videos</h2>
            <div className="grid gap-4">
                {data.map((video) => (
                    <VideoCard
                        key={video._id}
                        video={video}
                        layout="horizontal"
                        showChannel
                    />
                ))}
            </div>
        </div>
    );
}