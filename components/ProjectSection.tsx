"use client";

import type { NewsletterProject } from "@/data/newsletter";
import { TiltedMedia } from "@/components/TiltedMedia";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { siteConfig } from "@/data/siteConfig";

type ProjectSectionProps = {
  project: NewsletterProject;
  index: number;
  isActive: boolean;
};

const TITLE_STOPWORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "but",
  "or",
  "nor",
  "yet",
  "so",
  "as",
  "at",
  "by",
  "for",
  "in",
  "of",
  "on",
  "to",
  "up",
  "via",
  "with",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be"
]);

const TITLE_OVERRIDES: Record<string, string> = {
  vnext: "vNext",
  "v-next": "v-Next",
  "next-gen": "Next-Gen",
  iphone: "iPhone",
  ipad: "iPad",
  macos: "macOS",
  ios: "iOS",
  linkedin: "LinkedIn",
  github: "GitHub",
  youtube: "YouTube",
  sharepoint: "SharePoint",
  powerpoint: "PowerPoint",
  onenote: "OneNote",
  onedrive: "OneDrive"
};

function formatTitlePart(part: string): string {
  const lower = part.toLowerCase();
  const override = TITLE_OVERRIDES[lower];
  if (override) return override;

  const isAcronym = part.length >= 2 && part.length <= 5 && part === part.toUpperCase() && /^[A-Z]+$/.test(part);
  if (isAcronym) return part;

  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function formatProjectTitle(title: string): string {
  const words = title.split(" ").filter(Boolean);
  return words
    .map((word, idx) => {
      const lower = word.toLowerCase();

      const override = TITLE_OVERRIDES[lower];
      if (override) return override;

      if (word.includes("-")) {
        return word
          .split("-")
          .map(part => formatTitlePart(part))
          .join("-");
      }

      if (!/[a-zA-Z]/.test(word)) return word;

      const isAcronym = word.length >= 2 && word.length <= 5 && word === word.toUpperCase() && /^[A-Z]+$/.test(word);
      if (isAcronym) return word;

      if (idx === 0 || idx === words.length - 1) return lower.charAt(0).toUpperCase() + lower.slice(1);
      if (TITLE_STOPWORDS.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

export function ProjectSection({ project, index, isActive }: ProjectSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [overlayScale, setOverlayScale] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      setOverlayScale(Math.min(el.offsetWidth / 1056, 1));
    };

    updateScale();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(updateScale);
      ro.observe(el);
      return () => ro.disconnect();
    }
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const contributorLabel = project.contributorType === "researchers" ? "Researched by" : "Designed by";
  const contributors = useMemo(() => project.contributors.join(" & "), [project.contributors]);

  const rawTitle = (project.displayTitle?.trim() || project.title).trim();
  const formattedTitle = useMemo(() => {
    if (!siteConfig.projects.titleCase) return rawTitle;
    return formatProjectTitle(rawTitle);
  }, [rawTitle]);
  const href = project.figmaUrl?.trim();

  const media = (
    <TiltedMedia
      imageSrc={project.coverImage}
      videoUrl={project.videoUrl}
      altText={project.title}
      linkUrl={href || undefined}
      showTooltip={!project.videoUrl}
      scaleOnHover={1.02}
      rotateAmplitude={6}
      borderRadius={8}
      priority={index === 0}
      isActive={isActive}
      backgroundColor={!project.coverImage && project.themeColor ? project.themeColor : undefined}
    />
  );

  return (
    <div className="w-full min-h-screen relative">
      <div className="sm:hidden softVignette" style={{ zIndex: 5 }} />

      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12">
        <div
          className="relative w-full max-w-[1056px] mx-auto px-8 sm:px-12 lg:px-16"
          style={{ willChange: "transform, opacity" }}
        >
          <div ref={containerRef} className="relative w-full">
            <div className="flex items-end justify-between mb-2 sm:mb-2 lg:mb-3 px-1">
              <h2
                className="leading-tight max-w-[70%] sm:max-w-[60%]"
                style={{
                  fontFamily: "Avantt",
                  fontWeight: 500,
                  letterSpacing: "0.01em",
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: "clamp(1.25rem, 3vw, 2rem)"
                }}
              >
                {formattedTitle}
              </h2>

              {project.group && (
                <span
                  className="text-xs sm:text-sm text-white/60 shrink-0"
                  style={{
                    letterSpacing: "0.08em",
                    fontFamily: "Avantt",
                    fontWeight: 400
                  }}
                >
                  {project.group}
                </span>
              )}
            </div>

            <div className="relative">
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className="block w-full relative">
                  {media}
                </a>
              ) : (
                media
              )}

              {project.description && (
                <div
                  className="hidden sm:block absolute bottom-[7px] right-[-9px] sm:bottom-[-3px] sm:right-[-19px] lg:bottom-[-13px] lg:right-[-29px]"
                  style={{ transform: `scale(${overlayScale})`, transformOrigin: "bottom right" }}
                >
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 24, opacity: 1 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="w-[440px] select-none overflow-hidden"
                    style={{
                      borderRadius: 8,
                      background: "rgba(30, 30, 30, 0.7)",
                      backdropFilter: "blur(40px)",
                      WebkitBackdropFilter: "blur(40px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 4px 30px rgba(0,0,0,0.2)",
                      transformOrigin: "bottom right"
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setDetailsOpen(v => !v)}
                      className="w-full p-2 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors"
                      style={{ borderRadius: detailsOpen ? "8px 8px 0 0" : 8 }}
                    >
                      <motion.div animate={{ rotate: detailsOpen ? 0 : 180 }} transition={{ duration: 0.3 }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path
                            d="M2 4L6 8L10 4"
                            stroke="rgba(255,255,255,0.5)"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.div>
                    </button>

                    <motion.div
                      className="overflow-hidden"
                      initial={false}
                      animate={{ height: detailsOpen ? "auto" : 0, opacity: Number(detailsOpen) }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                      <div className="px-4 pb-4">
                        <p
                          className="text-sm leading-[20px] text-white/90"
                          style={{ fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif', whiteSpace: 'pre-line' }}
                        >
                          {project.description}
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </div>

            <div className="flex items-start mt-2 sm:mt-2 lg:mt-3 px-1">
              <p
                className="text-[10px] sm:text-xs uppercase text-white/50"
                style={{ letterSpacing: "0.25em", fontWeight: 500, fontFamily: "Avantt" }}
              >
                {contributorLabel} <span className="text-white/90">{contributors}</span>
              </p>
            </div>

            {project.description && (
              <div className="block sm:hidden mt-4 px-1">
                <p
                  className="text-sm leading-relaxed text-white/80"
                  style={{ fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif', whiteSpace: 'pre-line' }}
                >
                  {project.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
