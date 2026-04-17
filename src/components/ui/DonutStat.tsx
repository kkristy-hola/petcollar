type Props = {
  value: number;
  label: string;
  size?: number;
  stroke?: number;
  activeClass?: string;
  trackClass?: string;
};

export function DonutStat({
  value,
  label,
  size = 132,
  stroke = 12,
  activeClass = "text-primary",
  trackClass = "text-surface-peach",
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;

  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className={trackClass}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className={activeClass}
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold tracking-tight text-primary-deep">
          {value}
          <span className="text-base font-semibold">%</span>
        </span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-teal-muted">
          {label}
        </span>
      </div>
    </div>
  );
}
