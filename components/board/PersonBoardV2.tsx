"use client";

import { useEffect, useState } from "react";
import type { PersonBoardData, NewsletterProject } from "@/data/newsletter";
import { CountUp } from "@/components/CountUp";
import { Typewriter } from "@/components/Typewriter";

const STATUS_META: Record<string, { icon: string; color: string; label: string }> = {
  done: { icon: "✓", color: "#5fe0a8", label: "已完成" },
  progress: { icon: "⟳", color: "#f0b24a", label: "进行中" },
  observe: { icon: "◷", color: "#b794ff", label: "观察中" },
};

/** V2：深色彩虹底版。深色玻璃拟态让底层彩虹 shader 透出，person.color 做强调与发光。微软风深色 portfolio。 */
export function PersonBoardV2({ data, isActive }: { data: PersonBoardData; isActive: boolean }) {
  const { person, stats, byGroup } = data;
  const accent = person.color;
  const allRows = byGroup.flatMap((g) => g.projects);
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!isActive) { setRevealed(0); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setRevealed(i);
      if (i >= allRows.length) clearInterval(id);
    }, 380);
    return () => clearInterval(id);
  }, [isActive, allRows.length]);

  let rowIdx = -1;
  const font = '"ABC Ginto Nord Variable", "Avantt", system-ui, sans-serif';

  return (
    <div
      className="relative w-full aspect-[680/400] overflow-hidden flex flex-col"
      style={{
        borderRadius: 14,
        background: "rgba(20,20,23,0.55)",
        backdropFilter: "blur(22px) saturate(140%)",
        WebkitBackdropFilter: "blur(22px) saturate(140%)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 18px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        padding: "clamp(16px,2.5vw,26px)",
        color: "#f3f1f6",
        fontFamily: font,
      }}
    >
      {/* accent 发光晕染：让彩虹底与强调色融合 */}
      <div
        className="absolute pointer-events-none"
        style={{ top: "-30%", right: "-12%", width: "55%", height: "72%", background: `radial-gradient(circle, ${accent}55, transparent 68%)`, filter: "blur(34px)" }}
      />

      {/* header：人物 + 统计大数字 */}
      <div className="relative flex items-center gap-3 flex-none" style={{ marginBottom: "clamp(12px,1.8vw,20px)" }}>
        <div
          className="grid place-items-center flex-none"
          style={{ width: 46, height: 46, borderRadius: 15, fontSize: 23, background: `linear-gradient(135deg, ${accent}66, ${accent}1a)`, border: `1px solid ${accent}55`, boxShadow: `0 0 22px ${accent}44` }}
        >
          {person.avatar ?? "🙂"}
        </div>
        <div className="min-w-0">
          <div style={{ fontSize: "clamp(15px,1.8vw,20px)", fontWeight: 800, letterSpacing: "0.3px" }}>{person.name} 的日报</div>
          <div style={{ fontSize: 11.5, color: "rgba(243,241,246,0.55)", marginTop: 2 }}>{person.role} · {person.date}</div>
        </div>
        <div className="ml-auto flex gap-2 flex-none">
          {([["done", stats.done], ["progress", stats.progress], ["observe", stats.observe]] as const).map(([k, n]) => (
            <div
              key={k}
              className="text-center"
              style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "7px 13px", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div style={{ fontSize: "clamp(16px,2vw,22px)", fontWeight: 800, lineHeight: 1, color: accent, textShadow: `0 0 14px ${accent}66` }}>
                {isActive ? <CountUp value={n} play={isActive} /> : n}
              </div>
              <div style={{ fontSize: 9.5, color: "rgba(243,241,246,0.5)", marginTop: 4, fontWeight: 600 }}>{STATUS_META[k].label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 中部：按业务线分栏列工作项 */}
      <div
        className="relative grid gap-3 flex-1 min-h-0"
        style={{ gridTemplateColumns: byGroup.length > 1 ? `repeat(${Math.min(byGroup.length, 3)}, 1fr)` : "1fr" }}
      >
        {byGroup.slice(0, 3).map((g) => (
          <div
            key={g.group}
            className="flex flex-col overflow-hidden"
            style={{ background: "rgba(255,255,255,0.035)", borderRadius: 14, padding: "clamp(11px,1.5vw,16px)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-2 flex-none" style={{ marginBottom: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: accent, boxShadow: `0 0 8px ${accent}` }} />
              <b style={{ fontSize: "clamp(11.5px,1.35vw,14px)", fontWeight: 800, letterSpacing: "0.2px" }}>{g.group}</b>
              <span className="ml-auto" style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(243,241,246,0.4)" }}>{g.projects.length}</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              {g.projects.map((p: NewsletterProject, j) => {
                rowIdx += 1;
                const myIdx = rowIdx;
                const show = isActive ? myIdx < revealed : true;
                const st = STATUS_META[p.status ?? "progress"];
                const clickable = p.figmaUrl && p.figmaUrl !== "#";
                const title = p.displayTitle || p.title;
                const Inner = (
                  <div
                    className="flex gap-2.5"
                    style={{ padding: "7px 0", borderTop: j === 0 ? "none" : "1px solid rgba(255,255,255,0.06)", opacity: show ? 1 : 0, transform: show ? "none" : "translateY(6px)", transition: "opacity .4s, transform .4s" }}
                  >
                    <div
                      className="grid place-items-center flex-none"
                      style={{ width: 20, height: 20, borderRadius: 7, fontSize: 11, fontWeight: 800, color: st.color, background: `${st.color}22`, border: `1px solid ${st.color}55`, marginTop: 1 }}
                    >
                      {st.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div style={{ fontSize: "clamp(11.5px,1.25vw,13.5px)", fontWeight: 700, lineHeight: 1.35, color: "#f3f1f6" }}>
                        {isActive && show ? <Typewriter text={title} play={show} speed={22} /> : title}
                      </div>
                      <div
                        style={{ fontSize: "clamp(10px,1.05vw,11.5px)", color: "rgba(243,241,246,0.5)", marginTop: 3, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                      >
                        {p.flipHeadline || p.description.split("\n")[0]}
                      </div>
                      <span
                        style={{ display: "inline-block", fontSize: 9.5, fontWeight: 700, borderRadius: 20, padding: "2px 9px", marginTop: 5, color: st.color, background: `${st.color}1a`, border: `1px solid ${st.color}40` }}
                      >
                        {st.label}{clickable ? " · 查看 ›" : ""}
                      </span>
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

      {/* 底部金句 */}
      <div className="relative flex-none text-center" style={{ fontSize: 10.5, color: "rgba(243,241,246,0.42)", marginTop: "clamp(8px,1.2vw,14px)" }}>
        由 <b style={{ color: accent }}>Dynamic UI</b> 实时生成 · 这张卡本身就是它的产物
      </div>
    </div>
  );
}
