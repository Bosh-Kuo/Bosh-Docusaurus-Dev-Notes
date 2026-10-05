import { cn } from "cn";
import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const SPRING_SETTLE = { type: "spring", stiffness: 260, damping: 30 } as const;

export interface TextMarkerHighlightProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
  /** 要套用螢光筆效果的文字片段。 */
  highlight: string;
  /** 渲染的 HTML 元素；標題層級應符合所在頁面的語意。 */
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** 筆畫開始前的延遲秒數。 */
  delay?: number;
}

/**
 * 文字進入視窗時，在下半部繪製帶有輕微起伏的螢光筆筆畫。
 * 裝飾層獨立於文字，保留原生 DOM 文字供輔助技術讀取。
 */
export function TextMarkerHighlight({
  text,
  highlight,
  as: Tag = "h2",
  delay = 0.2,
  className,
  ...props
}: TextMarkerHighlightProps) {
  const reduced = useReducedMotion();

  const parts = useMemo(() => {
    const idx = text.indexOf(highlight);
    if (idx === -1 || !highlight) {
      return { before: text, match: null as string | null, after: "" };
    }
    return {
      before: text.slice(0, idx),
      match: highlight,
      after: text.slice(idx + highlight.length),
    };
  }, [text, highlight]);

  // 使用兩段柔和的曲線起伏，呈現手繪筆畫。
  const markerPath = "M 2 14 C 18 10, 32 18, 48 13 S 78 8, 98 15";

  return (
    <Tag
      className={cn(
        "font-sans text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl",
        className,
      )}
      {...props}
    >
      {parts.before}
      {parts.match ? (
        <span className="relative inline whitespace-nowrap">
          {/* 裝飾筆畫約占行高的 55%，位於文字下半部。 */}
          <svg
            className="pointer-events-none absolute left-0 top-[42%] h-[55%] w-full overflow-visible text-[#facc15]/50 dark:text-[#facc15]/35"
            viewBox="0 0 100 24"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {reduced ? (
              <motion.path
                d={markerPath}
                fill="none"
                stroke="currentColor"
                strokeWidth={14}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.2, delay }}
              />
            ) : (
              <motion.path
                d={markerPath}
                fill="none"
                stroke="currentColor"
                strokeWidth={14}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transformOrigin: "50% 50%" }}
                initial={{ pathLength: 0, scaleY: 1.03 }}
                whileInView={{ pathLength: 1, scaleY: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  pathLength: { duration: 0.6, ease: EASE_OUT, delay },
                  // 筆畫完成後，讓垂直縮放回到穩定狀態。
                  scaleY: { ...SPRING_SETTLE, delay: delay + 0.55 },
                }}
              />
            )}
          </svg>
          <span className="relative">{parts.match}</span>
        </span>
      ) : null}
      {parts.after}
    </Tag>
  );
}
