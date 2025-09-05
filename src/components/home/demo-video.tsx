'use client';

import { MouseEvent, useEffect, useRef, useState } from "react";

import { Play } from "lucide-react";

export default function DemoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(true);

  const handleOverlayClick = (e: MouseEvent) => {
    e.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    video
      .play()
      .catch(() => {
        video.muted = false;
        video
          .play()
          .catch(() => {
            setIsPaused(true);
          });
      });
  };

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handlePlay = () => setIsPaused(false);
    const handlePause = () => setIsPaused(true);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm border border-gray-500 bg-white/10">
        <div className="aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            controls
            preload="metadata"
          >
            <source src="/demo-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {isPaused && (
            <div
              onClick={handleOverlayClick}
              role="button"
              tabIndex={0}
              className="absolute inset-0 flex items-center justify-center bg-gradient-primary backdrop-blur-sm cursor-pointer transition-opacity duration-300"
              aria-label="Play demo video"
            >
              <div className="max-w-md mx-6 text-center space-y-6">
                <div className="mx-auto w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-95">
                  <Play className="text-white" />
                </div>

                <div className="text-white">
                  <h3 className="text-2xl font-bold tracking-tight leading-tight">
                    <span className="text-white bg-clip-text">
                      See CollabWrite in Action
                    </span>
                  </h3>
                  <p className="text-sm text-white/70 mt-1">
                    Watch how real-time collaboration works - click anywhere to play
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
