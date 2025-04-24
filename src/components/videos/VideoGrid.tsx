"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { VideoCard } from './VideoCard';
import type { Video } from '@/lib/types/video';

interface VideoGridProps {
    userId?: string;
    sortBy?: 'views' | 'createdAt';
    limit?: number;
    searchQuery?: string;
}

export function VideoGrid({ userId, sortBy, limit, searchQuery }: VideoGridProps) {
    const { data, isLoading, error } = useQuery<{ data: { videos: Video[] } }>({
        queryKey: ['videos', userId, sortBy, limit, searchQuery],
        queryFn: () => {
            const params = new URLSearchParams();
            if (sortBy) params.append('sortBy', sortBy);
            if (limit) params.append('limit', limit.toString());
            if (searchQuery) params.append('q', searchQuery);

            const url = userId
                ? `/users/c/${userId}/videos`
                : '/videos/v/list';

            return api.get(`${url}?${params.toString()}`);
        },
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array(limit || 8).fill(null).map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 rounded-lg aspect-video" />
                        <div className="mt-2 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">Failed to load videos</p>
            </div>
        );
    }

    if (!data?.data.videos?.length) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">
                    {searchQuery ? 'No videos found matching your search' : 'No videos found'}
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.data.videos.map((video) => (
                <VideoCard key={video._id} video={video} />
            ))}
        </div>
    );
}