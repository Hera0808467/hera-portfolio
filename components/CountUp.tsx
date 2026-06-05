"use client";

import { animate } from "motion/react";
import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  value: number;
  from?: number;
  decimals?: number;
  durationMs?: number;
  /** 触发动画的开关（卡片翻到背面时置 true）。 */
  play: boolean;
  delayMs?: number;
};

/** 数字从 from（默认 0）滚动生长到 value。play 变 true 时触发。 */
export function CountUp({ value, from = 0, decimals = 0, durationMs = 1100, play, delayMs = 0 }: CountUpProps) {
  const [display, setDisplay] = useState(from);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!play) {
      startedRef.current = false;
      setDisplay(from);
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;
    const controls = animate(from, value, {
      duration: durationMs / 1000,
      delay: delayMs / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [play, value, from, durationMs, delayMs]);

  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString();
  return <span>{formatted}</span>;
}
