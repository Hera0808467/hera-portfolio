"use client";

import { useMemo, useState } from "react";

export type ProjectGroup = {
  name: string;
  firstProjectIndex: number;
};

type GroupNavProps = {
  groups: ProjectGroup[];
  activeSectionIndex: number;
  onGroupClick: (firstProjectIndex: number) => void;
};

export function GroupNav({ groups, activeSectionIndex, onGroupClick }: GroupNavProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeGroupIndex = useMemo(() => {
    if (activeSectionIndex === 0) return -1;
    const projectIndex = activeSectionIndex - 1;
    for (let i = groups.length - 1; i >= 0; i--) {
      if (projectIndex >= groups[i].firstProjectIndex) return i;
    }
    return -1;
  }, [activeSectionIndex, groups]);

  if (groups.length === 0) return null;

  const roman = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];

  return (
    <>
      <div className="hidden sm:block fixed left-8 bottom-8 z-50">
        <div className="flex flex-col gap-2">
          {groups.map((g, idx) => {
            const isActive = activeGroupIndex === idx;
            const isHovered = hoveredIndex === idx;
            const seq = roman[idx + 1] || String(idx + 1);

            return (
              <button
                key={g.name}
                type="button"
                onClick={() => onGroupClick(g.firstProjectIndex)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="flex items-center"
                style={{ width: "180px" }}
              >
                <span
                  className={[
                    "text-xs transition-all duration-300 flex-shrink-0 whitespace-nowrap",
                    isActive ? "font-bold text-white" : isHovered ? "font-normal text-white underline" : "font-normal text-white/50"
                  ].join(" ")}
                  style={{ fontFamily: "Avantt" }}
                >
                  {g.name}
                </span>

                <div className="flex-1 h-[1px] relative overflow-hidden" style={{ marginLeft: "4px" }}>
                  <span
                    className="absolute inset-0 h-full transition-transform duration-500 ease-out"
                    style={{
                      background:
                        "repeating-linear-gradient(to right, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 2px, transparent 2px, transparent 4px)",
                      transform: isActive || isHovered ? "scaleX(1)" : "scaleX(0)",
                      transformOrigin: "left center"
                    }}
                  />
                </div>

                <span
                  className={[
                    "text-xs transition-all duration-300 text-right flex-shrink-0",
                    isActive ? "font-bold text-white" : "font-normal text-white/50 hover:text-white/70"
                  ].join(" ")}
                  style={{
                    fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif',
                    marginLeft: "4px"
                  }}
                >
                  {seq}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-4">
          {groups.map((g, idx) => {
            const isActive = activeGroupIndex === idx;
            return (
              <button key={g.name} type="button" onClick={() => onGroupClick(g.firstProjectIndex)}>
                <span
                  className={[
                    "text-[10px] transition-all duration-300 whitespace-nowrap",
                    isActive ? "font-bold text-white" : "font-normal text-white/50"
                  ].join(" ")}
                  style={{ fontFamily: "Avantt" }}
                >
                  {g.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
