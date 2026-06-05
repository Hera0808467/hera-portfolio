"use client";

import { useEffect, useRef, useState } from "react";

/** 打字机：play 为 true 时逐字写出，写完调 onDone。带闪烁光标。 */
export function Typewriter({ text, play, speed = 24, onDone }: { text: string; play: boolean; speed?: number; onDone?: () => void }) {
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
