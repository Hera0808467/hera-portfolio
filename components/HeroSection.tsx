"use client";

import { useEffect, useMemo, useRef } from "react";
import { siteConfig } from "@/data/siteConfig";

type VariableWeightTextProps = {
  text: string;
  className?: string;
  radius?: number;
  fromWeight?: number;
  toWeight?: number;
  fontFamily?: string;
};

function VariableWeightText({
  text,
  className = "",
  radius = 100,
  fromWeight = 300,
  toWeight = 900,
  fontFamily = "var(--font-fraunces)"
}: VariableWeightTextProps) {
  const spansRef = useRef<Array<HTMLSpanElement | null>>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (ev: MouseEvent) => {
      mouseRef.current = { x: ev.clientX, y: ev.clientY };
    };

    window.addEventListener("mousemove", onMove);

    let raf: number | null = null;
    const step = () => {
      for (const span of spansRef.current) {
        if (!span) continue;
        const rect = span.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = mouseRef.current.x - cx;
        const dy = mouseRef.current.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let weight = fromWeight;
        if (dist < radius) {
          weight = Math.round(fromWeight + (toWeight - fromWeight) * (1 - dist / radius));
        }

        span.style.fontVariationSettings = `'wght' ${weight}`;
      }

      raf = window.requestAnimationFrame(step);
    };

    raf = window.requestAnimationFrame(step);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf !== null) window.cancelAnimationFrame(raf);
    };
  }, [fromWeight, radius, toWeight]);

  const chars = useMemo(() => text.split(""), [text]);

  return (
    <span
      className={className}
      style={{
        display: "inline",
        fontFamily,
        fontVariationSettings: `'wght' ${fromWeight}`
      }}
    >
      {chars.map((ch, idx) => (
        <span
          key={`${ch}-${idx}`}
          ref={el => {
            spansRef.current[idx] = el;
          }}
          style={{
            display: "inline-block",
            fontVariationSettings: `'wght' ${fromWeight}`
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  );
}

type HeroSectionProps = {
  currentMonth: string;
  welcomeText?: string;
  isActive?: boolean;
};

export function HeroSection({ currentMonth, welcomeText, isActive = true }: HeroSectionProps) {
  const [year, monthPart] = currentMonth.split("-");
  const vol = Number.parseInt(monthPart ?? "1", 10);
  const volumeText = `VOL.${Number.isFinite(vol) ? vol : 1}`;

  return (
    <div className="h-full w-full flex flex-col justify-center items-center px-6 sm:px-10 lg:px-20 relative overflow-hidden">
      <div className="softVignette" style={{ zIndex: 5 }} />

      <div className="relative text-center max-w-4xl mx-auto" style={{ zIndex: 10 }}>
        <div className="mb-12">
          <h1
            className="text-[3.5rem] md:text-[5rem] lg:text-[7rem] text-white mb-6 leading-none tracking-tight opacity-0 animate-fade-in"
            style={{
              animationFillMode: "forwards",
              animationDelay: "1s",
              animationDuration: "1.5s",
              fontFamily: "var(--font-fraunces)",
              textShadow: "0 4px 20px rgba(0,0,0,0.5)"
            }}
          >
            <VariableWeightText
              text={siteConfig.brand.name}
              radius={200}
              fromWeight={900}
              toWeight={100}
              fontFamily="Avantt"
            />
          </h1>

          <div
            className="tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in"
            style={{
              animationFillMode: "forwards",
              animationDelay: "1.5s",
              animationDuration: "1s",
              fontFamily: "Avantt",
              textShadow: "0 2px 10px rgba(0,0,0,0.4)",
              color: "rgba(255,255,255,0.9)"
            }}
          >
            <VariableWeightText
              text={siteConfig.brand.tagline}
              radius={120}
              fromWeight={400}
              toWeight={900}
              fontFamily="Avantt"
              className="text-[14px] md:text-[20px] lg:text-[24px] tracking-[0.2em] sm:tracking-[0.3em]"
            />
          </div>

        </div>

        {welcomeText && (
          <div
            className="bodyText opacity-0 animate-fade-in text-left max-w-[700px] mx-auto"
            style={{ animationFillMode: "forwards", animationDelay: "3.5s", animationDuration: "1.5s" }}
          >
            <p
              style={{
                fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                fontSize: "16px",
                whiteSpace: "pre-line"
              }}
            >
              {welcomeText}
            </p>
          </div>
        )}
      </div>

      {isActive && siteConfig.hero.scrollHint.enabled && (
        <div
          className="fixed bottom-8 left-0 right-0 flex justify-center opacity-0 animate-fade-in"
          style={{ animationFillMode: "forwards", animationDelay: "4.5s", animationDuration: "1s", zIndex: 20 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-white/40 text-xs tracking-[0.2em] uppercase"
              style={{ fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              {siteConfig.hero.scrollHint.label}
            </span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
