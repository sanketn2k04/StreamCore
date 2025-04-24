import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth';
import { useSubscription } from '@/lib/hooks/useSubscription';
import { api } from '@/lib/api/axios';
import type { User } from '@/lib/types/user';

interface ChannelHeaderProps {
    userId: string;
}

export function ChannelHeader({ userId }: ChannelHeaderProps) {
    const { user: currentUser } = useAuthStore();
    const { data, isLoading } = useQuery<{ data: { user: User } }>({
        queryKey: ['channel', userId],
        queryFn: () => api.get(`/users/c/${userId}`),
    });

    const { isSubscribed, subscribe, isLoading: isSubscribing } = useSubscription(userId);

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-32 bg-gray-200 rounded-lg w-full" />
                <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                        <div className="h-4 w-48 bg-gray-200 rounded" />
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    const channel = data?.data.user;
    if (!channel) return null;

    return (
        <div className="space-y-4">
            <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                {channel.coverImage && (
                    <Image
                        src={channel.coverImage}
                        alt={`${channel.username}'s cover`}
                        fill
                        className="object-cover"
                    />
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Image
                        src={channel.avatar}
                        alt={channel.username}
                        width={64}
                        height={64}
                        className="rounded-full"
                    />
                    <div>
                        <h1 className="text-2xl font-bold">{channel.username}</h1>
                        {/* Add subscriber count here when available */}
                        <p className="text-gray-600">Joined {new Date(channel.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {currentUser && currentUser._id !== userId && (
                    <button
                        onClick={() => subscribe()}
                        disabled={isSubscribing}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${isSubscribed
                                ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                    >
                        {isSubscribed ? 'Subscribed' : 'Subscribe'}
                    </button>
                )}
            </div>
        </div>
    );
}