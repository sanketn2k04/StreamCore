import { MainLayout } from '@/components/layout/MainLayout';
import { VideoGrid } from '@/components/videos/VideoGrid';

export default function Home() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-6">Trending Videos</h2>
          <VideoGrid sortBy="views" limit={8} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Latest Videos</h2>
          <VideoGrid sortBy="createdAt" limit={8} />
        </section>
      </div>
    </MainLayout>
  );
}
