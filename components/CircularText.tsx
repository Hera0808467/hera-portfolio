"use client";

import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

type HoverBehavior = "slowDown" | "speedUp" | "pause" | "goBonkers" | "none";

type CircularTextProps = {
  text: string;
  spinDuration?: number;
  onHover?: HoverBehavior;
  className?: string;
};

function getHoverDurationSeconds(base: number, behavior: HoverBehavior): number {
  switch (behavior) {
    case "slowDown":
      return base * 2;
    case "speedUp":
      return Math.max(1, base / 4);
    case "goBonkers":
      return Math.max(0.5, base / 20);
    case "pause":
    case "none":
    default:
      return base;
  }
}

export function CircularText({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  className = ""
}: CircularTextProps) {
  const chars = useMemo(() => Array.from(text), [text]);
  const [isHovered, setIsHovered] = useState(false);

  const duration = isHovered ? getHoverDurationSeconds(spinDuration, onHover) : spinDuration;
  const isPaused = onHover === "pause" && isHovered;
  const scale = onHover === "goBonkers" && isHovered ? 0.8 : 1;

  return (
    <div
      className={`circular-text ${className}`}
      style={{ transform: `scale(${scale})` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="circular-text__inner"
        style={
          {
            ["--spin-duration" as never]: `${duration}s`,
            animationPlayState: isPaused ? "paused" : "running"
          } as CSSProperties
        }
      >
        {chars.map((ch, idx) => {
          const deg = (360 / chars.length) * idx;
          const transform = `rotate(${deg}deg)`;
          return (
            <span key={`${ch}-${idx}`} style={{ transform, WebkitTransform: transform }}>
              {ch}
            </span>
          );
        })}
      </div>
    </div>
  );
}
