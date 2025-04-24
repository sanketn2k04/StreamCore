import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { ListMusic, Lock, Pencil, Trash2 } from 'lucide-react';
import { usePlaylistStore } from '@/store/playlist';
import { toast } from 'react-hot-toast';
import type { Video } from '@/lib/types/video';

interface EditingPlaylist {
    id: string;
    name: string;
    isPrivate: boolean;
}

export function PlaylistsGrid() {
    const [editingPlaylist, setEditingPlaylist] = useState<EditingPlaylist | null>(null);
    const { playlists, deletePlaylist } = usePlaylistStore();

    const handleDeletePlaylist = async (playlistId: string) => {
        if (!confirm('Are you sure you want to delete this playlist?')) return;

        try {
            await deletePlaylist(playlistId);
            toast.success('Playlist deleted');
        } catch (err) {
            toast.error('Failed to delete playlist');
        }
    };

    if (!playlists.length) {
        return (
            <div className="text-center py-12">
                <ListMusic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No playlists yet</h3>
                <p className="text-gray-600">
                    Your playlists will appear here. Start by saving videos to a playlist.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
                <div
                    key={playlist._id}
                    className="group relative bg-gray-100 rounded-lg overflow-hidden"
                >
                    <Link href={`/playlists/${playlist._id}`}>
                        <div className="aspect-video grid grid-cols-2 gap-1 p-2">
                            {playlist.videos.slice(0, 4).map((video, index) => (
                                <div key={video._id} className="relative aspect-video">
                                    <Image
                                        src={video.thumbnail}
                                        alt={video.title}
                                        fill
                                        className="object-cover rounded"
                                    />
                                </div>
                            ))}
                            {playlist.videos.length === 0 && (
                                <div className="col-span-2 flex items-center justify-center">
                                    <ListMusic className="h-12 w-12 text-gray-400" />
                                </div>
                            )}
                        </div>
                    </Link>

                    <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                                    {playlist.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {playlist.videos.length} {playlist.videos.length === 1 ? 'video' : 'videos'}
                                </p>
                            </div>
                            {playlist.isPrivate && (
                                <Lock className="h-4 w-4 text-gray-400 shrink-0" />
                            )}
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            <button
                                onClick={() => handleDeletePlaylist(playlist._id)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}