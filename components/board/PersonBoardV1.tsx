"use client";

import { useEffect, useRef, useState } from "react";
import type { PersonBoardData, NewsletterProject } from "@/data/newsletter";
import { CountUp } from "@/components/CountUp";

const STATUS_META: Record<string, { icon: string; bg: string; pill: string; pillBg: string; label: string }> = {
  done: { icon: "✓", bg: "#5fb89a", pill: "#5fb89a", pillBg: "#eef9f3", label: "已完成" },
  progress: { icon: "⟳", bg: "#e8a33d", pill: "#e8a33d", pillBg: "#fdf3e2", label: "进行中" },
  observe: { icon: "◷", bg: "#9b7bff", pill: "#7b5cff", pillBg: "#f3eefb", label: "观察中" },
};

/** V1：暖色横版玻璃卡，1:1 还原用户示例。填进封面槽位 aspect 680/400。 */
export function PersonBoardV1({ data, isActive }: { data: PersonBoardData; isActive: boolean }) {
  const { person, stats, byGroup } = data;
  // 跨组全局行序号，dynamic 逐条揭示
  const allRows = byGroup.flatMap((g) => g.projects);
  const [revealed, setRevealed] = useState(0);
  useEffect(() => {
    if (!isActive) { setRevealed(0); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setRevealed(i);
      if (i >= allRows.length) clearInterval(id);
    }, 420);
    return () => clearInterval(id);
  }, [isActive, allRows.length]);

  // 原版卡片那种鼠标跟随 3D 倾斜（"能动来动去"）
  const figureRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const setTransform = (rx: number, ry: number, scale: number) => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
  };
  const AMP = 5;

  let rowIdx = -1;

  return (
    <figure
      ref={figureRef}
      className="relative w-full"
      style={{ perspective: "1100px", margin: 0 }}
      onMouseMove={(ev) => {
        const root = figureRef.current;
        if (!root) return;
        const rect = root.getBoundingClientRect();
        const dx = ev.clientX - rect.left - rect.width / 2;
        const dy = ev.clientY - rect.top - rect.height / 2;
        const rx = -((dy / (rect.height / 2)) * AMP);
        const ry = (dx / (rect.width / 2)) * AMP;
        setTransform(rx, ry, 1.015);
      }}
      onMouseEnter={() => setTransform(0, 0, 1.015)}
      onMouseLeave={() => setTransform(0, 0, 1)}
    >
    <div
      ref={cardRef}
      className="relative w-full aspect-[680/400] overflow-hidden flex flex-col"
      style={{
        borderRadius: 8,
        background: "linear-gradient(150deg,#fbeee6,#eee7fb 55%,#e7f0fb)",
        boxShadow: "0 4px 30px rgba(140,110,180,0.18)",
        border: "1px solid rgba(255,255,255,0.5)",
        padding: "clamp(16px, 2.4vw, 24px)",
        color: "#33303a",
        transformStyle: "preserve-3d",
        transition: "transform 140ms ease-out",
        willChange: "transform",
      }}
    >
      {/* header */}
      <div className="flex items-center gap-3 flex-none" style={{ marginBottom: "clamp(10px,1.6vw,18px)" }}>
        <div className="grid place-items-center flex-none" style={{ width: 44, height: 44, borderRadius: 14, fontSize: 22, background: `linear-gradient(135deg, ${person.color}55, ${person.color}22)`, boxShadow: "0 6px 18px rgba(140,110,180,0.10)" }}>
          {person.avatar ?? "🙂"}
        </div>
        <div>
          <div style={{ fontSize: "clamp(15px,1.7vw,19px)", fontWeight: 800, letterSpacing: "0.2px" }}>{person.name} 的日报</div>
          <div style={{ fontSize: 12, color: "#8a8294", marginTop: 2 }}>{person.date}</div>
        </div>
        <div className="ml-auto flex gap-2">
          {([["done", stats.done, "#5fb89a"], ["progress", stats.progress, "#7b5cff"], ["observe", stats.observe, "#e8a33d"]] as const).map(([k, n, c]) => (
            <div key={k} className="text-center" style={{ background: "#fff", borderRadius: 12, padding: "6px 13px", boxShadow: "0 6px 18px rgba(140,110,180,0.08)" }}>
              <div style={{ fontSize: "clamp(15px,1.8vw,20px)", fontWeight: 800, lineHeight: 1, color: c }}>{isActive ? <CountUp value={n} play={isActive} /> : n}</div>
              <div style={{ fontSize: 10, color: "#8a8294", marginTop: 3, fontWeight: 600 }}>{STATUS_META[k].label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 两栏业务线 */}
      <div className="grid gap-3 flex-1 min-h-0" style={{ gridTemplateColumns: byGroup.length > 1 ? "1fr 1fr" : "1fr" }}>
        {byGroup.slice(0, 2).map((g, gi) => (
          <div key={g.group} className="flex flex-col overflow-hidden" style={{ background: "#fff", borderRadius: 16, padding: "clamp(11px,1.5vw,16px)", boxShadow: "0 6px 18px rgba(140,110,180,0.08)" }}>
            <div className="flex items-center gap-2 flex-none" style={{ marginBottom: 9 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: gi === 0 ? "#7b5cff" : "#ff7a59" }} />
              <b style={{ fontSize: "clamp(12px,1.4vw,15px)", fontWeight: 800 }}>{g.group}</b>
              <span className="ml-auto" style={{ fontSize: 11, fontWeight: 700, color: "#a89bb8" }}>{g.projects.length} 项</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              {g.projects.map((p: NewsletterProject) => {
                rowIdx += 1;
                const myIdx = rowIdx;
                const show = isActive ? myIdx < revealed : true;
                const st = STATUS_META[p.status ?? "progress"];
                const clickable = p.figmaUrl && p.figmaUrl !== "#";
                const Inner = (
                  <div className="flex gap-2.5" style={{ padding: "8px 0", borderTop: myIdx === 0 || g.projects[0] === p ? "none" : "1px solid #f4eef8", opacity: show ? 1 : 0, transform: show ? "none" : "translateY(6px)", transition: "opacity .35s, transform .35s" }}>
                    <div className="grid place-items-center flex-none" style={{ width: 22, height: 22, borderRadius: 7, fontSize: 11, fontWeight: 800, color: "#fff", background: st.bg, marginTop: 1 }}>{st.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: "clamp(11.5px,1.25vw,13.5px)", fontWeight: 700, lineHeight: 1.35 }}>{p.displayTitle || p.title}</div>
                      <div style={{ fontSize: "clamp(10.5px,1.1vw,11.5px)", color: "#8a8294", marginTop: 3, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.flipHeadline || p.description.split("\n")[0]}</div>
                      <span style={{ display: "inline-block", fontSize: 9.5, fontWeight: 700, borderRadius: 20, padding: "2px 8px", marginTop: 5, color: st.pill, background: st.pillBg }}>{st.label}{clickable ? " · 查看 ›" : ""}</span>
                    </div>
                  </div>
                );
                return clickable ? (
                  <a key={p.id} href={p.figmaUrl} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">{Inner}</a>
                ) : (
                  <div key={p.id}>{Inner}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 金句 */}
      <div className="flex-none text-center" style={{ fontSize: 10.5, color: "#a89bb8", marginTop: "clamp(8px,1.2vw,14px)" }}>
        由 <b style={{ color: "#8a8294" }}>Dynamic UI</b> 实时生成 · 这张卡本身就是它的产物
      </div>
    </div>
    </figure>
  );
}
