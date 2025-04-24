"use client";

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { Video } from '@/lib/types/video';

interface VideoCardProps {
    video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
    return (
        <Link href={`/watch/${video._id}`} className="group">
            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                />
            </div>
            <div className="mt-2">
                <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">
                    {video.title}
                </h3>
                <div className="mt-1 text-sm text-gray-500">
                    <span>{video.views.toLocaleString()} views</span>
                    <span className="mx-1">•</span>
                    <span>{format(new Date(video.createdAt), 'MMM d, yyyy')}</span>
                </div>
            </div>
        </Link>
    );
}