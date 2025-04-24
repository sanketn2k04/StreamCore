import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/lib/api/axios';
import type { VideoUploadInput } from '@/lib/types/video';

const videoUploadSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    videoFile: z.any().refine((file) => file instanceof File, 'Video file is required'),
    thumbnail: z.any().refine((file) => file instanceof File, 'Thumbnail is required'),
    duration: z.number().min(1, 'Duration is required'),
});

export function VideoUploadForm() {
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setValue,
    } = useForm<VideoUploadInput>({
        resolver: zodResolver(videoUploadSchema),
    });

    const handleVideoFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Create video element to get duration
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = () => {
            setValue('duration', Math.round(video.duration));
        };

        video.src = URL.createObjectURL(file);
    };

    const onSubmit = async (data: VideoUploadInput) => {
        try {
            setUploading(true);
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value) formData.append(key, value);
            });

            await api.post('/videos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to upload video');
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
                <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    {...register('title')}
                    type="text"
                    id="title"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter video title"
                />
                {errors.title && (
                    <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Description (Optional)
                </label>
                <textarea
                    {...register('description')}
                    id="description"
                    rows={4}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter video description"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="video" className="text-sm font-medium text-gray-700">
                    Video File
                </label>
                <input
                    {...register('videoFile')}
                    type="file"
                    id="video"
                    accept="video/*"
                    onChange={handleVideoFileChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.videoFile && (
                    <p className="text-sm text-red-500">{errors.videoFile.message}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="thumbnail" className="text-sm font-medium text-gray-700">
                    Thumbnail
                </label>
                <input
                    {...register('thumbnail')}
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {errors.thumbnail && (
                    <p className="text-sm text-red-500">{errors.thumbnail.message}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={uploading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
                {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
        </form>
    );
}