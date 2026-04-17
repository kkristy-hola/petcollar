import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
};

export function SoftCard({ children, className = "", as: Tag = "div" }: Props) {
  return (
    <Tag
      className={`rounded-[1.75rem] p-4 shadow-[var(--shadow-soft)] ${className}`}
    >
      {children}
    </Tag>
  );
}
