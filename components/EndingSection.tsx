"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type EndingSectionProps = {
  /**
   * Suggested format:
   * - First sentence becomes the animated title (SplitText)
   * - Remaining text becomes the body
   * - If you include a blank line, the rest is treated as footer/signature
   */
  endingText?: string;
};

function useInView<T extends Element>(rootMargin = "-50px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) setInView(true);
      },
      { root: null, rootMargin, threshold: 0.1 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

function SplitText({
  text,
  className = "",
  delayMs = 70,
  durationMs = 800
}: {
  text: string;
  className?: string;
  delayMs?: number;
  durationMs?: number;
}) {
  const { ref, inView } = useInView<HTMLHeadingElement>("-50px");
  const chars = useMemo(() => Array.from(text), [text]);

  return (
    <h2 ref={ref} className={className} aria-label={text}>
      {chars.map((ch, idx) => {
        const isSpace = ch === " ";
        return (
          <span
            key={`${ch}-${idx}`}
            aria-hidden="true"
            style={{
              display: "inline-block",
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0px)" : "translateY(40px)",
              transitionProperty: "opacity, transform",
              transitionDuration: `${durationMs}ms`,
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: `${idx * delayMs}ms`,
              whiteSpace: isSpace ? "pre" : "normal"
            }}
          >
            {isSpace ? "\u00A0" : ch}
          </span>
        );
      })}
    </h2>
  );
}

const DEFAULT_ENDING_TITLE = "Thanks for making this far.";
const DEFAULT_ENDING_BODY = "Please drop us a line if you have ideas, suggestions, or feedback!\nSee you next month.";
const DEFAULT_ENDING_FOOTER = "MAI-A China Design & Research Team ♥️ from Suzhou and Beijing";

function firstSentenceSplit(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return { title: DEFAULT_ENDING_TITLE, rest: "" };

  const boundaries = [".", "。", "!", "！", "?", "？"];
  let idx = -1;
  for (const ch of boundaries) {
    const i = trimmed.indexOf(ch);
    if (i >= 0 && (idx === -1 || i < idx)) idx = i;
  }

  if (idx >= 0) {
    const title = trimmed.slice(0, idx + 1).trim();
    const rest = trimmed.slice(idx + 1).trim();
    return { title: title || DEFAULT_ENDING_TITLE, rest };
  }

  const [firstLine, ...restLines] = trimmed.split("\n");
  const title = (firstLine ?? "").trim() || DEFAULT_ENDING_TITLE;
  const rest = restLines.join("\n").trim();
  return { title, rest };
}

function parseEndingText(endingText?: string) {
  const raw = (endingText ?? "").replace(/\r\n/g, "\n").trim();
  if (!raw) {
    return { title: DEFAULT_ENDING_TITLE, body: DEFAULT_ENDING_BODY, footer: DEFAULT_ENDING_FOOTER };
  }

  const blocks = raw
    .split(/\n\s*\n/g)
    .map(block => block.trim())
    .filter(Boolean);

  const main = blocks[0] ?? raw;
  const footerBlock = blocks.length > 1 ? blocks.slice(1).join("\n\n").trim() : "";

  const { title, rest } = firstSentenceSplit(main);
  const body = rest.trim();
  const footer = footerBlock.trim();

  return { title, body, footer };
}

export function EndingSection({ endingText }: EndingSectionProps) {
  const { title, body, footer } = useMemo(() => parseEndingText(endingText), [endingText]);

  return (
    <div className="w-full h-screen relative flex flex-col items-center justify-center px-6 sm:px-10 lg:px-20">
      <div className="softVignette" style={{ zIndex: 5 }} />

      <div className="relative z-10 text-center max-w-4xl mx-auto space-y-10">
        <div className="space-y-8">
          <SplitText text={title} className="ending-split-title" />

          {body && (
            <p
              className="text-white/60 text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
              style={{ fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif', whiteSpace: "pre-line" }}
            >
              {body}
            </p>
          )}
        </div>

        {footer && (
          <div className="pt-6" style={{ fontFamily: '"SF Pro", -apple-system, BlinkMacSystemFont, sans-serif' }}>
            <p className="text-white/40 text-sm tracking-wide" style={{ whiteSpace: "pre-line" }}>
              {footer}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
