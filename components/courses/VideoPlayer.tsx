"use client";

import {
  PlayIcon,
  Alert02Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLessonProgress, useResumePosition } from "@/hooks/useProgress";
import { cn } from "@/lib/utils";

const MuxPlayer = lazy(() => import("@mux/mux-player-react"));

interface VideoPlayerProps {
  playbackId?: string;
  title?: string;
  className?: string;
  courseSlug?: string;
  lessonSlug?: string;
  onComplete?: () => void;
}

type PlayerState = "loading" | "ready" | "playing" | "paused" | "error";

function VideoPlaceholder({ title }: { title?: string }): JSX.Element {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
      <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mb-4">
        <HugeiconsIcon
          icon={PlayIcon}
          size={32}
          className="text-primary ml-1"
        />
      </div>
      <p className="text-swiss-label text-muted-foreground">
        {title ? "Video coming soon" : "No video available"}
      </p>
    </div>
  );
}

function VideoSkeleton(): JSX.Element {
  return (
    <div className="absolute inset-0 bg-muted">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-muted-foreground/10 animate-pulse" />
        <div className="mt-4 flex gap-2">
          <div className="w-2 h-2 bg-primary/50 animate-pulse" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-primary/50 animate-pulse" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-primary/50 animate-pulse" style={{ animationDelay: "300ms" }} />
        </div>
        <p className="text-swiss-label text-muted-foreground mt-4">Loading video...</p>
      </div>
    </div>
  );
}

function VideoError({ onRetry }: { onRetry: () => void }): JSX.Element {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
      <div className="w-16 h-16 bg-destructive/10 flex items-center justify-center mb-4">
        <HugeiconsIcon
          icon={Alert02Icon}
          size={32}
          className="text-destructive"
        />
      </div>
      <p className="text-swiss-label text-muted-foreground mb-4">
        Failed to load video
      </p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 text-swiss-label text-primary hover:text-primary/80 transition-colors cursor-pointer"
      >
        <HugeiconsIcon icon={RefreshIcon} size={16} />
        Try again
      </button>
    </div>
  );
}

function ResumeOverlay({
  position,
  onResume,
  onStartOver,
}: {
  position: number;
  onResume: () => void;
  onStartOver: () => void;
}): JSX.Element {
  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm z-10">
      <p className="text-swiss-label text-muted-foreground mb-2">
        Resume from {formatTime(position)}?
      </p>
      <div className="flex gap-3 mt-4">
        <button
          onClick={onResume}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-swiss-label hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <HugeiconsIcon icon={PlayIcon} size={16} />
          Resume
        </button>
        <button
          onClick={onStartOver}
          className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground text-swiss-label hover:bg-muted/80 transition-colors cursor-pointer"
        >
          Start over
        </button>
      </div>
    </div>
  );
}

function KeyboardShortcutsHint(): JSX.Element {
  return (
    <div className="absolute bottom-4 left-4 right-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      <div className="flex gap-4 px-3 py-2 bg-background/80 backdrop-blur-sm text-base text-muted-foreground">
        <span><kbd className="px-1.5 bg-muted">Space</kbd> Play/Pause</span>
        <span><kbd className="px-1.5 bg-muted">←</kbd> -10s</span>
        <span><kbd className="px-1.5 bg-muted">→</kbd> +10s</span>
        <span><kbd className="px-1.5 bg-muted">M</kbd> Mute</span>
        <span><kbd className="px-1.5 bg-muted">F</kbd> Fullscreen</span>
      </div>
    </div>
  );
}

export function VideoPlayer({
  playbackId,
  title,
  className,
  courseSlug,
  lessonSlug,
  onComplete,
}: VideoPlayerProps): JSX.Element {
  const prefersReducedMotion = useReducedMotion();
  const playerRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playerState, setPlayerState] = useState<PlayerState>("loading");
  const [showResume, setShowResume] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  // Progress tracking (only if course/lesson slugs provided)
  const { updateVideoProgress, markCompleted } = useLessonProgress(
    courseSlug || "",
    lessonSlug || ""
  );
  const { resumePosition, clearResumePosition } = useResumePosition(
    courseSlug || "",
    lessonSlug || ""
  );

  // Show resume overlay if there's a saved position
  useEffect(() => {
    if (resumePosition > 0 && playbackId) {
      setShowResume(true);
    }
  }, [resumePosition, playbackId]);

  // Handle resume action
  const handleResume = useCallback(function handleResume(): void {
    setShowResume(false);
    if (playerRef.current && resumePosition > 0) {
      // @ts-expect-error - MuxPlayer has currentTime property
      playerRef.current.currentTime = resumePosition;
      // @ts-expect-error - MuxPlayer has play method
      playerRef.current.play();
    }
  }, [resumePosition]);

  // Handle start over action
  const handleStartOver = useCallback(function handleStartOver(): void {
    setShowResume(false);
    clearResumePosition();
    if (playerRef.current) {
      // @ts-expect-error - MuxPlayer has currentTime property
      playerRef.current.currentTime = 0;
      // @ts-expect-error - MuxPlayer has play method
      playerRef.current.play();
    }
  }, [clearResumePosition]);

  // Handle time update for progress tracking
  const handleTimeUpdate = useCallback(function handleTimeUpdate(): void {
    if (!playerRef.current || !courseSlug || !lessonSlug) return;

    // @ts-expect-error - MuxPlayer has these properties
    const currentTime = playerRef.current.currentTime;
    // @ts-expect-error - MuxPlayer has these properties
    const duration = playerRef.current.duration;

    if (duration > 0) {
      updateVideoProgress(currentTime, duration);
    }
  }, [courseSlug, lessonSlug, updateVideoProgress]);

  // Handle video ended
  const handleEnded = useCallback(function handleEnded(): void {
    if (courseSlug && lessonSlug) {
      markCompleted();
    }
    onComplete?.();
  }, [courseSlug, lessonSlug, markCompleted, onComplete]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if focus is on the video container or body
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      if (!playerRef.current) return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          // @ts-expect-error - MuxPlayer has paused property
          if (playerRef.current.paused) {
            // @ts-expect-error - MuxPlayer has play method
            playerRef.current.play();
          } else {
            // @ts-expect-error - MuxPlayer has pause method
            playerRef.current.pause();
          }
          break;
        case "arrowleft":
          e.preventDefault();
          // @ts-expect-error - MuxPlayer has currentTime property
          playerRef.current.currentTime = Math.max(
            0,
            // @ts-expect-error - MuxPlayer has currentTime property
            playerRef.current.currentTime - 10
          );
          break;
        case "arrowright":
          e.preventDefault();
          // @ts-expect-error - MuxPlayer has currentTime and duration properties
          playerRef.current.currentTime = Math.min(
            // @ts-expect-error - MuxPlayer has duration property
            playerRef.current.duration,
            // @ts-expect-error - MuxPlayer has currentTime property
            playerRef.current.currentTime + 10
          );
          break;
        case "m":
          e.preventDefault();
          // @ts-expect-error - MuxPlayer has muted property
          playerRef.current.muted = !playerRef.current.muted;
          break;
        case "f":
          e.preventDefault();
          if (document.fullscreenElement) {
            document.exitFullscreen();
          } else {
            containerRef.current?.requestFullscreen();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handle retry
  const handleRetry = useCallback(function handleRetry(): void {
    setPlayerState("loading");
    setRetryKey((prev) => prev + 1);
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "relative w-full aspect-video bg-muted overflow-hidden group",
        className
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      tabIndex={0}
    >
      {playbackId ? (
        <>
          <Suspense fallback={<VideoSkeleton />}>
            <MuxPlayer
              key={retryKey}
              ref={(el) => {
                playerRef.current = el;
              }}
              playbackId={playbackId}
              metadata={{
                video_title: title,
              }}
              streamType="on-demand"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                // Custom OKLCH theme styling - lime green accent
                "--controls": "oklch(0.985 0 0)",
                "--media-accent-color": "oklch(0.85 0.2 125)",
                "--media-primary-color": "oklch(0.85 0.2 125)",
                "--media-secondary-color": "oklch(0.985 0 0)",
                "--media-loading-indicator-color": "oklch(0.85 0.2 125)",
                "--media-text-color": "oklch(0.985 0 0)",
                "--media-control-background": "oklch(0.145 0 0 / 80%)",
                "--media-control-hover-background": "oklch(0.145 0 0 / 90%)",
                "--media-time-range-buffered-color": "oklch(0.556 0 0)",
                "--media-font-family": "var(--font-subheading), monospace",
                "--media-font-size": "1rem",
              }}
              accentColor="oklch(0.85 0.2 125)"
              onCanPlay={() => setPlayerState("ready")}
              onPlay={() => setPlayerState("playing")}
              onPause={() => setPlayerState("paused")}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onError={() => setPlayerState("error")}
            />
          </Suspense>

          {/* Resume overlay */}
          {showResume && (
            <ResumeOverlay
              position={resumePosition}
              onResume={handleResume}
              onStartOver={handleStartOver}
            />
          )}

          {/* Error state */}
          {playerState === "error" && <VideoError onRetry={handleRetry} />}

          {/* Keyboard shortcuts hint (shown on hover) */}
          {playerState !== "error" && !showResume && <KeyboardShortcutsHint />}
        </>
      ) : (
        <VideoPlaceholder title={title} />
      )}
    </motion.div>
  );
}

export default VideoPlayer;
