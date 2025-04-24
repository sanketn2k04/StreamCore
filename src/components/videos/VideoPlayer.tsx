import { useRef, useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    RotateCcw,
    RotateCw,
} from 'lucide-react';
import { api } from '@/lib/api/axios';
import { useVideoShortcuts } from '@/lib/hooks/useVideoShortcuts';
import type { Video } from '@/lib/types/video';

interface VideoPlayerProps {
    videoId: string;
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout>();

    const { data, isLoading } = useQuery<{ data: { video: Video } }>({
        queryKey: ['video', videoId],
        queryFn: () => api.get(`/videos/v/video/${videoId}`),
    });

    const handleTimeUpdate = useCallback(() => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    }, []);

    const handleLoadedMetadata = useCallback(() => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    }, []);

    const togglePlay = useCallback(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    const seekForward = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.min(
                videoRef.current.currentTime + 10,
                videoRef.current.duration
            );
        }
    }, []);

    const seekBackward = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
        }
    }, []);

    const adjustVolume = useCallback((delta: number) => {
        if (videoRef.current) {
            const newVolume = Math.max(0, Math.min(1, volume + delta));
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    }, [volume]);

    const toggleMute = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    }, [isMuted]);

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) {
            videoRef.current?.parentElement?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }, []);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    useVideoShortcuts({
        onPlay: () => !isPlaying && togglePlay(),
        onPause: () => isPlaying && togglePlay(),
        onSeekForward: seekForward,
        onSeekBackward: seekBackward,
        onVolumeUp: () => adjustVolume(0.1),
        onVolumeDown: () => adjustVolume(-0.1),
        onMute: toggleMute,
        onFullscreen: toggleFullscreen,
    });

    const handleMouseMove = useCallback(() => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            }
        }, 2000);
    }, [isPlaying]);

    const handleVideoEnd = useCallback(async () => {
        try {
            await api.post(`/videos/v/${videoId}/view`);
        } catch (error) {
            console.error('Failed to record view:', error);
        }
    }, [videoId]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.addEventListener('ended', handleVideoEnd);
        return () => video.removeEventListener('ended', handleVideoEnd);
    }, [handleVideoEnd]);

    if (isLoading) {
        return (
            <div className="aspect-video bg-gray-100 animate-pulse rounded-lg" />
        );
    }

    if (!data?.data.video) {
        return (
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Video not found</p>
            </div>
        );
    }

    const { video } = data.data;

    return (
        <div
            className="relative aspect-video bg-black rounded-lg overflow-hidden group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={video.videoUrl}
                className="w-full h-full"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
                poster={video.thumbnail}
            />

            <div
                className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'
                    }`}
            />

            <div
                className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                {/* Progress bar */}
                <div className="relative h-1 bg-gray-600 rounded-full mb-4">
                    <div
                        className="absolute h-full bg-red-600 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={(e) => {
                            const time = parseFloat(e.target.value);
                            if (videoRef.current) {
                                videoRef.current.currentTime = time;
                            }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={togglePlay}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            {isPlaying ? (
                                <Pause className="w-6 h-6 text-white" />
                            ) : (
                                <Play className="w-6 h-6 text-white" />
                            )}
                        </button>

                        <button
                            onClick={seekBackward}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <RotateCcw className="w-5 h-5 text-white" />
                        </button>

                        <button
                            onClick={seekForward}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <RotateCw className="w-5 h-5 text-white" />
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleMute}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                {isMuted ? (
                                    <VolumeX className="w-5 h-5 text-white" />
                                ) : (
                                    <Volume2 className="w-5 h-5 text-white" />
                                )}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={(e) => {
                                    const newVolume = parseFloat(e.target.value);
                                    if (videoRef.current) {
                                        videoRef.current.volume = newVolume;
                                        setVolume(newVolume);
                                        setIsMuted(newVolume === 0);
                                    }
                                }}
                                className="w-20 accent-red-600"
                            />
                        </div>

                        <div className="text-white text-sm">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                    </div>

                    <button
                        onClick={toggleFullscreen}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <Maximize className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Large play/pause button overlay */}
            <button
                onClick={togglePlay}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-full bg-black/50 transition-opacity duration-300 ${showControls && !isPlaying ? 'opacity-100' : 'opacity-0'
                    }`}
            >
                <Play className="w-12 h-12 text-white" />
            </button>
        </div>
    );
}