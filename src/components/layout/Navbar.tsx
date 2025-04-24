"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import {
    Upload,
    UserCircle,
    Search,
    LogOut,
    ListVideo,
    History,
    Menu
} from 'lucide-react';

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { user, logout } = useAuthStore();

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }, [searchQuery, router]);

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-2xl font-serif text-gray-900">
                        StreamCore
                    </Link>

                    <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search videos..."
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </form>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                href="/history"
                                className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive('/history')
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <History className="h-5 w-5" />
                                <span>History</span>
                            </Link>

                            <Link
                                href="/playlists"
                                className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive('/playlists')
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <ListVideo className="h-5 w-5" />
                                <span>Playlists</span>
                            </Link>

                            <Link
                                href="/upload"
                                className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isActive('/upload')
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Upload className="h-5 w-5" />
                                <span>Upload</span>
                            </Link>

                            <div className="relative">
                                <button
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50"
                                >
                                    <UserCircle className="h-6 w-6" />
                                    <span className="hidden md:inline">{user.username}</span>
                                </button>

                                {showMobileMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                                        <Link
                                            href={`/channel/${user._id}`}
                                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                        >
                                            <UserCircle className="h-5 w-5" />
                                            <span>Your Channel</span>
                                        </Link>

                                        <div className="md:hidden">
                                            <Link
                                                href="/history"
                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                            >
                                                <History className="h-5 w-5" />
                                                <span>History</span>
                                            </Link>

                                            <Link
                                                href="/playlists"
                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                            >
                                                <ListVideo className="h-5 w-5" />
                                                <span>Playlists</span>
                                            </Link>

                                            <Link
                                                href="/upload"
                                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                            >
                                                <Upload className="h-5 w-5" />
                                                <span>Upload</span>
                                            </Link>
                                        </div>

                                        <button
                                            onClick={() => logout()}
                                            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-50 w-full"
                                        >
                                            <LogOut className="h-5 w-5" />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-4 py-2 text-gray-700 hover:text-gray-900"
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <form onSubmit={handleSearch} className="md:hidden p-4 border-t">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search videos..."
                        className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-500"
                    />
                </div>
            </form>
        </nav>
    );
}