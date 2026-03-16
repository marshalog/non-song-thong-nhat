import { useEffect, useState } from "react";
import tankVideo from "@/assets/Xe_tang_DDL.mp4";

interface VideoTransitionProps {
  onComplete: () => void;
  duration?: number;
}

export function VideoTransition({ onComplete, duration = 7 }: VideoTransitionProps) {
  const [countdown, setCountdown] = useState(duration);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onComplete, duration]);

  return (
    <div className="fixed inset-0 z-50 bg-foreground/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up">
      <div className="relative w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border-2 border-gold">
        <video
          src={tankVideo}
          autoPlay
          muted
          playsInline
          loop
          className="w-full aspect-video object-cover"
        />
        <div className="absolute top-3 right-3 bg-foreground/70 text-primary-foreground px-3 py-1 rounded-full font-display font-bold text-sm">
          {countdown}s
        </div>
      </div>
    </div>
  );
}
