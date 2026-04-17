import type { ReactNode } from "react";

type Tone = "teal" | "amber" | "rose" | "sky" | "neutral" | "green";

const tones: Record<
  Tone,
  { wrap: string; dot?: string; text: string }
> = {
  teal: {
    wrap: "bg-surface-blue text-secondary",
    text: "font-medium",
  },
  amber: {
    wrap: "bg-surface-peach text-primary-deep",
    text: "font-medium",
  },
  rose: {
    wrap: "bg-rose-100 text-rose-700",
    text: "font-semibold",
  },
  sky: {
    wrap: "bg-sky-100 text-sky-800",
    text: "font-medium",
  },
  neutral: {
    wrap: "bg-stone-200/80 text-stone-700",
    text: "font-medium",
  },
  green: {
    wrap: "bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-500",
    text: "font-semibold",
  },
};

type Props = {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
};

export function StatusBadge({
  children,
  tone = "teal",
  dot,
  className = "",
}: Props) {
  const t = tones[tone];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wide ${t.wrap} ${t.text} ${className}`}
    >
      {dot ? (
        <span
          className={`h-1.5 w-1.5 rounded-full ${t.dot ?? "bg-current opacity-70"}`}
        />
      ) : null}
      {children}
    </span>
  );
}
