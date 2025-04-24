import { MainLayout } from '@/components/layout/MainLayout';
import { PlaylistsGrid } from '@/components/videos/PlaylistsGrid';

export default function PlaylistsPage() {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-semibold mb-6">Your Playlists</h1>
                <PlaylistsGrid />
            </div>
        </MainLayout>
    );
}