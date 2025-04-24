import { useEffect, useCallback } from "react";

interface VideoShortcutsProps {
  onPlay?: () => void;
  onPause?: () => void;
  onSeekForward?: () => void;
  onSeekBackward?: () => void;
  onVolumeUp?: () => void;
  onVolumeDown?: () => void;
  onMute?: () => void;
  onFullscreen?: () => void;
}

export function useVideoShortcuts({
  onPlay,
  onPause,
  onSeekForward,
  onSeekBackward,
  onVolumeUp,
  onVolumeDown,
  onMute,
  onFullscreen,
}: VideoShortcutsProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Only handle shortcuts if not typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case " ":
        case "k":
          event.preventDefault();
          if (event.type === "keydown") {
            if (onPlay && onPause) {
              // Toggle play/pause
              document.fullscreenElement ? onPause() : onPlay();
            }
          }
          break;
        case "arrowright":
          event.preventDefault();
          onSeekForward?.();
          break;
        case "arrowleft":
          event.preventDefault();
          onSeekBackward?.();
          break;
        case "arrowup":
          event.preventDefault();
          onVolumeUp?.();
          break;
        case "arrowdown":
          event.preventDefault();
          onVolumeDown?.();
          break;
        case "m":
          event.preventDefault();
          onMute?.();
          break;
        case "f":
          event.preventDefault();
          onFullscreen?.();
          break;
      }
    },
    [
      onPlay,
      onPause,
      onSeekForward,
      onSeekBackward,
      onVolumeUp,
      onVolumeDown,
      onMute,
      onFullscreen,
    ]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}
