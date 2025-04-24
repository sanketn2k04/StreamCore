import { MainLayout } from '@/components/layout/MainLayout';
import { VideoUploadForm } from '@/components/forms/VideoUploadForm';

export default function UploadPage() {
    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto py-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Upload Video</h1>
                <VideoUploadForm />
            </div>
        </MainLayout>
    );
}