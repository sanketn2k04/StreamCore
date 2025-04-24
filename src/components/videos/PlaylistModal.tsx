import { useState } from 'react';
import { usePlaylistStore } from '@/store/playlist';
import { Dialog } from '@headlessui/react';
import { FolderPlus, X } from 'lucide-react';

interface PlaylistModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoId: string;
}

export function PlaylistModal({ isOpen, onClose, videoId }: PlaylistModalProps) {
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const { playlists, createPlaylist, addVideoToPlaylist, removeVideoFromPlaylist } =
        usePlaylistStore();

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;
        const playlist = await createPlaylist({
            name: newPlaylistName,
            visibility: 'private',
        });
        await addVideoToPlaylist(playlist._id, videoId);
        setNewPlaylistName('');
    };

    const toggleVideoInPlaylist = async (playlistId: string, hasVideo: boolean) => {
        if (hasVideo) {
            await removeVideoFromPlaylist(playlistId, videoId);
        } else {
            await addVideoToPlaylist(playlistId, videoId);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-lg font-medium">Save to playlist</Dialog.Title>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Create new playlist"
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleCreatePlaylist}
                                disabled={!newPlaylistName.trim()}
                                className="p-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                <FolderPlus size={20} />
                            </button>
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {playlists.map((playlist) => {
                                const hasVideo = playlist.videos.some((v) => v._id === videoId);
                                return (
                                    <div
                                        key={playlist._id}
                                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={hasVideo}
                                            onChange={() => toggleVideoInPlaylist(playlist._id, hasVideo)}
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                        />
                                        <span className="flex-1">{playlist.name}</span>
                                        <span className="text-sm text-gray-500">
                                            {playlist.videos.length} videos
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}