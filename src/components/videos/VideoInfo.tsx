import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, ThumbsDown, Share, ListPlus } from 'lucide-react';
import { api } from '@/lib/api/axios';
import { useAuthStore } from '@/store/auth';
import { useSubscriptionStore } from '@/store/subscription';
import { toast } from 'react-hot-toast';
import { PlaylistModal } from './PlaylistModal';
import type { Video } from '@/lib/types/video';

interface VideoInfoProps {
    videoId: string;
}

export function VideoInfo({ videoId }: VideoInfoProps) {
    const { user } = useAuthStore();
    const {
        subscribedChannels,
        likedVideos,
        dislikedVideos,
        toggleSubscription,
        toggleLike,
        toggleDislike
    } = useSubscriptionStore();

    const { data, isLoading } = useQuery<{ data: { video: Video } }>({
        queryKey: ['video-info', videoId],
        queryFn: () => api.get(`/videos/v/video-profile/${videoId}`),
    });

    const [showFullDescription, setShowFullDescription] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);

    const handleShare = async () => {
        try {
            setSharing(true);
            await navigator.clipboard.writeText(window.location.href);
            await api.post(`/videos/v/${videoId}/share`);
            toast.success('Video link copied to clipboard');
        } catch (err) {
            toast.error('Failed to share video');
        } finally {
            setSharing(false);
        }
    };

    const handleSubscribe = async () => {
        if (!user) {
            toast.error('Please sign in to subscribe');
            return;
        }

        try {
            await toggleSubscription(data?.data.video.owner._id || '');
            toast.success(
                subscribedChannels.includes(data?.data.video.owner._id || '')
                    ? 'Unsubscribed successfully'
                    : 'Subscribed successfully'
            );
        } catch (err) {
            toast.error('Failed to update subscription');
        }
    };

    const handleLike = async () => {
        if (!user) {
            toast.error('Please sign in to like videos');
            return;
        }

        try {
            await toggleLike(videoId);
        } catch (err) {
            toast.error('Failed to update like');
        }
    };

    const handleDislike = async () => {
        if (!user) {
            toast.error('Please sign in to dislike videos');
            return;
        }

        try {
            await toggleDislike(videoId);
        } catch (err) {
            toast.error('Failed to update dislike');
        }
    };

    if (isLoading || !data?.data.video) {
        return <div className="animate-pulse h-32 bg-gray-100 rounded-lg" />;
    }

    const { video } = data.data;
    const isSubscribed = subscribedChannels.includes(video.owner._id);
    const isLiked = likedVideos.includes(videoId);
    const isDisliked = dislikedVideos.includes(videoId);

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold text-gray-900">{video.title}</h1>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href={`/channel/${video.owner._id}`}>
                        <div className="flex items-center gap-2">
                            <Image
                                src={video.owner.avatar}
                                alt={video.owner.username}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {video.owner.username}
                                </p>
                                {/* Add subscriber count here when available */}
                            </div>
                        </div>
                    </Link>
                    {user && user._id !== video.owner._id && (
                        <button
                            onClick={handleSubscribe}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${isSubscribed
                                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                }`}
                        >
                            {isSubscribed ? 'Subscribed' : 'Subscribe'}
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center rounded-full bg-gray-100">
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-1 px-4 py-2 hover:bg-gray-200 rounded-l-full ${isLiked ? 'text-blue-600' : ''
                                }`}
                            disabled={!user}
                        >
                            <ThumbsUp className={`h-5 w-5 ${!user ? 'text-gray-400' : ''}`} />
                            <span>{video.likes}</span>
                        </button>
                        <div className="w-px h-6 bg-gray-300" />
                        <button
                            onClick={handleDislike}
                            className={`flex items-center gap-1 px-4 py-2 hover:bg-gray-200 rounded-r-full ${isDisliked ? 'text-blue-600' : ''
                                }`}
                            disabled={!user}
                        >
                            <ThumbsDown className={`h-5 w-5 ${!user ? 'text-gray-400' : ''}`} />
                            <span>{video.dislikes}</span>
                        </button>
                    </div>

                    <button
                        onClick={() => user ? setShowPlaylistModal(true) : toast.error('Please sign in to save to playlist')}
                        className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100"
                    >
                        <ListPlus className="h-5 w-5" />
                        Save
                    </button>

                    <button
                        onClick={handleShare}
                        disabled={sharing}
                        className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100"
                    >
                        <Share className="h-5 w-5" />
                        Share
                    </button>
                </div>
            </div>

            <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span>{video.views.toLocaleString()} views</span>
                    <span>•</span>
                    <span>
                        {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                    </span>
                </div>

                {video.description && (
                    <div className="relative">
                        <p
                            className={`text-sm text-gray-900 whitespace-pre-wrap ${!showFullDescription && 'line-clamp-2'
                                }`}
                        >
                            {video.description}
                        </p>
                        {video.description.split('\n').length > 2 && (
                            <button
                                onClick={() => setShowFullDescription((prev) => !prev)}
                                className="text-sm text-blue-600 hover:text-blue-700 mt-1"
                            >
                                {showFullDescription ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </div>
                )}
            </div>

            {showPlaylistModal && (
                <PlaylistModal
                    videoId={videoId}
                    isOpen={showPlaylistModal}
                    onClose={() => setShowPlaylistModal(false)}
                />
            )}
        </div>
    );
}