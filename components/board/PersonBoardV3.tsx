"use client";

import { useEffect, useState } from "react";
import type { PersonBoardData, NewsletterProject } from "@/data/newsletter";
import { CountUp } from "@/components/CountUp";
import { Typewriter } from "@/components/Typewriter";

const STATUS_META: Record<string, { icon: string; color: string; label: string }> = {
  done: { icon: "✓", color: "#34d399", label: "done" },
  progress: { icon: "⟳", color: "#fbbf24", label: "progress" },
  observe: { icon: "◷", color: "#a78bfa", label: "observe" },
};

const MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace";
const DISPLAY = "'ABC Ginto Nord Variable', 'Avantt', system-ui, sans-serif";

type RowPhase = "pending" | "streaming" | "done";

/** 单条工作项：先骨架 shimmer，再 Typewriter 写标题，字段逐个注入。 */
function RowGen({
  p,
  phase,
  onTyped,
}: {
  p: NewsletterProject;
  phase: RowPhase;
  onTyped: () => void;
}) {
  const st = STATUS_META[p.status ?? "progress"];
  const clickable = !!p.figmaUrl && p.figmaUrl !== "#";
  const title = p.displayTitle || p.title;
  const sub = p.flipHeadline || p.description.split("\n")[0];

  const [skeleton, setSkeleton] = useState(true);
  const [titleDone, setTitleDone] = useState(false);

  useEffect(() => {
    if (phase === "streaming") {
      setSkeleton(true);
      setTitleDone(false);
      const id = setTimeout(() => setSkeleton(false), 300);
      return () => clearTimeout(id);
    }
    if (phase === "done") {
      setSkeleton(false);
      setTitleDone(true);
    }
    if (phase === "pending") {
      setSkeleton(true);
      setTitleDone(false);
    }
  }, [phase]);

  // ── pending：未生成，幽灵骨架条 ──
  if (phase === "pending") {
    return (
      <div className="flex gap-2.5" style={{ padding: "7px 0", opacity: 0.32 }}>
        <div className="flex-none" style={{ width: 20, height: 20, borderRadius: 6, background: "rgba(255,255,255,0.05)", marginTop: 1 }} />
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <div style={{ height: 9, width: "62%", borderRadius: 4, background: "rgba(255,255,255,0.07)" }} />
          <div style={{ height: 7, width: "88%", borderRadius: 4, background: "rgba(255,255,255,0.045)" }} />
        </div>
      </div>
    );
  }

  const streaming = phase === "streaming";
  const fieldsIn = streaming ? titleDone : true; // done 直接全显

  const Inner = (
    <div
      className="flex gap-2.5"
      style={{
        padding: "7px 0",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
      }}
    >
      {/* 状态徽标 */}
      <div
        className="grid place-items-center flex-none"
        style={{
          width: 20,
          height: 20,
          borderRadius: 6,
          fontSize: 10,
          fontWeight: 800,
          color: "#0a0a12",
          background: skeleton ? "rgba(255,255,255,0.08)" : st.color,
          marginTop: 1,
          boxShadow: skeleton ? "none" : `0 0 10px ${st.color}66`,
          transition: "background .3s, box-shadow .3s",
        }}
      >
        {skeleton ? "" : st.icon}
      </div>

      <div className="flex-1 min-w-0">
        {/* 标题：skeleton → Typewriter → 静态 */}
        {skeleton ? (
          <div style={{ height: 11, width: "55%", borderRadius: 4, background: "linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0.14),rgba(255,255,255,0.06))", backgroundSize: "200% 100%", animation: "v3shimmer 1.1s linear infinite" }} />
        ) : (
          <div style={{ fontSize: "clamp(11.5px,1.25vw,13.5px)", fontWeight: 700, lineHeight: 1.3, color: "#f4f1fb", fontFamily: DISPLAY }}>
            {streaming ? (
              <Typewriter text={title} play speed={20} onDone={() => { setTitleDone(true); onTyped(); }} />
            ) : (
              title
            )}
          </div>
        )}

        {/* 字段注入：标题写完后逐个淡入 */}
        <div
          style={{
            marginTop: 4,
            opacity: fieldsIn ? 1 : 0,
            transform: fieldsIn ? "none" : "translateY(4px)",
            transition: "opacity .4s ease, transform .4s ease",
          }}
        >
          <div
            style={{
              fontSize: "clamp(10px,1.05vw,11px)",
              color: "#9a92ad",
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {sub}
          </div>
          <span
            style={{
              display: "inline-block",
              fontSize: 9,
              fontWeight: 700,
              fontFamily: MONO,
              borderRadius: 5,
              padding: "1.5px 7px",
              marginTop: 5,
              color: st.color,
              background: `${st.color}1c`,
              border: `1px solid ${st.color}3a`,
            }}
          >
            {st.label}{clickable ? " ↗" : ""}
          </span>
        </div>
      </div>
    </div>
  );

  return clickable ? (
    <a href={p.figmaUrl} target="_blank" rel="noopener noreferrer" className="block transition-opacity hover:opacity-80">
      {Inner}
    </a>
  ) : (
    <div>{Inner}</div>
  );
}

/** V3：genUI 现场生成感（深色）。流式骨架 → Typewriter 写出 → 字段注入；扫描线 / 生成进度。 */
export function PersonBoardV3({ data, isActive }: { data: PersonBoardData; isActive: boolean }) {
  const { person, stats, byGroup } = data;
  const groups = byGroup.slice(0, 2);
  const allRows = groups.flatMap((g) => g.projects);
  const total = allRows.length;

  // 流式控制：genIdx = 当前正在生成的全局行号
  const [genIdx, setGenIdx] = useState(0);

  useEffect(() => {
    setGenIdx(0);
  }, [isActive, total]);

  const advance = () => setGenIdx((i) => Math.min(i + 1, total));

  const phaseOf = (idx: number): RowPhase => {
    if (!isActive) return "done";
    if (idx < genIdx) return "done";
    if (idx === genIdx) return "streaming";
    return "pending";
  };

  const doneCount = isActive ? Math.min(genIdx, total) : total;
  const pct = total ? Math.round((doneCount / total) * 100) : 100;
  const generating = isActive && genIdx < total;

  let rowIdx = -1;

  return (
    <div
      className="relative w-full aspect-[680/400] overflow-hidden flex flex-col"
      style={{
        borderRadius: 8,
        background: "radial-gradient(120% 130% at 12% 0%, #1b1730 0%, #100d1c 48%, #0a0810 100%)",
        boxShadow: "0 4px 34px rgba(80,40,140,0.4), inset 0 0 0 1px rgba(150,120,255,0.12)",
        padding: "clamp(14px, 2.2vw, 22px)",
        color: "#e9e6f4",
        fontFamily: "'Avantt', system-ui, sans-serif",
      }}
    >
      {/* 局部 keyframes */}
      <style>{`
        @keyframes v3shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes v3scan { 0%{transform:translateY(-100%)} 100%{transform:translateY(2400%)} }
        @keyframes v3pulse { 0%,100%{opacity:.35;transform:scale(.85)} 50%{opacity:1;transform:scale(1)} }
      `}</style>

      {/* 网格底纹 */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(150,120,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(150,120,255,0.05) 1px, transparent 1px)", backgroundSize: "22px 22px", maskImage: "radial-gradient(120% 100% at 50% 0%, #000 30%, transparent 85%)", WebkitMaskImage: "radial-gradient(120% 100% at 50% 0%, #000 30%, transparent 85%)" }} />
      {/* 扫描线：生成时才跑 */}
      {generating && (
        <div className="absolute inset-x-0 pointer-events-none" style={{ top: 0, height: 3, background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.7), transparent)", animation: "v3scan 2.6s linear infinite", opacity: 0.6 }} />
      )}

      {/* header */}
      <div className="relative flex items-center gap-3 flex-none" style={{ marginBottom: "clamp(8px,1.4vw,14px)" }}>
        <div
          className="grid place-items-center flex-none"
          style={{ width: 40, height: 40, borderRadius: 12, fontSize: 20, background: `linear-gradient(135deg, ${person.color}40, ${person.color}10)`, boxShadow: `inset 0 0 0 1px ${person.color}55, 0 0 18px ${person.color}33` }}
        >
          {person.avatar ?? "🙂"}
        </div>
        <div className="min-w-0">
          <div style={{ fontSize: "clamp(14px,1.6vw,18px)", fontWeight: 800, letterSpacing: "0.2px", fontFamily: DISPLAY, color: "#fff" }}>
            {person.name} 的日报
          </div>
          <div style={{ fontSize: 10.5, color: "#8a82a0", marginTop: 1, fontFamily: MONO }}>
            {person.date} · {person.id}.tsx
          </div>
        </div>

        {/* live 指示 */}
        <div className="ml-auto flex items-center gap-1.5 flex-none" style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 700, color: generating ? "#a78bfa" : "#34d399", padding: "4px 9px", borderRadius: 20, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: "currentColor", boxShadow: "0 0 8px currentColor", animation: generating ? "v3pulse 1s ease-in-out infinite" : "none" }} />
          {generating ? "GENERATING" : "RENDERED"}
        </div>
      </div>

      {/* 统计：mono 计量条 + 生成进度 */}
      <div className="relative flex items-center gap-2 flex-none" style={{ marginBottom: "clamp(8px,1.2vw,12px)" }}>
        {([["done", stats.done], ["progress", stats.progress], ["observe", stats.observe]] as const).map(([k, n]) => {
          const c = STATUS_META[k].color;
          return (
            <div key={k} className="flex items-center gap-1.5" style={{ padding: "4px 10px", borderRadius: 8, background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <span style={{ fontSize: "clamp(14px,1.7vw,18px)", fontWeight: 800, lineHeight: 1, color: c, fontFamily: DISPLAY }}>
                {isActive ? <CountUp value={n} play={isActive} /> : n}
              </span>
              <span style={{ fontSize: 9, color: "#7c7490", fontFamily: MONO, fontWeight: 700, textTransform: "uppercase" }}>{STATUS_META[k].label}</span>
            </div>
          );
        })}
        <div className="ml-auto flex items-center gap-2 flex-1 min-w-0" style={{ maxWidth: "44%" }}>
          <div className="flex-1 overflow-hidden" style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.07)" }}>
            <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99, background: "linear-gradient(90deg,#7b5cff,#a78bfa)", boxShadow: "0 0 8px rgba(167,139,250,0.6)", transition: "width .5s cubic-bezier(.16,1,.3,1)" }} />
          </div>
          <span style={{ fontFamily: MONO, fontSize: 9.5, fontWeight: 700, color: "#a78bfa" }}>{pct}%</span>
        </div>
      </div>

      {/* 两栏 console 面板 */}
      <div className="relative grid gap-2.5 flex-1 min-h-0" style={{ gridTemplateColumns: groups.length > 1 ? "1fr 1fr" : "1fr" }}>
        {groups.map((g) => (
          <div
            key={g.group}
            className="flex flex-col overflow-hidden"
            style={{ borderRadius: 12, background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", padding: "clamp(9px,1.3vw,13px)" }}
          >
            {/* console 标题栏 */}
            <div className="flex items-center gap-2 flex-none" style={{ marginBottom: 7, paddingBottom: 6, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ display: "flex", gap: 3 }}>
                {["#ff6b6b", "#fbbf24", "#34d399"].map((c) => (
                  <span key={c} style={{ width: 6, height: 6, borderRadius: 99, background: c, opacity: 0.7 }} />
                ))}
              </span>
              <b style={{ fontSize: "clamp(11px,1.25vw,13px)", fontWeight: 800, fontFamily: MONO, color: "#cabffe" }}>{"// "}{g.group}</b>
              <span className="ml-auto" style={{ fontSize: 9.5, fontWeight: 700, color: "#7c7490", fontFamily: MONO }}>{g.projects.length}×</span>
            </div>

            <div className="flex flex-col overflow-hidden">
              {g.projects.map((p) => {
                rowIdx += 1;
                return <RowGen key={p.id} p={p} phase={phaseOf(rowIdx)} onTyped={advance} />;
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 金句：meta */}
      <div className="relative flex-none text-center" style={{ fontSize: 10, color: "#7c7490", marginTop: "clamp(7px,1vw,12px)", fontFamily: MONO }}>
        {generating ? (
          <span style={{ color: "#a78bfa" }}>▍ streaming card {doneCount}/{total} …</span>
        ) : (
          <span>
            由 <b style={{ color: "#cabffe" }}>Dynamic UI</b> 实时生成 · <i style={{ color: "#9a92ad" }}>这张卡本身就是它的产物</i>
          </span>
        )}
      </div>
    </div>
  );
}
