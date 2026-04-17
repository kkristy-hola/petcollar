import type { ReactNode } from "react";

type Props = {
  overline?: string;
  title: string;
  description?: string;
  right?: ReactNode;
};

export function SectionHeader({
  overline,
  title,
  description,
  right,
}: Props) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        {overline ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-muted">
            {overline}
          </p>
        ) : null}
        <h2 className="mt-1 text-2xl font-bold leading-tight tracking-tight text-primary-deep">
          {title}
        </h2>
        {description ? (
          <p className="mt-1.5 text-sm leading-relaxed text-teal-muted">
            {description}
          </p>
        ) : null}
      </div>
      {right}
    </div>
  );
}
