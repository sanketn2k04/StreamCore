import { MainLayout } from '@/components/layout/MainLayout';
import { History } from '@/components/videos/History';

export default function HistoryPage() {
    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-semibold mb-6">Watch History</h1>
                <History />
            </div>
        </MainLayout>
    );
}