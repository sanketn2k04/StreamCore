import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { Trash2 } from 'lucide-react';
import { VideoGrid } from './VideoGrid';
import { useHistoryStore } from '@/store/history';
import type { Video } from '@/lib/types/video';

export function History() {
    const { watchHistory, loading, fetchHistory, clearHistory } = useHistoryStore();

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleClearHistory = async () => {
        if (window.confirm('Are you sure you want to clear your watch history?')) {
            await clearHistory();
        }
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array(8)
                        .fill(null)
                        .map((_, i) => (
                            <div key={i} className="aspect-video bg-gray-200 rounded-lg" />
                        ))}
                </div>
            </div>
        );
    }

    if (!watchHistory.length) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500 mb-4">Your watch history is empty</p>
                <p className="text-sm text-gray-400">
                    Videos you watch will appear here
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Watch History</h1>
                <button
                    onClick={handleClearHistory}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="h-5 w-5" />
                    <span>Clear History</span>
                </button>
            </div>
            <VideoGrid videos={watchHistory} />
        </div>
    );
}