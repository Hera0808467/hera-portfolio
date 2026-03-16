"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { LoadingOverlay } from "@/components/LoadingOverlay";
import { ShaderBackground } from "@/components/background/ShaderBackground";
import { CircularText } from "@/components/CircularText";
import { EndingSection } from "@/components/EndingSection";
import { GroupNav } from "@/components/GroupNav";
import { HeroSection } from "@/components/HeroSection";
import { ProjectSection } from "@/components/ProjectSection";
import type { HSV } from "@/lib/imageColor";
import { getImageHSV } from "@/lib/imageColor";
import { newsletterData } from "@/data/newsletter";
import { siteConfig } from "@/data/siteConfig";

type MonthGroup = {
  month: string;
  displayMonth?: string;
  projects: typeof newsletterData.projects;
  welcomeText?: string;
  endingText?: string;
};

function groupByMonth(data: typeof newsletterData): MonthGroup[] {
  const grouped = new Map<string, MonthGroup>();

  for (const project of data.projects) {
    const month = project.month;
    const existing = grouped.get(month);
    if (existing) {
      existing.projects.push(project);
    } else {
      grouped.set(month, {
        month,
        displayMonth: undefined,
        projects: [project],
        welcomeText: data.month === month ? data.welcomeText : undefined,
        endingText: data.month === month ? data.endingText : undefined
      });
    }
  }

  // Sort by `YYYY-M` string descending (matches artifact behavior).
  return Array.from(grouped.values()).sort((a, b) => b.month.localeCompare(a.month));
}

export default function HomePage() {
  const monthGroups = useMemo(() => groupByMonth(newsletterData), []);
  const current = monthGroups[0];

  const rootRef = useRef<HTMLDivElement>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const activeSectionIndexRef = useRef(0);
  const [bgReady, setBgReady] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(true);

  const totalSections = (current?.projects.length ?? 0) + 2;

  const groups = useMemo(() => {
    if (!current) return [];
    return current.projects.map((p, idx) => ({
      name: p.displayTitle?.trim() || p.title,
      firstProjectIndex: idx
    }));
  }, [current]);

  const [coverHsv, setCoverHsv] = useState<HSV | null>(null);
  const lastThemeRef = useRef({ baseHue: 0.5, saturation: 0.6, originalMix: 0 });

  const isHeroOrEnding = activeSectionIndex === 0 || activeSectionIndex === totalSections - 1;
  const showGroupNav =
    siteConfig.navigation.groupNavEnabled &&
    (siteConfig.navigation.showGroupNavOnHero || activeSectionIndex > 0) &&
    (siteConfig.navigation.showGroupNavOnEnding || activeSectionIndex !== totalSections - 1);

  const shaderTheme = useMemo(() => {
    if (isHeroOrEnding) return { baseHue: 0.5, saturation: 0.6, originalMix: 1 };
    if (coverHsv) {
      return {
        baseHue: coverHsv.h,
        saturation: Math.max(0.5, Math.min(0.85, coverHsv.s + 0.2)),
        originalMix: 0
      };
    }
    return lastThemeRef.current;
  }, [coverHsv, isHeroOrEnding]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    activeSectionIndexRef.current = activeSectionIndex;
  }, [activeSectionIndex]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const sections = el.querySelectorAll("section");
        const viewportHeight = window.innerHeight || 1;

        let bestIdx = 0;
        let bestVisible = 0;
        sections.forEach((section, idx) => {
          const rect = section.getBoundingClientRect();
          const visible = Math.max(0, Math.min(viewportHeight, rect.bottom) - Math.max(0, rect.top));
          if (visible > bestVisible) {
            bestVisible = visible;
            bestIdx = idx;
          }
        });

        if (bestVisible > 0.5 * viewportHeight) {
          setActiveSectionIndex(bestIdx);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    // The artifact relies on CSS scroll-snap. Some browsers/devices feel "loose" with snap.
    // Add a light wheel-based "magnetic" snap to move section-by-section.
    const root = rootRef.current;
    if (!root) return;

    const threshold = 70;
    const resetAfterMs = 250;
    const lockMs = 650;

    let deltaAcc = 0;
    let lastWheelAt = 0;
    let locked = false;
    let lockTimer: number | null = null;

    const onWheel = (ev: WheelEvent) => {
      // During the initial loading overlay, let the browser handle scrolling normally.
      if (loadingVisible) return;

      const sections = root.querySelectorAll("section");
      if (sections.length === 0) return;

      // While we are animating to a snap point, keep the scroll deterministic.
      if (locked) {
        ev.preventDefault();
        return;
      }

      const now = performance.now();
      if (now - lastWheelAt > resetAfterMs) deltaAcc = 0;
      lastWheelAt = now;

      deltaAcc += ev.deltaY;
      ev.preventDefault();

      if (Math.abs(deltaAcc) < threshold) return;

      const dir = deltaAcc > 0 ? 1 : -1;
      deltaAcc = 0;

      const currentIndex = activeSectionIndexRef.current;
      const targetIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + dir));
      if (targetIndex === currentIndex) return;

      locked = true;
      if (lockTimer !== null) window.clearTimeout(lockTimer);

      setActiveSectionIndex(targetIndex);
      sections[targetIndex]?.scrollIntoView({ behavior: "smooth" });

      lockTimer = window.setTimeout(() => {
        locked = false;
        lockTimer = null;
      }, lockMs);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (lockTimer !== null) window.clearTimeout(lockTimer);
    };
  }, [loadingVisible]);

  useEffect(() => {
    // Only fetch HSV for project sections.
    if (activeSectionIndex === 0 || activeSectionIndex === totalSections - 1) return;

    const projectIndex = activeSectionIndex - 1;
    const coverImage = current?.projects[projectIndex]?.coverImage;
    if (!coverImage) return;

    let cancelled = false;
    getImageHSV(coverImage)
      .then(hsv => {
        if (cancelled) return;
        if (!hsv) return;
        setCoverHsv(hsv);
      })
      .catch(() => {
        // Keep last known values.
      });

    return () => {
      cancelled = true;
    };
  }, [activeSectionIndex, current, totalSections]);

  useEffect(() => {
    if (!coverHsv) return;
    lastThemeRef.current = {
      baseHue: coverHsv.h,
      saturation: Math.max(0.5, Math.min(0.85, coverHsv.s + 0.2)),
      originalMix: 0
    };
  }, [coverHsv]);

  if (!current) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-white/60">No projects yet.</p>
      </main>
    );
  }

  return (
    <div
      ref={rootRef}
      className="relative min-h-screen snap-y snap-mandatory"
      style={{ backgroundColor: siteConfig.theme.backgroundColor, touchAction: "pan-y" as const }}
    >
      {loadingVisible && (
        <LoadingOverlay
          isReady={bgReady}
          minDisplayTime={500}
          onLoadComplete={() => {
            setLoadingVisible(false);
          }}
        />
      )}

      <div className="fixed inset-0 z-0">
        <ShaderBackground
          rotation={0}
          autoRotate={0}
          speed={0.2}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0.5}
          noise={0.2}
          transparent
          baseHue={shaderTheme.baseHue}
          hueRange={0.12}
          saturation={shaderTheme.saturation}
          originalMix={shaderTheme.originalMix}
          onReady={() => setBgReady(true)}
        />
      </div>

      <div className="relative w-full">
        <section className="h-screen w-full snap-start snap-always">
          <HeroSection
            currentMonth={current.month}
            welcomeText={current.welcomeText}
            isActive={activeSectionIndex === 0}
          />
        </section>

        {current.projects.map((project, idx) => (
          <section key={project.id} className="min-h-screen w-full snap-start">
            <ProjectSection project={project} index={idx} isActive={activeSectionIndex === idx + 1} />
          </section>
        ))}

        <section className="h-screen w-full snap-start snap-always">
          <EndingSection endingText={current.endingText} />
        </section>
      </div>

      {isHeroOrEnding && activeSectionIndex === totalSections - 1 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => {
              window.open(siteConfig.contact.email, "_blank");
            }}
            className="group text-white/60 text-xs tracking-[0.15em] uppercase cursor-pointer transition-colors duration-300 hover:text-white"
            style={{ fontFamily: "Avantt" }}
          >
            <span className="relative">
              {siteConfig.contact.label}
              <span className="absolute left-0 bottom-0 w-full h-[1px] bg-white/60 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </span>
          </button>
        </div>
      )}

      {showGroupNav && (
        <GroupNav
          groups={groups}
          activeSectionIndex={activeSectionIndex}
          onGroupClick={firstProjectIndex => {
            const el = rootRef.current;
            if (!el) return;
            const sections = el.querySelectorAll("section");
            const sectionIndex = firstProjectIndex + 1; // +1 for hero section
            const target = sections[sectionIndex];
            if (!target) return;
            setActiveSectionIndex(sectionIndex);
            target.scrollIntoView({ behavior: "smooth" });
          }}
        />
      )}

      <AnimatePresence>
        {activeSectionIndex > 0 && (
          <motion.div
            className="fixed top-6 left-6 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={() => {
              const el = rootRef.current;
              if (!el) return;
              const sections = el.querySelectorAll("section");
              const top = sections[0];
              if (!top) return;
              setActiveSectionIndex(0);
              top.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <CircularText text="HERA*PORTFOLIO*" spinDuration={25} onHover="slowDown" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
