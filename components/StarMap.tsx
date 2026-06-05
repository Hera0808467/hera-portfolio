"use client";

import { useEffect, useRef, useState } from "react";

/* 真·聚合星图：发光节点 + SVG 连线生长 + 簇内逐个点亮 + 漂浮 + 主题筛选。移植自 concept-4。 */

const SW = 1328, SH = 880;

const PERSONS: Record<string, { name: string; color: string }> = {
  hera: { name: "冯欢 Hera", color: "#b79cff" },
  zhuang: { name: "庄毅辉", color: "#86b6ff" },
  li: { name: "李天琛", color: "#ff9ec7" },
};

const THEMES: Record<string, { label: string; idx: string; color: string; tx: number; ty: number; cx: number; cy: number }> = {
  cap: { label: "能力定义", idx: "CLUSTER 01", color: "#86b6ff", tx: 300, ty: 150, cx: 320, cy: 400 },
  scene: { label: "场景探索", idx: "CLUSTER 02", color: "#b79cff", tx: 1090, ty: 150, cx: 1080, cy: 380 },
  eval: { label: "评估验证", idx: "CLUSTER 03", color: "#ff9ec7", tx: 700, ty: 560, cx: 700, cy: 710 },
};

type Node = { p: string; t: string; x: number; y: number; what: string };
const NODES: Node[] = [
  { p: "zhuang", t: "cap", x: 170, y: 330, what: "component / example 机制" },
  { p: "zhuang", t: "cap", x: 300, y: 240, what: "流式生成 parser" },
  { p: "zhuang", t: "cap", x: 175, y: 490, what: "自动修复" },
  { p: "hera", t: "cap", x: 430, y: 380, what: "渐进式披露 17750→473 · −97%" },
  { p: "hera", t: "cap", x: 360, y: 540, what: "5 张 persona 卡 → example" },
  { p: "zhuang", t: "scene", x: 945, y: 330, what: "genUI in markdown 探索" },
  { p: "hera", t: "scene", x: 1190, y: 300, what: "双月 Roadmap" },
  { p: "hera", t: "scene", x: 1075, y: 470, what: "多模型对比 gpt-5.5 vs Gemini" },
  { p: "hera", t: "eval", x: 580, y: 700, what: "三维 Eval 体系 · 触发 22/22" },
  { p: "li", t: "eval", x: 825, y: 665, what: "评估体系协同" },
  { p: "li", t: "eval", x: 735, y: 805, what: "benchmark 方向" },
];

const ORDER = ["cap", "scene", "eval"];

export function StarMap() {
  const [filter, setFilter] = useState("all");
  const [litNodes, setLitNodes] = useState<Set<number>>(new Set());
  const [shownAnchors, setShownAnchors] = useState<Set<string>>(new Set());
  const [typed, setTyped] = useState<Record<number, string>>({});
  const [floating, setFloating] = useState(false);
  const [statusText, setStatusText] = useState("正在聚合当天要点…");
  const [statusDetail, setStatusDetail] = useState("从 3 位成员的工作流中提取节点，按语义聚簇");
  const stars = useRef<{ x: number; y: number; s: number; d: number }[]>([]);
  if (stars.current.length === 0) {
    for (let i = 0; i < 70; i++) stars.current.push({ x: ((i * 47) % 100), y: ((i * 71) % 100), s: 1 + (i % 3) * 0.6, d: (i % 5) * 0.8 });
  }

  useEffect(() => {
    const timers: number[] = [];
    let delay = 900;
    ORDER.forEach((t) => {
      const th = THEMES[t];
      timers.push(window.setTimeout(() => {
        setShownAnchors((s) => new Set(s).add(t));
        setStatusText(`正在聚合 · ${th.label}`);
        setStatusDetail(`AI 从工作流中提取「${th.label}」相关节点并连线…`);
      }, delay));
      delay += 300;
      NODES.forEach((n, i) => {
        if (n.t !== t) return;
        const myDelay = delay;
        timers.push(window.setTimeout(() => {
          setLitNodes((s) => new Set(s).add(i));
          // 打字
          let ci = 0;
          const typer = window.setInterval(() => {
            ci += 1;
            setTyped((tp) => ({ ...tp, [i]: n.what.slice(0, ci) }));
            if (ci >= n.what.length) clearInterval(typer);
          }, 22);
          timers.push(typer);
        }, myDelay));
        delay += 520;
      });
      delay += 360;
    });
    timers.push(window.setTimeout(() => {
      setStatusText("聚合完成 · 当天形状已生成");
      setStatusDetail("11 个要点 · 3 个主题簇 · 3 位成员 — 点上方主题可下钻筛选");
      setFloating(true);
    }, delay));
    return () => timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
  }, []);

  return (
    <div className="relative w-full" style={{ fontFamily: "Avantt, -apple-system, sans-serif", color: "#f4f4f7" }}>
      <style>{`
        @keyframes smTwinkle { 0%,100%{opacity:.05} 50%{opacity:.5} }
        @keyframes smPulse { 0%,100%{box-shadow:0 0 0 4px rgba(255,255,255,.04),0 0 10px 1px currentColor} 50%{box-shadow:0 0 0 4px rgba(255,255,255,.07),0 0 20px 4px currentColor} }
        @keyframes smFloaty { 0%,100%{transform:translate(-50%,-50%) translateY(0)} 50%{transform:translate(-50%,-50%) translateY(-9px)} }
        @keyframes smBlip { 0%,100%{opacity:1} 50%{opacity:.3} }
        .sm-link { stroke-width:1; fill:none; transition:opacity .6s; }
        .sm-link.lit { animation: smDraw 1.1s cubic-bezier(.5,0,.2,1) forwards; }
        @keyframes smDraw { to { stroke-dashoffset:0; } }
      `}</style>

      {/* 标题区 */}
      <header className="flex justify-between items-end flex-wrap gap-6 mb-2">
        <div>
          <h1 style={{ fontFamily: "ABC Ginto Nord Variable, sans-serif", fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1 }}>
            动态日报 · <span style={{ background: "linear-gradient(100deg,#fff 10%,#b79cff 55%,#86b6ff 95%)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>聚合星图</span>
          </h1>
          <div style={{ marginTop: 12, color: "#8a8a96", fontSize: 14, maxWidth: 520, lineHeight: 1.6 }}>
            把每个人的工作要点拆成发光节点，跨人按<b style={{ color: "#fff" }}>主题</b>自动聚簇 —— 让团队当天的真实形状一眼浮现。
          </div>
        </div>
        <div style={{ textAlign: "right", color: "#8a8a96", fontSize: 13, lineHeight: 1.9 }}>
          <b style={{ color: "#fff" }}>3</b> 位成员 · <b style={{ color: "#fff" }}>11</b> 个要点 · <b style={{ color: "#fff" }}>3</b> 个主题簇
        </div>
      </header>

      {/* 图例 + 筛选 */}
      <div className="flex justify-between items-center flex-wrap gap-4 mt-7">
        <div className="flex gap-5 items-center">
          {Object.values(PERSONS).map((p) => (
            <div key={p.name} className="flex items-center gap-2" style={{ fontSize: 13, color: "#8a8a96" }}>
              <span style={{ width: 9, height: 9, borderRadius: 99, background: p.color }} />{p.name}
            </div>
          ))}
        </div>
        <div className="flex gap-2.5">
          {[["all", "全部主题", ""], ["cap", "能力定义", "#86b6ff"], ["scene", "场景探索", "#b79cff"], ["eval", "评估验证", "#ff9ec7"]].map(([key, label, c]) => (
            <button key={key} onClick={() => setFilter(key)} className="transition-all" style={{ cursor: "pointer", padding: "8px 16px", borderRadius: 999, fontSize: 13, letterSpacing: ".02em", background: filter === key ? "rgba(255,255,255,.10)" : "rgba(255,255,255,.045)", border: `1px solid ${filter === key ? "rgba(255,255,255,.30)" : "rgba(255,255,255,.10)"}`, color: filter === key ? "#f4f4f7" : "#8a8a96", backdropFilter: "blur(14px)" }}>
              {c && <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: 99, marginRight: 7, background: c as string, verticalAlign: "middle" }} />}{label}
            </button>
          ))}
        </div>
      </div>

      {/* 星图舞台 */}
      <div className="relative mt-6 mx-auto" style={{ width: "100%", maxWidth: SW, aspectRatio: `${SW}/${SH}`, borderRadius: 26, background: "radial-gradient(120% 120% at 30% 20%,rgba(255,255,255,.03),transparent 55%)", border: "1px solid rgba(255,255,255,.06)", overflow: "hidden" }}>
        {/* 星尘 */}
        {stars.current.map((s, i) => (
          <span key={i} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, borderRadius: 99, background: "#fff", animation: `smTwinkle 4s ease-in-out infinite`, animationDelay: `${s.d}s` }} />
        ))}

        {/* SVG 连线 */}
        <svg viewBox={`0 0 ${SW} ${SH}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}>
          {NODES.map((n, i) => {
            const th = THEMES[n.t];
            const len = Math.hypot(n.x - th.cx, n.y - th.cy);
            const lit = litNodes.has(i);
            const dim = filter !== "all" && filter !== n.t;
            return (
              <line key={i} x1={th.cx} y1={th.cy} x2={n.x} y2={n.y} className={`sm-link ${lit ? "lit" : ""}`} stroke={PERSONS[n.p].color} style={{ strokeDasharray: len, strokeDashoffset: lit ? 0 : len, opacity: dim ? 0.05 : lit ? 0.45 : 0 }} />
            );
          })}
        </svg>

        {/* 锚点 */}
        {Object.entries(THEMES).map(([k, th]) => {
          const cnt = NODES.filter((n) => n.t === k).length;
          const ppl = new Set(NODES.filter((n) => n.t === k).map((n) => n.p)).size;
          const show = shownAnchors.has(k);
          const dim = filter !== "all" && filter !== k;
          return (
            <div key={k} style={{ position: "absolute", left: `${(th.tx / SW) * 100}%`, top: `${(th.ty / SH) * 100}%`, transform: "translate(-50%,-50%)", textAlign: "center", opacity: show ? (dim ? 0.22 : 1) : 0, transition: "opacity .8s", pointerEvents: "none" }}>
              <div style={{ position: "absolute", left: "50%", top: "50%", width: 330, height: 330, transform: "translate(-50%,-50%)", borderRadius: 99, zIndex: -1, filter: "blur(60px)", opacity: 0.5, background: `radial-gradient(circle,${th.color},transparent 70%)` }} />
              <div style={{ fontSize: 12, letterSpacing: ".32em", color: "#8a8a96", marginBottom: 6 }}>{th.idx}</div>
              <div style={{ fontSize: "clamp(1.1rem,2.4vw,1.9rem)", fontWeight: 800, letterSpacing: "-.01em", color: "#fff" }}>{th.label}</div>
              <div style={{ marginTop: 8, fontSize: 12, color: "#8a8a96" }}>{cnt} 个要点 · 跨 {ppl} 人</div>
            </div>
          );
        })}

        {/* 节点 */}
        {NODES.map((n, i) => {
          const color = PERSONS[n.p].color;
          const lit = litNodes.has(i);
          const dim = filter !== "all" && filter !== n.t;
          const t = typed[i] ?? "";
          return (
            <div key={i} style={{ position: "absolute", left: `${(n.x / SW) * 100}%`, top: `${(n.y / SH) * 100}%`, transform: lit ? "translate(-50%,-50%) scale(1)" : "translate(-50%,-50%) scale(.3)", opacity: lit ? (dim ? 0.12 : 1) : 0, transition: "opacity .6s, transform .6s cubic-bezier(.2,.9,.3,1.2), filter .4s", filter: dim ? "grayscale(.6) blur(1px)" : "none", color, animation: floating && !dim ? `smFloaty ${(6 + (i % 3)).toFixed(1)}s ease-in-out infinite` : "none", animationDelay: `${(i % 4) * -1.2}s` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 16px 11px 13px", borderRadius: 14, maxWidth: 280, background: "rgba(20,20,26,.55)", border: "1px solid rgba(255,255,255,.10)", backdropFilter: "blur(16px)", boxShadow: "0 14px 40px rgba(0,0,0,.5)" }}>
                <span style={{ flex: "0 0 auto", width: 11, height: 11, borderRadius: 99, background: "currentColor", animation: "smPulse 3.4s ease-in-out infinite" }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11, letterSpacing: ".04em", marginBottom: 2, color: "currentColor", opacity: 0.78 }}>{PERSONS[n.p].name}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, color: "#f4f4f7", whiteSpace: "nowrap", overflow: "hidden" }}>
                    {t}{lit && t.length < n.what.length && <span style={{ display: "inline-block", width: 1, marginLeft: 1, height: "1em", background: "currentColor", animation: "smBlip .7s steps(1) infinite", verticalAlign: -1 }} />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 状态条 */}
      <div className="flex items-center gap-3.5 mt-5" style={{ color: "#8a8a96", fontSize: 13, letterSpacing: ".03em" }}>
        <span className="inline-flex items-center gap-2" style={{ padding: "6px 13px", borderRadius: 999, background: "rgba(255,255,255,.045)", border: "1px solid rgba(255,255,255,.10)" }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: "#7ee0a8", boxShadow: "0 0 10px #7ee0a8", animation: "smBlip 1.6s ease-in-out infinite" }} />{statusText}
        </span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>{statusDetail}</span>
      </div>
    </div>
  );
}
