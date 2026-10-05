import { cn } from "cn";
import type React from "react";

const surfaceVariants = {
  home: "",
  projects:
    "[--grid-size:48px] [--orb-x:20%] [--orb-y:43%] [@media(max-width:_720px)]:[--orb-x:30%] [@media(max-width:_720px)]:[--orb-y:44%]",
  about: "[--grid-size:56px] [--orb-x:88%] [--orb-y:12%]",
  archive:
    "[--grid-size:32px] [--orb-x:50%] [--orb-y:0%] [--grid-ink:color-mix(in_srgb,var(--ifm-color-primary)_10%,transparent)] [--orb-ink:color-mix(in_srgb,var(--ifm-color-primary)_12%,transparent)] in-data-[theme='dark']:[--grid-ink:color-mix(in_srgb,var(--ifm-color-primary)_8%,transparent)] in-data-[theme='dark']:[--orb-ink:color-mix(in_srgb,var(--ifm-color-primary)_9%,transparent)]",
  blog: "[--grid-size:32px] [--orb-x:50%] [--orb-y:0%] [--grid-ink:color-mix(in_srgb,var(--ifm-color-primary)_10%,transparent)] [--orb-ink:color-mix(in_srgb,var(--ifm-color-primary)_12%,transparent)] in-data-[theme='dark']:[--grid-ink:color-mix(in_srgb,var(--ifm-color-primary)_8%,transparent)] in-data-[theme='dark']:[--orb-ink:color-mix(in_srgb,var(--ifm-color-primary)_9%,transparent)]",
};
export default function PageSurface({
  children,
  variant = "home",
}: {
  children: React.ReactNode;
  variant?: "home" | "projects" | "about" | "archive" | "blog";
}) {
  return (
    <div
      className={cn(
        "[--grid-size:40px] [--grid-ink:color-mix(in_srgb,var(--ifm-color-primary)_17%,transparent)] [--orb-ink:color-mix(in_srgb,var(--ifm-color-primary)_23%,transparent)] [--orb-x:78%] [--orb-y:26%] relative isolate flex-1 w-full bg-background [&::before]:[content:''] [&::before]:absolute [&::before]:z-[-1] [&::before]:inset-[0_0_auto] [&::before]:h-[min(100%,1080px)] [&::before]:pointer-events-none [&::before]:bg-[linear-gradient(to_right,var(--grid-ink)_1px,transparent_1px),linear-gradient(to_bottom,var(--grid-ink)_1px,transparent_1px),radial-gradient(ellipse_at_var(--orb-x)_var(--orb-y),var(--orb-ink),transparent_64%),radial-gradient(ellipse_at_10%_12%,color-mix(in_srgb,var(--brand-secondary)_15%,transparent),transparent_42%)] [&::before]:bg-size-[var(--grid-size)_var(--grid-size),var(--grid-size)_var(--grid-size),100%_100%,100%_100%] [&::before]:mask-[linear-gradient(to_bottom,#000_0%,#000_44%,transparent_100%)] in-data-[theme='dark']:[--grid-ink:color-mix(in_srgb,var(--ifm-color-primary)_15%,transparent)] in-data-[theme='dark']:[--orb-ink:color-mix(in_srgb,var(--ifm-color-primary)_14%,transparent)] [@media(max-width:_720px)]:[--orb-x:75%] [@media(max-width:_720px)]:[--orb-y:25%] [@media(max-width:_720px)]:[&::before]:h-[min(100%,1200px)]",
        surfaceVariants[variant],
      )}
    >
      {children}
    </div>
  );
}
