"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type LinkHint = {
  text: string;
};

function getLinkHint(linkUrl?: string): LinkHint {
  if (!linkUrl) return { text: "View" };
  const u = linkUrl.toLowerCase();

  if (u.includes("figma.com")) return { text: "View in Figma" };
  if (u.includes("github.com")) return { text: "View on GitHub" };
  if (u.includes("loop.microsoft") || u.includes(":fl:") || u.includes("loopapp") || u.includes("loop-page-container")) {
    return { text: "View in Loop" };
  }
  if (u.includes("office.com") || u.includes("sharepoint.com") || u.includes("onedrive") || u.includes(".docx") || u.includes("word") || u.includes("microsoft365")) {
    return { text: "View in Office" };
  }
  if (u.includes("docs.google.com")) return { text: "View in Google Docs" };
  return { text: "View Link" };
}

function extractEmbedSrc(videoUrl?: string): string | null {
  if (!videoUrl) return null;
  const trimmed = videoUrl.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  const match = trimmed.match(/src=[\"']([^\"']+)[\"']/);
  return match?.[1] ?? null;
}

type TiltedMediaProps = {
  imageSrc?: string;
  videoUrl?: string;
  altText?: string;
  captionText?: string;
  linkUrl?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  showTooltip?: boolean;
  backgroundColor?: string;
  borderRadius?: number;
  priority?: boolean;
  isActive?: boolean;
};

export function TiltedMedia({
  imageSrc,
  videoUrl,
  altText = "Project image",
  captionText = "",
  linkUrl,
  scaleOnHover = 1.02,
  rotateAmplitude = 8,
  showTooltip = false,
  backgroundColor = "#e5e5e5",
  borderRadius = 8,
  priority = false,
  isActive = true
}: TiltedMediaProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const resolvedImageSrc = imageSrc && imageSrc.startsWith("/") ? `${basePath}${imageSrc}` : imageSrc;
  const hint = useMemo(() => getLinkHint(linkUrl), [linkUrl]);
  const isFigmaLink = useMemo(() => (linkUrl ?? "").toLowerCase().includes("figma.com"), [linkUrl]);
  const embedSrc = useMemo(() => extractEmbedSrc(videoUrl), [videoUrl]);

  const figureRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [isHover, setIsHover] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isActive) setIsPlaying(false);
  }, [isActive]);

  const setTransform = (rx: number, ry: number, scale: number) => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
  };

  return (
    <figure
      ref={figureRef}
      className="relative w-full aspect-[680/400] flex items-center justify-center"
      style={{ perspective: "1000px" }}
      onMouseMove={ev => {
        const root = figureRef.current;
        if (!root) return;
        const rect = root.getBoundingClientRect();
        const dx = ev.clientX - rect.left - rect.width / 2;
        const dy = ev.clientY - rect.top - rect.height / 2;
        const rx = -((dy / (rect.height / 2)) * rotateAmplitude);
        const ry = (dx / (rect.width / 2)) * rotateAmplitude;
        setTransform(rx, ry, scaleOnHover);
      }}
      onMouseEnter={() => {
        setIsHover(true);
        setTransform(0, 0, scaleOnHover);
      }}
      onMouseLeave={() => {
        setIsHover(false);
        setIsPlaying(false);
        setTransform(0, 0, 1);
      }}
    >
      <div
        ref={cardRef}
        className="relative w-full h-full overflow-hidden"
        style={{
          transformStyle: "preserve-3d",
          borderRadius,
          boxShadow: "0 4px 30px rgba(0,0,0,0.15)",
          border: "1px solid rgba(255,255,255,0.08)",
          transition: "transform 120ms ease-out"
        }}
      >
        {embedSrc && isPlaying ? (
          <iframe
            src={`${embedSrc}${embedSrc.includes("?") ? "&" : "?"}autoplay=1`}
            className="absolute inset-0 w-full h-full"
            style={{ border: "none" }}
            allow="autoplay"
            title={altText}
          />
        ) : imageSrc ? (
          <>
            <img
              src={resolvedImageSrc}
              alt={altText}
              className="absolute inset-0 w-full h-full object-cover"
              loading={priority ? "eager" : "lazy"}
              decoding="async"
            />

            {embedSrc && (
              <button
                type="button"
                onClick={ev => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  setIsPlaying(true);
                }}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors duration-300 cursor-pointer"
                aria-label="Play video"
              >
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                  <circle cx="24" cy="24" r="23" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                  <path d="M19 15L33 24L19 33V15Z" fill="white" />
                </svg>
              </button>
            )}
          </>
        ) : (
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              background: backgroundColor.startsWith("linear-gradient")
                ? backgroundColor
                : `linear-gradient(135deg, ${backgroundColor}, ${backgroundColor}88)`
            }}
          />
        )}

        {showTooltip && (
          <div
            className="pointer-events-none absolute z-20 flex items-center gap-1.5 whitespace-nowrap"
            style={{
              left: 12,
              top: 12,
              opacity: isHover ? 1 : 0,
              height: "24px",
              padding: "4px 8px",
              borderRadius: 6,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              transition: "opacity 150ms ease-out"
            }}
          >
            {isFigmaLink && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5Z"
                  fill="#F24E1E"
                />
                <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2Z" fill="#FF7262" />
                <path d="M5 12a3.5 3.5 0 0 1 3.5-3.5H12v7H8.5A3.5 3.5 0 0 1 5 12Z" fill="#A259FF" />
                <path
                  d="M5 18.5A3.5 3.5 0 0 1 8.5 15H12v3.5a3.5 3.5 0 1 1-7 0Z"
                  fill="#0ACF83"
                />
                <circle cx="15.5" cy="12" r="3.5" fill="#1ABCFE" />
              </svg>
            )}
            <span className="text-white/90" style={{ fontSize: "12px", fontWeight: 400, letterSpacing: "0.01em" }}>
              {captionText || hint.text}
            </span>
          </div>
        )}
      </div>
    </figure>
  );
}
