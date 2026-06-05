"use client";

import { motion } from "motion/react";

type ViewMode = "people" | "map";

/** 顶部 fixed 视图切换：按人白板 / 聚合星图。脱离滚动流，不影响磁吸。 */
export function ViewTabs({ mode, onChange }: { mode: ViewMode; onChange: (m: ViewMode) => void }) {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="inline-flex p-1 rounded-full" style={{ background: "rgba(20,20,23,0.5)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}>
        {([["people", "按人"], ["map", "聚合"]] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="relative px-5 py-1.5 rounded-full transition-colors"
            style={{ fontFamily: "Avantt", fontSize: 13, letterSpacing: "0.04em", color: mode === key ? "#1a1a1a" : "rgba(255,255,255,0.72)", zIndex: 1 }}
          >
            {mode === key && (
              <motion.span layoutId="view-tab-pill" className="absolute inset-0 rounded-full" style={{ background: "rgba(255,255,255,0.92)", zIndex: -1 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
            )}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
