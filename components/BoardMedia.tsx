"use client";

import { useEffect, useRef, useState } from "react";
import type { NewsletterProject } from "@/data/newsletter";
import { CountUp } from "@/components/CountUp";

function Typewriter({ text, play, speed = 24, onDone }: { text: string; play: boolean; speed?: number; onDone?: () => void }) {
  const [n, setN] = useState(0);
  const doneRef = useRef(false);
  useEffect(() => {
    if (!play) { setN(0); doneRef.current = false; return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) { clearInterval(id); if (!doneRef.current) { doneRef.current = true; onDone?.(); } }
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

/** 白板内容，填进原大封面的同一个槽位（aspect 680/400）。isActive 时 dynamic 生成。 */
export function BoardMedia({ project, isActive }: { project: NewsletterProject; isActive: boolean }) {
  const theme = project.themeColor ?? "#7B3FF2";
  const bullets = project.bullets ?? [];
  const hero = project.metrics?.[0];
  const [activeBullet, setActiveBullet] = useState(0);

  useEffect(() => {
    if (isActive) setActiveBullet(0);
  }, [isActive]);

  return (
    <div
      className="relative w-full aspect-[680/400] overflow-hidden"
      style={{
        borderRadius: 8,
        background: `radial-gradient(120% 130% at 12% 0%, ${theme}33, rgba(20,20,23,0.55) 58%), rgba(20,20,23,0.45)`,
        backdropFilter: "blur(26px)",
        WebkitBackdropFilter: "blur(26px)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.07)",
      }}
    >
      {/* 星点装饰 */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(1.5px 1.5px at 18% 24%, rgba(255,255,255,0.14), transparent), radial-gradient(1.5px 1.5px at 78% 30%, rgba(255,255,255,0.10), transparent), radial-gradient(1.5px 1.5px at 60% 75%, rgba(255,255,255,0.08), transparent)" }} />

      <div className="relative h-full w-full grid grid-cols-[minmax(180px,0.8fr)_1fr] gap-6 p-6 sm:p-8">
        {/* 左：大数字 */}
        <div className="flex flex-col justify-center">
          {hero && (
            <>
              <div style={{ fontFamily: "ABC Ginto Nord Variable, sans-serif", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 6 }}>
                {hero.from !== undefined ? (
                  <span style={{ display: "inline-flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: "clamp(0.9rem,1.8vw,1.4rem)", color: "rgba(255,255,255,0.36)", fontWeight: 500, textDecoration: "line-through" }}>{hero.from.toLocaleString()}</span>
                    <span style={{ fontSize: "clamp(1.1rem,2.2vw,1.8rem)", color: "rgba(255,255,255,0.5)" }}>→</span>
                    <span style={{ fontSize: "clamp(2.2rem,5vw,3.6rem)" }}><CountUp value={hero.value} from={Math.min(hero.from, hero.value)} play={isActive} /></span>
                  </span>
                ) : (
                  <span style={{ fontSize: "clamp(2.2rem,5vw,3.6rem)", display: "inline-flex", alignItems: "baseline", gap: 5 }}>
                    {hero.prefix && <span style={{ fontSize: "0.55em", color: "rgba(255,255,255,0.7)" }}>{hero.prefix}</span>}
                    <CountUp value={hero.value} play={isActive} />
                    {hero.suffix && <span style={{ fontSize: "0.38em", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>{hero.suffix}</span>}
                  </span>
                )}
              </div>
              <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full self-start" style={{ background: `${theme}26`, border: `1px solid ${theme}55` }}>
                <span style={{ width: 5, height: 5, borderRadius: 99, background: theme, boxShadow: `0 0 8px ${theme}` }} />
                <span style={{ fontFamily: "Avantt", fontSize: 11, color: "rgba(255,255,255,0.8)" }}>{hero.label}</span>
              </div>
            </>
          )}
        </div>

        {/* 右：bullet dynamic 写出 */}
        <div className="flex flex-col justify-center border-l pl-6" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <div className="flex items-center gap-2 mb-3">
            <span style={{ fontFamily: "Avantt", fontSize: 10, letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>本期要点</span>
            {isActive && activeBullet < bullets.length && <span style={{ fontFamily: "Avantt", fontSize: 10, color: theme }}>· writing…</span>}
          </div>
          <ul className="flex flex-col gap-2">
            {bullets.map((b, i) => {
              const show = isActive && i <= activeBullet;
              return (
                <li key={i} className="flex items-start gap-2.5" style={{ fontFamily: "Avantt", fontSize: "clamp(0.78rem, 1.1vw, 0.9rem)", color: "rgba(255,255,255,0.82)", lineHeight: 1.5, opacity: show ? 1 : 0, transition: "opacity 0.3s" }}>
                  <span className="mt-1.5 shrink-0" style={{ width: 4, height: 4, borderRadius: 99, background: theme, boxShadow: `0 0 6px ${theme}` }} />
                  <span>
                    {i < activeBullet ? b : i === activeBullet && show ? (
                      <Typewriter text={b} play={true} onDone={() => setActiveBullet((n) => Math.min(n + 1, bullets.length))} />
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
