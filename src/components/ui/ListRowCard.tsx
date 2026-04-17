import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

type Props = {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  right?: ReactNode;
  /** 为 false 时不展示右侧箭头占位 */
  trailing?: boolean;
  onClick?: () => void;
  className?: string;
};

export function ListRowCard({
  icon,
  title,
  subtitle,
  right,
  trailing = true,
  onClick,
  className = "",
}: Props) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl bg-surface-elevated p-3.5 text-left shadow-[var(--shadow-soft)] ${onClick ? "active:scale-[0.99]" : ""} ${className}`}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-blue/60 text-primary">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-primary-deep">{title}</p>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-teal-muted">{subtitle}</p>
        ) : null}
      </div>
      {right !== undefined
        ? right
        : trailing
          ? (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-peach text-primary">
                <ChevronRight className="h-4 w-4" />
              </span>
            )
          : null}
    </Tag>
  );
}
