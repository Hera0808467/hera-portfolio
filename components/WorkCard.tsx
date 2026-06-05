"use client";

import { motion } from "motion/react";
import { useState } from "react";
import type { NewsletterProject } from "@/data/newsletter";
import { CountUp } from "@/components/CountUp";

type WorkCardProps = {
  project: NewsletterProject;
  /** 瀑布尺寸：tall 占两行高、wide 占两列宽、normal 普通。 */
  size?: "normal" | "tall" | "wide";
};

export function WorkCard({ project, size = "normal" }: WorkCardProps) {
  const [flipped, setFlipped] = useState(false);
  const theme = project.themeColor ?? "#7B3FF2";
  const canFlip = Boolean(project.metrics && project.metrics.length > 0);

  const spanClass =
    size === "tall" ? "row-span-2" : size === "wide" ? "col-span-2" : "";
  const minH = size === "tall" ? "min-h-[420px]" : "min-h-[200px]";

  return (
    <motion.div
      layout
      layoutId={project.id}
      transition={{ type: "spring", stiffness: 220, damping: 28 }}
      className={`group relative ${spanClass}`}
      style={{ perspective: "1200px" }}
    >
      <div
        className={`relative w-full h-full ${minH}`}
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 480ms cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          cursor: canFlip ? "pointer" : "default",
        }}
        onClick={canFlip ? () => setFlipped((f) => !f) : undefined}
      >
        {/* 正面 */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 14,
            background: "rgba(22,22,24,0.55)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.28)",
          }}
        >
          {/* 封面缩略图 */}
          <div className="relative w-full overflow-hidden" style={{ flex: size === "tall" ? "1 1 auto" : "0 0 56%" }}>
            {project.coverImage ? (
              <img
                src={project.coverImage}
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                loading="lazy"
                decoding="async"
              />
            ) : (
              // 干净渐变封面：把首个指标做成大字印在上面（替代花花绿绿的信息截图）
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ background: `radial-gradient(120% 110% at 25% 15%, ${theme}, ${theme}55 55%, rgba(16,16,18,0.95))` }}>
                <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(2px 2px at 28% 30%, rgba(255,255,255,0.22), transparent), radial-gradient(1.5px 1.5px at 72% 24%, rgba(255,255,255,0.16), transparent), radial-gradient(1.5px 1.5px at 60% 72%, rgba(255,255,255,0.12), transparent)" }} />
                {project.metrics && project.metrics[0] && (
                  <div className="relative text-center px-4" style={{ fontFamily: "ABC Ginto Nord Variable, sans-serif", fontWeight: 800, color: "rgba(255,255,255,0.96)", letterSpacing: "-0.02em" }}>
                    <div style={{ fontSize: "clamp(1.8rem, 4.5vw, 3.4rem)", lineHeight: 1, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 6 }}>
                      {project.metrics[0].from !== undefined ? (
                        <>
                          <span style={{ fontSize: "0.42em", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>{project.metrics[0].from.toLocaleString()}</span>
                          <span style={{ fontSize: "0.5em", color: "rgba(255,255,255,0.6)" }}>→</span>
                          <span>{project.metrics[0].value.toLocaleString()}</span>
                        </>
                      ) : (
                        <>
                          {project.metrics[0].prefix && <span style={{ fontSize: "0.55em", color: "rgba(255,255,255,0.7)" }}>{project.metrics[0].prefix}</span>}
                          <span>{project.metrics[0].value.toLocaleString()}</span>
                          {project.metrics[0].suffix && <span style={{ fontSize: "0.36em", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{project.metrics[0].suffix}</span>}
                        </>
                      )}
                    </div>
                    <div className="mt-2" style={{ fontFamily: "Avantt", fontWeight: 400, fontSize: "clamp(0.65rem, 1vw, 0.78rem)", color: "rgba(255,255,255,0.6)", letterSpacing: "0.02em" }}>
                      {project.metrics[0].label}
                    </div>
                  </div>
                )}
              </div>
            )}
            {project.coverImage && <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(18,18,20,0.85), transparent 55%)" }} />}
            {project.group && (
              <span
                className="absolute top-3 left-3 px-2.5 py-1 rounded-full"
                style={{
                  fontFamily: "Avantt", fontSize: 10.5, letterSpacing: "0.06em",
                  color: "rgba(255,255,255,0.92)",
                  background: `${theme}40`, border: `1px solid ${theme}80`,
                  backdropFilter: "blur(8px)",
                }}
              >
                {project.group}
              </span>
            )}
            {canFlip && (
              <span
                className="absolute top-3 right-3 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ fontFamily: "Avantt", fontSize: 10, color: "rgba(255,255,255,0.85)", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.16)", backdropFilter: "blur(8px)" }}
              >
                ↻ 数据
              </span>
            )}
          </div>
          {/* 文字 */}
          <div className="relative px-4 pt-3 pb-4 flex flex-col gap-1.5">
            <h3 style={{ fontFamily: "Avantt", fontWeight: 600, fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)", color: "rgba(255,255,255,0.95)", letterSpacing: "0.01em", lineHeight: 1.3 }}>
              {project.displayTitle || project.title}
            </h3>
            {project.flipHeadline && (
              <p style={{ fontFamily: "Avantt", fontSize: "clamp(0.72rem, 1vw, 0.82rem)", color: "rgba(255,255,255,0.5)", lineHeight: 1.45 }}>
                {project.flipHeadline}
              </p>
            )}
          </div>
        </div>

        {/* 背面：指标 */}
        {canFlip && (
          <div
            className="absolute inset-0 w-full h-full overflow-hidden flex flex-col justify-center"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderRadius: 14,
              background: `radial-gradient(130% 100% at 18% 0%, ${theme}55, rgba(16,16,18,0.97) 62%), #101012`,
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
              padding: "clamp(18px, 2.5vw, 28px)",
            }}
          >
            <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(2px 2px at 22% 28%, rgba(255,255,255,0.16), transparent), radial-gradient(1.5px 1.5px at 72% 22%, rgba(255,255,255,0.12), transparent)" }} />
            {project.flipHeadline && (
              <div className="relative mb-4" style={{ fontFamily: "Avantt", fontWeight: 500, color: "rgba(255,255,255,0.9)", fontSize: "clamp(0.82rem, 1.3vw, 1rem)", lineHeight: 1.35 }}>
                {project.flipHeadline}
              </div>
            )}
            <div className="relative flex flex-col gap-3.5">
              {project.metrics!.map((m, i) => (
                <div key={i}>
                  <div style={{ fontFamily: "ABC Ginto Nord Variable, sans-serif", fontWeight: 700, color: "#fff", fontSize: "clamp(1.3rem, 2.6vw, 2rem)", lineHeight: 1, letterSpacing: "-0.02em", display: "flex", alignItems: "baseline", gap: 4 }}>
                    {m.from !== undefined ? (
                      <span style={{ display: "inline-flex", alignItems: "baseline", gap: 6 }}>
                        <span style={{ fontSize: "0.5em", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>{m.from.toLocaleString()}</span>
                        <span style={{ fontSize: "0.55em", color: "rgba(255,255,255,0.5)" }}>→</span>
                        <CountUp value={m.value} from={Math.min(m.from, m.value)} decimals={m.decimals ?? 0} play={flipped} delayMs={120 + i * 110} />
                      </span>
                    ) : (
                      <>
                        {m.prefix && <span style={{ fontSize: "0.6em", color: "rgba(255,255,255,0.65)" }}>{m.prefix}</span>}
                        <CountUp value={m.value} decimals={m.decimals ?? 0} play={flipped} delayMs={120 + i * 110} />
                        {m.suffix && <span style={{ fontSize: "0.42em", color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{m.suffix}</span>}
                      </>
                    )}
                  </div>
                  <div className="mt-1" style={{ fontFamily: "Avantt", color: "rgba(255,255,255,0.55)", fontSize: "clamp(0.66rem, 1vw, 0.78rem)", letterSpacing: "0.02em" }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute" style={{ right: 12, bottom: 10, fontFamily: "Avantt", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>↻ 翻回</div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
