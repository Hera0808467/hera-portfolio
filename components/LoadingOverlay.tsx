"use client";

import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/data/siteConfig";

type LoadingOverlayProps = {
  isReady?: boolean;
  onLoadComplete?: () => void;
  minDisplayTime?: number;
};

export function LoadingOverlay({
  isReady = false,
  onLoadComplete,
  minDisplayTime = 800
}: LoadingOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [isHiding, setIsHiding] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);

  const mountedAt = useRef(0);
  const didComplete = useRef(false);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  useEffect(() => {
    // Match the artifact behavior: wait for font loading before fading the title in.
    if (typeof document === "undefined" || !("fonts" in document)) {
      setFontsReady(true);
      return;
    }

    if (document.fonts.status === "loaded") {
      setFontsReady(true);
      return;
    }

    document.fonts.ready.then(() => setFontsReady(true)).catch(() => setFontsReady(true));
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          window.clearInterval(id);
          return 100;
        }

        // When the background is ready, accelerate to 100.
        if (isReady) {
          const step = Math.max(8, (100 - prev) * 0.4);
          return Math.min(100, prev + step);
        }

        // Otherwise, ease towards ~98% and wait.
        if (prev < 70) return prev + 2;
        const step = Math.max(0.1, 0.02 * (98 - prev));
        return Math.min(98, prev + step);
      });
    }, 50);

    return () => window.clearInterval(id);
  }, [isReady]);

  useEffect(() => {
    if (progress < 100) return;
    if (didComplete.current) return;
    didComplete.current = true;

    const elapsed = Date.now() - mountedAt.current;
    const remaining = Math.max(0, minDisplayTime - elapsed);

    window.setTimeout(() => {
      setIsHiding(true);
      window.setTimeout(() => {
        onLoadComplete?.();
      }, 500);
    }, remaining);
  }, [progress, minDisplayTime, onLoadComplete]);

  return (
    <div
      className={[
        "fixed inset-0 z-[100] flex flex-col items-center justify-center",
        "bg-black transition-opacity duration-500",
        isHiding ? "opacity-0 pointer-events-none" : "opacity-100"
      ].join(" ")}
    >
      <div className="mb-12 text-center transition-opacity duration-300" style={{ opacity: fontsReady ? 1 : 0 }}>
        <div
          className="text-2xl text-white/90 tracking-[0.3em] uppercase"
          style={{ fontFamily: "Avantt", fontWeight: 500 }}
        >
          {siteConfig.brand.name}
        </div>
        <div
          className="text-xs text-white/50 tracking-[0.2em] uppercase mt-1"
          style={{ fontFamily: "Avantt", fontWeight: 400 }}
        >
          {siteConfig.brand.loadingSubtitle}
        </div>
      </div>

      <div className="w-48 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-white/80 rounded-full transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className="mt-4 text-[10px] text-white/30 tracking-[0.15em] uppercase"
        style={{ fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}
      >
        {progress < 100 ? "Loading" : "Ready"}
      </div>
    </div>
  );
}
