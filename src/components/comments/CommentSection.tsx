import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MoreVertical, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api/axios';
import { toast } from 'react-hot-toast';

interface Comment {
    _id: string;
    content: string;
    user: {
        _id: string;
        username: string;
        avatar: string;
    };
    createdAt: string;
}

interface CommentSectionProps {
    videoId: string;
}

export function CommentSection({ videoId }: CommentSectionProps) {
    const [comment, setComment] = useState('');
    const [showOptions, setShowOptions] = useState<string | null>(null);
    const { user } = useAuthStore();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery<{ data: { comments: Comment[] } }>({
        queryKey: ['video-comments', videoId],
        queryFn: () => api.get(`/videos/v/${videoId}/comments`),
    });

    const addCommentMutation = useMutation({
        mutationFn: async (content: string) => {
            const response = await api.post(`/videos/v/${videoId}/comments`, { content });
            return response.data.comment;
        },
        onMutate: async (newComment) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['video-comments', videoId] });

            // Get the current comments
            const previousComments = queryClient.getQueryData<{ data: { comments: Comment[] } }>([
                'video-comments',
                videoId,
            ]);

            // Optimistically update the comments
            if (previousComments && user) {
                queryClient.setQueryData(['video-comments', videoId], {
                    data: {
                        comments: [
                            {
                                _id: Date.now().toString(),
                                content: newComment,
                                user: {
                                    _id: user._id,
                                    username: user.username,
                                    avatar: user.avatar,
                                },
                                createdAt: new Date().toISOString(),
                            },
                            ...previousComments.data.comments,
                        ],
                    },
                });
            }

            return { previousComments };
        },
        onError: (err, newComment, context) => {
            // Revert the optimistic update on error
            if (context?.previousComments) {
                queryClient.setQueryData(['video-comments', videoId], context.previousComments);
            }
            toast.error('Failed to add comment');
        },
        onSettled: () => {
            // Refetch to ensure server state
            queryClient.invalidateQueries({ queryKey: ['video-comments', videoId] });
        },
    });

    const deleteCommentMutation = useMutation({
        mutationFn: async (commentId: string) => {
            await api.delete(`/videos/v/${videoId}/comments/${commentId}`);
        },
        onMutate: async (commentId) => {
            await queryClient.cancelQueries({ queryKey: ['video-comments', videoId] });

            const previousComments = queryClient.getQueryData<{ data: { comments: Comment[] } }>([
                'video-comments',
                videoId,
            ]);

            if (previousComments) {
                queryClient.setQueryData(['video-comments', videoId], {
                    data: {
                        comments: previousComments.data.comments.filter(
                            (comment) => comment._id !== commentId
                        ),
                    },
                });
            }

            return { previousComments };
        },
        onError: (err, commentId, context) => {
            if (context?.previousComments) {
                queryClient.setQueryData(['video-comments', videoId], context.previousComments);
            }
            toast.error('Failed to delete comment');
        },
        onSuccess: () => {
            toast.success('Comment deleted');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['video-comments', videoId] });
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim() || !user) return;

        try {
            await addCommentMutation.mutateAsync(comment.trim());
            setComment('');
        } catch (err) {
            // Error is handled in mutation callbacks
        }
    };

    const handleDelete = async (commentId: string) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            await deleteCommentMutation.mutateAsync(commentId);
            setShowOptions(null);
        } catch (err) {
            // Error is handled in mutation callbacks
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                {Array(3).fill(null).map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="h-10 w-10 rounded-full bg-gray-200" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">
                {data?.data.comments.length || 0} Comments
            </h2>

            {user ? (
                <form onSubmit={handleSubmit} className="flex gap-4">
                    <Image
                        src={user.avatar}
                        alt={user.username}
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <div className="flex-1">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full p-2 border-b border-gray-200 focus:border-blue-500 focus:outline-none"
                        />
                        {comment.trim() && (
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setComment('')}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Comment
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            ) : (
                <p className="text-center py-4">
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Sign in
                    </Link>{' '}
                    to comment
                </p>
            )}

            <div className="space-y-4">
                {data?.data.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-4 group">
                        <Link href={`/channel/${comment.user._id}`}>
                            <Image
                                src={comment.user.avatar}
                                alt={comment.user.username}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        </Link>
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <Link
                                        href={`/channel/${comment.user._id}`}
                                        className="text-sm font-medium hover:text-blue-600"
                                    >
                                        {comment.user.username}
                                    </Link>
                                    <span className="text-xs text-gray-500 ml-2">
                                        {formatDistanceToNow(new Date(comment.createdAt), {
                                            addSuffix: true,
                                        })}
                                    </span>
                                </div>

                                {(user?._id === comment.user._id) && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowOptions(
                                                showOptions === comment._id ? null : comment._id
                                            )}
                                            className="p-1 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <MoreVertical className="h-5 w-5 text-gray-500" />
                                        </button>

                                        {showOptions === comment._id && (
                                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg py-1 border">
                                                <button
                                                    onClick={() => handleDelete(comment._id)}
                                                    className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-gray-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-900 mt-1">{comment.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}