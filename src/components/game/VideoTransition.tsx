import { useEffect, useRef, useState } from "react";

interface VideoTransitionProps {
  src: string;
  onComplete: () => void;
  loop?: boolean;
}

export function VideoTransition({ src, onComplete, loop = false }: VideoTransitionProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [needsUserGesture, setNeedsUserGesture] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const handleEnded = () => onComplete();
    const handleError = () => onComplete();

    el.addEventListener("ended", handleEnded);
    el.addEventListener("error", handleError);

    return () => {
      el.removeEventListener("ended", handleEnded);
      el.removeEventListener("error", handleError);
    };
  }, [onComplete]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Best effort: autoplay with sound. If the browser blocks it, we show a button to start playback.
    el.muted = false;
    el.volume = 1;
    const p = el.play();
    if (p && typeof p.catch === "function") {
      p.catch(() => setNeedsUserGesture(true));
    }
  }, [src]);

  const startWithSound = async () => {
    const el = videoRef.current;
    if (!el) return;
    try {
      el.muted = false;
      el.volume = 1;
      await el.play();
      setNeedsUserGesture(false);
    } catch {
      setNeedsUserGesture(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
      <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border-2 border-gold">
        <video
          ref={videoRef}
          src={src}
          autoPlay
          playsInline
          loop={loop}
          preload="auto"
          className="w-full aspect-video object-cover"
        />

        {needsUserGesture && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
            <button
              type="button"
              onClick={startWithSound}
              className="px-6 py-3 rounded-xl bg-gold text-foreground font-display font-bold btn-neon"
            >
              Bật âm thanh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
