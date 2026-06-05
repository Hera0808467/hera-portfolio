"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { NewsletterProject } from "@/data/newsletter";
import { CountUp } from "@/components/CountUp";

/** 打字机：play 为 true 时逐字写出，带光标。 */
function Typewriter({ text, play, speed = 26, onDone }: { text: string; play: boolean; speed?: number; onDone?: () => void }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!play) { setN(0); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) { clearInterval(id); onDone?.(); }
    }, speed);
    return () => clearInterval(id);
  }, [play, text, speed, onDone]);
  return (
    <span>
      {text.slice(0, n)}
      {play && n < text.length && (
        <span style={{ display: "inline-block", width: 2, height: "1em", background: "currentColor", marginLeft: 2, transform: "translateY(2px)", animation: "wbBlink 1s step-end infinite" }} />
      )}
    </span>
  );
}

type GlassBoardProps = { project: NewsletterProject; person: { name: string; role: string; color: string } };

export function GlassBoard({ project, person }: GlassBoardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4, once: true });
  const theme = project.themeColor ?? person.color;
  const bullets = project.bullets ?? [];
  const hero = project.metrics?.[0];
  // 控制 bullet 逐条出现：当前写到第几条
  const [activeBullet, setActiveBullet] = useState(0);

  useEffect(() => {
    if (inView) setActiveBullet(0);
  }, [inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36, scale: 0.985 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full overflow-hidden"
      style={{
        borderRadius: 24,
        background: `radial-gradient(120% 130% at 12% 0%, ${theme}30, rgba(20,20,23,0.62) 58%), rgba(20,20,23,0.55)`,
        backdropFilter: "blur(26px)",
        WebkitBackdropFilter: "blur(26px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: `0 30px 80px -30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)`,
        padding: "clamp(28px, 4vw, 52px)",
      }}
    >
      {/* 顶部：人物 + writing 标 */}
      <div className="flex items-center gap-3.5 mb-7">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${person.color}, ${person.color}88)`, boxShadow: `0 8px 22px ${person.color}44` }}>
          <span style={{ fontFamily: "ABC Ginto Nord Variable", fontWeight: 800, color: "#fff", fontSize: 18 }}>{person.name.slice(0, 1)}</span>
        </div>
        <div>
          <div style={{ fontFamily: "Avantt", fontWeight: 600, color: "#fff", fontSize: 16, letterSpacing: "0.01em" }}>{person.name}</div>
          <div style={{ fontFamily: "Avantt", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{person.role}</div>
        </div>
        {project.group && (
          <span className="ml-auto px-3 py-1 rounded-full" style={{ fontFamily: "Avantt", fontSize: 11, letterSpacing: "0.05em", color: "rgba(255,255,255,0.9)", background: `${theme}30`, border: `1px solid ${theme}66` }}>
            {project.group}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(220px,0.85fr)_1fr] gap-8 md:gap-10 items-start">
        {/* 左：标题 + 大数字 */}
        <div>
          <h3 className="mb-4" style={{ fontFamily: "Avantt", fontWeight: 600, color: "rgba(255,255,255,0.95)", fontSize: "clamp(1.3rem, 2.6vw, 1.9rem)", letterSpacing: "0.01em", lineHeight: 1.25 }}>
            {project.displayTitle || project.title}
          </h3>
          {hero && (
            <div style={{ fontFamily: "ABC Ginto Nord Variable, sans-serif", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
              {hero.from !== undefined ? (
                <span style={{ display: "inline-flex", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontSize: "clamp(1.1rem,2.4vw,1.7rem)", color: "rgba(255,255,255,0.38)", fontWeight: 500, textDecoration: "line-through" }}>{hero.from.toLocaleString()}</span>
                  <span style={{ fontSize: "clamp(1.3rem,3vw,2.2rem)", color: "rgba(255,255,255,0.55)" }}>→</span>
                  <span style={{ fontSize: "clamp(2.6rem,6vw,4.4rem)" }}><CountUp value={hero.value} from={Math.min(hero.from, hero.value)} play={inView} /></span>
                </span>
              ) : (
                <span style={{ fontSize: "clamp(2.6rem,6vw,4.4rem)", display: "inline-flex", alignItems: "baseline", gap: 6 }}>
                  {hero.prefix && <span style={{ fontSize: "0.55em", color: "rgba(255,255,255,0.7)" }}>{hero.prefix}</span>}
                  <CountUp value={hero.value} play={inView} />
                  {hero.suffix && <span style={{ fontSize: "0.4em", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{hero.suffix}</span>}
                </span>
              )}
            </div>
          )}
          {hero && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: `${theme}26`, border: `1px solid ${theme}55` }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: theme, boxShadow: `0 0 8px ${theme}` }} />
              <span style={{ fontFamily: "Avantt", fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{hero.label}</span>
            </div>
          )}
        </div>

        {/* 右：bullet 要点 dynamic 逐条写出 */}
        <div className="md:border-l md:pl-9" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontFamily: "Avantt", fontSize: 11, letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>本期要点</span>
            {inView && activeBullet < bullets.length && (
              <span style={{ fontFamily: "Avantt", fontSize: 10.5, color: theme, opacity: 0.9 }}>· writing…</span>
            )}
          </div>
          <ul className="flex flex-col gap-3">
            {bullets.map((b, i) => {
              const show = inView && i <= activeBullet;
              return (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={show ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.3 }}
                  className="flex items-start gap-3"
                  style={{ fontFamily: "Avantt", fontSize: "clamp(0.85rem, 1.3vw, 0.98rem)", color: "rgba(255,255,255,0.82)", lineHeight: 1.55 }}
                >
                  <span className="mt-2 shrink-0" style={{ width: 5, height: 5, borderRadius: 99, background: theme, boxShadow: `0 0 6px ${theme}`, opacity: show ? 1 : 0 }} />
                  <span>
                    {i < activeBullet ? b : i === activeBullet && show ? (
                      <Typewriter text={b} play={true} onDone={() => setActiveBullet((n) => Math.min(n + 1, bullets.length))} />
                    ) : null}
                  </span>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
