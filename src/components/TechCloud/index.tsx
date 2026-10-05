import { useEffect, useRef } from "react";
import {
  siCss,
  siDocker,
  siDocusaurus,
  siExpress,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siLinux,
  siMongodb,
  siMysql,
  siNestjs,
  siNextdotjs,
  siNginx,
  siNodedotjs,
  siPostgresql,
  siPython,
  siPytorch,
  siReact,
  siRedis,
  siSass,
  siTensorflow,
  siTypescript,
  siVite,
  siVuedotjs,
  siWebpack,
} from "simple-icons/icons";

const icons = [
  siReact,
  siTypescript,
  siJavascript,
  siNodedotjs,
  siPython,
  siDocker,
  siGit,
  siGithub,
  siLinux,
  siMongodb,
  siNginx,
  siNextdotjs,
  siNestjs,
  siVite,
  siPytorch,
  siTensorflow,
  siPostgresql,
  siCss,
  siHtml5,
  siExpress,
  siWebpack,
  siSass,
  siDocusaurus,
  siMysql,
  siRedis,
  siVuedotjs,
];
const points = icons.map((_, i) => {
  const y = 1 - (2 * (i + 0.5)) / icons.length,
    r = Math.sqrt(1 - y * y),
    a = i * Math.PI * (3 - Math.sqrt(5));
  return [Math.cos(a) * r, y, Math.sin(a) * r];
});
function project(point: number[], angle: number, pitch: number) {
  const [x, y, z] = point;
  const ax = x * Math.cos(angle) + z * Math.sin(angle),
    az = z * Math.cos(angle) - x * Math.sin(angle);
  const ay = y * Math.cos(pitch) - az * Math.sin(pitch),
    bz = y * Math.sin(pitch) + az * Math.cos(pitch);
  const scale = (bz + 2.5) / 3.2;
  return {
    left: `${50 + ax * 46 * scale}%`,
    top: `${50 + ay * 46 * scale}%`,
    transform: `translate(-50%,-50%) scale(${scale})`,
    opacity: 0.5 + (bz + 1) * 0.25,
    zIndex: Math.round((bz + 1) * 100),
  };
}
export default function TechCloud() {
  const root = useRef<HTMLDivElement>(null);
  const rotation = useRef({ yaw: 0.4, pitch: 0.2 });
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const tiles = Array.from(el.querySelectorAll<HTMLElement>("[data-tech]"));
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false,
      hover = false,
      focused = false,
      frame = 0,
      last = 0;
    let drag: {
      id: number;
      x: number;
      y: number;
    } | null = null;
    function draw() {
      tiles.forEach((tile, i) => {
        Object.assign(tile.style, project(points[i], rotation.current.yaw, rotation.current.pitch));
      });
    }
    function allowed() {
      return visible && !document.hidden && !hover && !focused && !drag && !media.matches;
    }
    function tick(now: number) {
      if (!allowed()) {
        frame = 0;
        last = 0;
        return;
      }
      if (last) rotation.current.yaw += (Math.min(now - last, 50) / 1000) * 0.15;
      last = now;
      draw();
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      if (allowed() && !frame) frame = requestAnimationFrame(tick);
      else if (!allowed()) {
        cancelAnimationFrame(frame);
        frame = 0;
        last = 0;
      }
    }
    const enter = (event: PointerEvent) => {
      if (event.pointerType !== "touch") {
        hover = true;
        sync();
      }
    };
    const leave = () => {
      hover = false;
      sync();
    };
    const focus = () => {
      focused = true;
      sync();
    };
    const blur = (event: FocusEvent) => {
      if (!el.contains(event.relatedTarget as Node)) {
        focused = false;
        sync();
      }
    };
    const down = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return;
      event.preventDefault();
      drag = { id: event.pointerId, x: event.clientX, y: event.clientY };
      el.setPointerCapture(event.pointerId);
      el.dataset.dragging = "true";
      sync();
    };
    const move = (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId) return;
      const sensitivity = Math.PI / Math.max(el.clientWidth, 1);
      rotation.current.yaw += (event.clientX - drag.x) * sensitivity;
      rotation.current.pitch = Math.max(
        -1.2,
        Math.min(1.2, rotation.current.pitch - (event.clientY - drag.y) * sensitivity),
      );
      drag.x = event.clientX;
      drag.y = event.clientY;
      draw();
    };
    const end = (event: PointerEvent) => {
      if (!drag || drag.id !== event.pointerId) return;
      drag = null;
      delete el.dataset.dragging;
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
      sync();
    };
    const key = (event: KeyboardEvent) => {
      const steps: Record<string, [number, number]> = {
        ArrowLeft: [-0.16, 0],
        ArrowRight: [0.16, 0],
        ArrowUp: [0, 0.16],
        ArrowDown: [0, -0.16],
      };
      if (!(event.key in steps)) return;
      event.preventDefault();
      const [yaw, pitch] = steps[event.key];
      rotation.current.yaw += yaw;
      rotation.current.pitch = Math.max(-1.2, Math.min(1.2, rotation.current.pitch + pitch));
      draw();
    };
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
    el.addEventListener("lostpointercapture", end);
    el.addEventListener("keydown", key);
    el.addEventListener("focusin", focus);
    el.addEventListener("focusout", blur);
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", sync);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
      el.removeEventListener("lostpointercapture", end);
      el.removeEventListener("keydown", key);
      el.removeEventListener("focusin", focus);
      el.removeEventListener("focusout", blur);
      document.removeEventListener("visibilitychange", sync);
      media.removeEventListener("change", sync);
    };
  }, []);
  return (
    <section
      className="min-w-0 p-[1.5rem_1.75rem] bg-muted rounded-2xl overflow-hidden [&_>_p]:text-[0.8125rem] [&_>_p]:text-muted-foreground [&_>_p]:m-[0.65rem_0_0] [@media(max-width:_640px)]:p-5 [&_>_.ui-components-techcloud-styles-hint]:text-center [&_>_.ui-components-techcloud-styles-hint]:text-[0.75rem] [&_>_.ui-components-techcloud-styles-hint]:mt-[0.7rem] h-full flex flex-col"
      aria-labelledby="tech-title"
    >
      <div className="flex justify-between items-center gap-4 [&_h2]:text-[1.2rem] [&_h2]:font-[550] [&_h2]:m-0">
        <h2 id="tech-title">探索過的技術</h2>
      </div>
      <p>從 Web 全端開發到 AI，把想法變成實作。</p>
      <div
        ref={root}
        className="relative aspect-[1] max-w-75 w-full mx-auto my-auto isolate cursor-grab touch-none select-none rounded-[12px] data-[dragging='true']:cursor-grabbing [&[data-dragging='true']_.ui-components-techcloud-styles-tooltip]:hidden max-w-75 my-auto"
        role="application"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: 此互動區域需要聚焦，以處理方向鍵與指標旋轉。
        tabIndex={0}
        aria-label="可旋轉的技術圖示雲"
        aria-describedby="tech-hint"
      >
        {icons.map((icon, i) => (
          <span
            key={icon.slug}
            data-tech
            className="absolute w-10.5 h-10.5 grid place-items-center rounded-[7px] outline-offset-[5px] [&_svg]:w-full [&_svg]:h-full [&:hover_.ui-components-techcloud-styles-tooltip]:block"
            style={project(points[i], 0.4, 0.2)}
            role="img"
            aria-label={icon.title}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              style={{
                fill: ["000000", "181717", "222222", "000020", "0A0A0A"].includes(icon.hex)
                  ? "var(--foreground)"
                  : `#${icon.hex}`,
              }}
            >
              <path d={icon.path} />
            </svg>
            <span
              className="ui-components-techcloud-styles-tooltip hidden absolute top-[110%] left-[50%] transform-[translateX(-50%)] [background:var(--foreground)] [color:var(--background)] p-[0.2rem_0.5rem] rounded-lg text-[0.7rem] whitespace-nowrap"
              aria-hidden="true"
            >
              {icon.title}
            </span>
          </span>
        ))}
      </div>
      <p id="tech-hint" className="ui-components-techcloud-styles-hint">
        拖曳或方向鍵旋轉 · 移入時停止自轉
      </p>
    </section>
  );
}
